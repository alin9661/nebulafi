"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { useQuery } from "@tanstack/react-query";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MULTISIG_ADDRESS, NETWORK } from "@/constants";
import { useMultisigWrite } from "@/hooks/useMultisigWrite";
import {
  TREASURY_ERROR_MESSAGES,
  TreasuryWriteError,
} from "@/lib/walletErrors";
import { formatApt, parseAptToOctas, shortAddr } from "@/lib/octas";
import { getMultisigInfo } from "@/view-functions/getOwners";
import {
  PendingMultisigTransaction,
  getPendingTransactions,
} from "@/view-functions/getPendingTransactions";
import { approveTransfer } from "@/entry-functions/approveTransfer";
import { rejectTransfer } from "@/entry-functions/rejectTransfer";
import { executeTransfer } from "@/entry-functions/executeTransfer";
import { proposeTransfer } from "@/entry-functions/proposeTransfer";
import {
  getProposalMetadataOnServer,
  upsertProposalMetadataOnServer,
} from "@/app/actions";
import { TransactionOnExplorer } from "@/components/ExplorerLink";

type ProposalMetadataRow = Awaited<
  ReturnType<typeof getProposalMetadataOnServer>
>[number];

type NewProposalFields = {
  title: string;
  description: string;
  recipient: string;
  amountOctas: bigint;
};

export function GovernanceLive() {
  if (!MULTISIG_ADDRESS) {
    return <GovernanceNotConfigured />;
  }
  return <GovernanceLiveBody multisigAddress={MULTISIG_ADDRESS} />;
}

function GovernanceNotConfigured() {
  return (
    <div className="px-6 py-24 max-w-[1280px] mx-auto flex justify-center">
      <Card className="max-w-md p-8 text-center">
        <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground mb-3">
          Treasury not configured
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Set <code className="font-mono">NEXT_PUBLIC_MULTISIG_ADDRESS</code> (
          <code className="font-mono">
            bun run scripts/bootstrap-multisig.testnet.ts
          </code>
          ).
        </p>
      </Card>
    </div>
  );
}

function GovernanceLiveBody({ multisigAddress }: { multisigAddress: string }) {
  const { account, connected } = useWallet();
  const { toast } = useToast();
  const { submit, isPending, error, clearError } = useMultisigWrite();
  // Which proposal the in-flight write belongs to: a sequence number string,
  // or "new" for the New Proposal dialog — so only that card shows the
  // spinner and the inline error.
  const [activeSeq, setActiveSeq] = useState<string | null>(null);
  const [showNewProposal, setShowNewProposal] = useState(false);

  const infoQuery = useQuery({
    queryKey: ["treasury", "info", multisigAddress],
    queryFn: () => getMultisigInfo(multisigAddress),
    staleTime: 10_000,
  });
  const pendingQuery = useQuery({
    queryKey: ["treasury", "pending", multisigAddress],
    queryFn: () => getPendingTransactions(multisigAddress),
    staleTime: 10_000,
  });
  const metadataQuery = useQuery({
    queryKey: ["treasury", "metadata", multisigAddress],
    queryFn: () =>
      getProposalMetadataOnServer({ multisigAddr: multisigAddress }),
    staleTime: 10_000,
  });

  // T4: cancelling in the wallet is non-blocking — a muted toast, never an
  // inline destructive alert.
  useEffect(() => {
    if (error?.kind === "user-rejected") {
      toast({ title: "Cancelled in wallet" });
      clearError();
    }
  }, [error, toast, clearError]);

  const walletAddr = useMemo(() => {
    if (!account?.address) return null;
    try {
      return AccountAddress.from(account.address.toString()).toString();
    } catch {
      return null;
    }
  }, [account]);

  const owners = infoQuery.data?.owners;
  const isOwner = useMemo(() => {
    if (!connected || !walletAddr || !owners) return false;
    // Normalize both sides — the wallet may report short-form addresses.
    return owners.some((owner) => {
      try {
        return AccountAddress.from(owner).toString() === walletAddr;
      } catch {
        return false;
      }
    });
  }, [connected, walletAddr, owners]);

  const metadataBySeq = useMemo(() => {
    const map = new Map<number, ProposalMetadataRow>();
    for (const row of metadataQuery.data ?? []) map.set(row.seq_no, row);
    return map;
  }, [metadataQuery.data]);

  const info = infoQuery.data;
  const pending = pendingQuery.data;
  const readsError = infoQuery.isError || pendingQuery.isError;

  const runAction = async (
    seq: bigint,
    transaction: InputTransactionData,
    onSuccess?: (hash: string) => void | Promise<void>,
  ) => {
    if (isPending) return;
    clearError();
    setActiveSeq(seq.toString());
    await submit(transaction, { onSuccess });
  };

  const createProposal = async (
    fields: NewProposalFields,
  ): Promise<boolean> => {
    if (!info || !pending || isPending) return false;
    // Predict the next sequence number from already-fetched reads. The race
    // window (another owner proposing between this read and our submit) is
    // acceptable for M1 — the metadata upsert is keyed to this predicted seq.
    const predictedSeq =
      info.lastResolvedSequenceNumber + 1n + BigInt(pending.length);
    clearError();
    setActiveSeq("new");
    const hash = await submit(
      proposeTransfer({
        multisigAddress,
        recipient: fields.recipient,
        amountOctas: fields.amountOctas,
      }),
      {
        onSuccess: async (committedHash) => {
          try {
            await upsertProposalMetadataOnServer({
              multisigAddr: multisigAddress,
              seqNo: Number(predictedSeq),
              title: fields.title,
              description: fields.description,
            });
            toast({
              title: "Proposal created",
              description: <TransactionOnExplorer hash={committedHash} />,
            });
          } catch {
            // The on-chain proposal still renders untitled — never silently
            // lost, but the user must know the title didn't persist.
            toast({
              variant: "destructive",
              title: "Proposal created on-chain, but saving the title failed",
            });
          }
        },
      },
    );
    return hash !== null;
  };

  const inlineError = error && error.kind !== "user-rejected" ? error : null;

  return (
    <div className="space-y-12 px-6 py-12 max-w-[1280px] mx-auto">
      {/* Page header */}
      <header className="flex flex-col gap-6 pb-8 border-b border-border md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Governance ·{" "}
            <span className="font-mono text-foreground">
              {NETWORK.toUpperCase()}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05] mb-3 text-foreground">
            Proposals
          </h1>
          <p className="text-sm text-muted-foreground">
            On-chain multisig proposals ·{" "}
            <span className="font-mono text-foreground">
              {shortAddr(multisigAddress)}
            </span>
          </p>
        </div>
        <Button
          onClick={() => setShowNewProposal(true)}
          disabled={!info || !pending}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Button>
      </header>

      {readsError ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {"Couldn't load from the fullnode"}
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              void infoQuery.refetch();
              void pendingQuery.refetch();
              void metadataQuery.refetch();
            }}
          >
            Retry
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats row */}
          {info && pending ? (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Pending Proposals"
                value={pending.length.toString()}
              />
              <StatCard
                label="Resolved"
                value={info.lastResolvedSequenceNumber.toString()}
              />
              <StatCard
                label="Active Signers"
                value={info.owners.length.toString()}
              />
              <StatCard
                label="Threshold"
                value={`${info.numSignaturesRequired} / ${info.owners.length}`}
              />
            </section>
          ) : (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[104px] animate-pulse rounded-lg border border-border bg-card"
                />
              ))}
            </section>
          )}

          {/* Proposal list — pending only in M1 (no Passed/Failed tabs yet) */}
          <section className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Showing pending on-chain transactions · resolved history lands
              with the indexer (M2)
            </p>
            {info && pending ? (
              pending.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No pending proposals — propose a transfer from the Treasury
                  page or with New Proposal.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pending.map((txn) => {
                    const seqStr = txn.sequenceNumber.toString();
                    return (
                      <LiveProposalCard
                        key={seqStr}
                        txn={txn}
                        meta={metadataBySeq.get(Number(txn.sequenceNumber))}
                        threshold={info.numSignaturesRequired}
                        connected={connected}
                        isOwner={isOwner}
                        busy={isPending && activeSeq === seqStr}
                        error={activeSeq === seqStr ? inlineError : null}
                        onDismissError={clearError}
                        onApprove={() =>
                          void runAction(
                            txn.sequenceNumber,
                            approveTransfer({
                              multisigAddress,
                              sequenceNumber: txn.sequenceNumber,
                            }),
                          )
                        }
                        onReject={() =>
                          void runAction(
                            txn.sequenceNumber,
                            rejectTransfer({
                              multisigAddress,
                              sequenceNumber: txn.sequenceNumber,
                            }),
                          )
                        }
                        onExecute={() => {
                          const recipient = txn.decoded?.recipient;
                          const amountOctas = txn.decoded?.amountOctas;
                          if (
                            !recipient ||
                            amountOctas === null ||
                            amountOctas === undefined
                          )
                            return;
                          void runAction(
                            txn.sequenceNumber,
                            executeTransfer({
                              multisigAddress,
                              recipient,
                              amountOctas,
                            }),
                            (hash) => {
                              toast({
                                title: "Executed",
                                description: (
                                  <TransactionOnExplorer hash={hash} />
                                ),
                              });
                            },
                          );
                        }}
                      />
                    );
                  })}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-lg border border-border bg-card"
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <NewProposalDialog
        open={showNewProposal}
        onClose={() => setShowNewProposal(false)}
        connected={connected}
        isPending={isPending && activeSeq === "new"}
        error={activeSeq === "new" ? inlineError : null}
        onDismissError={clearError}
        onCreate={createProposal}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {label}
      </div>
      <div className="font-mono tabular-nums text-3xl font-medium text-foreground leading-[1.1]">
        {value}
      </div>
    </Card>
  );
}

function errorCopyFor(err: TreasuryWriteError, deficit: number): string {
  if (err.kind === "unknown") {
    return "Something went wrong submitting the transaction — check the explorer and try again.";
  }
  if (err.kind === "threshold-not-met" && deficit > 0) {
    return `Needs ${deficit} more approval${deficit === 1 ? "" : "s"}.`;
  }
  return TREASURY_ERROR_MESSAGES[err.kind];
}

function InlineWriteError({
  error,
  deficit,
  onDismiss,
}: {
  error: TreasuryWriteError;
  deficit: number;
  onDismiss: () => void;
}) {
  return (
    <div className="mt-4 flex items-start justify-between gap-3 rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <span>{errorCopyFor(error, deficit)}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs underline underline-offset-2 shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
}

function LiveProposalCard({
  txn,
  meta,
  threshold,
  connected,
  isOwner,
  busy,
  error,
  onDismissError,
  onApprove,
  onReject,
  onExecute,
}: {
  txn: PendingMultisigTransaction;
  meta: ProposalMetadataRow | undefined;
  threshold: number;
  connected: boolean;
  isOwner: boolean;
  busy: boolean;
  error: TreasuryWriteError | null;
  onDismissError: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExecute: () => void;
}) {
  const seqStr = txn.sequenceNumber.toString();
  // Decoded payloads whose transfer fields are null are unrecognized calls —
  // render them as such, never guess.
  const transfer =
    txn.decoded &&
    txn.decoded.recipient !== null &&
    txn.decoded.amountOctas !== null
      ? {
          recipient: txn.decoded.recipient,
          amountOctas: txn.decoded.amountOctas,
        }
      : null;
  const title =
    meta?.title ??
    (transfer
      ? `Transfer ${formatApt(transfer.amountOctas)} APT to ${shortAddr(transfer.recipient)}`
      : "Unrecognized payload");
  const description = meta?.description?.trim()
    ? meta.description
    : transfer
      ? "On-chain transfer proposal (no off-chain description)."
      : "Payload could not be decoded — verify on the explorer before approving.";
  const approvalPct = Math.min((txn.approvals.length / threshold) * 100, 100);
  const ready = txn.canBeExecuted;
  const canAct = connected && isOwner && !busy;

  return (
    <Card className="flex flex-col p-6 hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between gap-4 mb-5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold uppercase tracking-[0.08em]",
            ready
              ? "border-success/25 bg-success-tint text-success"
              : "border-primary/25 bg-primary-tint text-primary",
          )}
        >
          {ready ? "Ready" : "Voting"}{" "}
          <span className="font-mono tabular-nums">
            {txn.approvals.length}/{threshold}
          </span>
        </span>
        <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
          {shortAddr(txn.creator)} ·{" "}
          {new Date(txn.creationTimeSecs * 1000).toLocaleDateString()}
        </span>
      </div>

      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
        Treasury · <span className="font-mono tabular-nums">#{seqStr}</span>
      </div>
      <h3 className="font-display text-2xl font-medium tracking-[-0.01em] leading-[1.2] text-foreground mb-3">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
        {description}
      </p>

      {/* Approval bar */}
      <div className="space-y-2 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          <span>
            Approvals{" "}
            <span className="font-mono tabular-nums text-foreground ml-1">
              {txn.approvals.length}/{threshold}
            </span>
          </span>
          {txn.rejections.length > 0 && (
            <span className="text-destructive">
              Rejections{" "}
              <span className="font-mono tabular-nums ml-1">
                {txn.rejections.length}
              </span>
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden bg-border">
          <div
            className="h-full bg-success"
            style={{ width: `${approvalPct}%` }}
          />
        </div>
      </div>

      <div className="pt-5 mt-5 border-t border-border">
        {connected && !isOwner ? (
          <p className="text-xs text-muted-foreground">
            Only multisig owners can vote
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canAct}
                onClick={onApprove}
              >
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canAct}
                onClick={onReject}
                className="text-muted-foreground hover:text-destructive"
              >
                Reject
              </Button>
              {ready && transfer && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canAct}
                  onClick={onExecute}
                  className="border-success/40 text-success hover:bg-success-tint hover:text-success"
                >
                  Execute
                </Button>
              )}
              {busy && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {!connected && (
              <p className="text-xs text-muted-foreground mt-2">
                Connect wallet to vote
              </p>
            )}
          </>
        )}
        {error && (
          <InlineWriteError
            error={error}
            deficit={threshold - txn.approvals.length}
            onDismiss={onDismissError}
          />
        )}
      </div>
    </Card>
  );
}

/**
 * M1 New Proposal flow: a proposal IS an on-chain transfer plus off-chain
 * title/description, so this local dialog (not the mock's ProposalModal,
 * which lacks recipient/amount fields) collects all four inputs.
 */
function NewProposalDialog({
  open,
  onClose,
  connected,
  isPending,
  error,
  onDismissError,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  connected: boolean;
  isPending: boolean;
  error: TreasuryWriteError | null;
  onDismissError: () => void;
  onCreate: (fields: NewProposalFields) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  if (!open) return null;

  const titleValid = title.trim().length > 0;
  const recipientValid = (() => {
    try {
      AccountAddress.from(recipient);
      return true;
    } catch {
      return false;
    }
  })();
  const amountOctas = parseAptToOctas(amount);
  const formValid = titleValid && recipientValid && amountOctas !== null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid || !connected || isPending || amountOctas === null) return;
    const ok = await onCreate({
      title: title.trim(),
      description: description.trim(),
      recipient: AccountAddress.from(recipient).toString(),
      amountOctas,
    });
    if (ok) {
      setTitle("");
      setDescription("");
      setRecipient("");
      setAmount("");
      setTouched(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="New proposal"
    >
      <Card className="w-full max-w-md border-border bg-card p-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-1">
          Governance
        </div>
        <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground mb-5">
          New Proposal
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <FieldLabel htmlFor="proposal-title">Title</FieldLabel>
            <Input
              id="proposal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fund the spring hackathon"
              disabled={isPending}
            />
            {touched && !titleValid && (
              <FieldError>Title is required.</FieldError>
            )}
          </div>
          <div>
            <FieldLabel htmlFor="proposal-description">
              Description (optional)
            </FieldLabel>
            <Textarea
              id="proposal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this transfer for?"
              disabled={isPending}
            />
          </div>
          <div>
            <FieldLabel htmlFor="proposal-recipient">Recipient</FieldLabel>
            <Input
              id="proposal-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x…"
              className="font-mono"
              disabled={isPending}
            />
            {touched && !recipientValid && (
              <FieldError>Enter a valid Aptos address.</FieldError>
            )}
          </div>
          <div>
            <FieldLabel htmlFor="proposal-amount">Amount (APT)</FieldLabel>
            <Input
              id="proposal-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.05"
              inputMode="decimal"
              className="font-mono tabular-nums"
              disabled={isPending}
            />
            {touched && amountOctas === null && (
              <FieldError>
                Enter a positive APT amount (up to 8 decimals).
              </FieldError>
            )}
          </div>

          {error && (
            <InlineWriteError
              error={error}
              deficit={0}
              onDismiss={onDismissError}
            />
          )}

          {!connected && (
            <p className="text-xs text-muted-foreground">
              Connect wallet to submit this proposal.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!connected || isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create proposal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-1.5"
    >
      {children}
    </label>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <p className="text-xs text-destructive mt-1.5">{children}</p>;
}
