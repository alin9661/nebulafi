"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, X } from "lucide-react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MULTISIG_ADDRESS, NETWORK } from "@/constants";
import { formatApt, parseAptToOctas, shortAddr } from "@/lib/octas";
import { useMultisigWrite } from "@/hooks/useMultisigWrite";
import {
  TREASURY_ERROR_MESSAGES,
  type TreasuryWriteError,
} from "@/lib/walletErrors";
import { getMultisigBalance } from "@/view-functions/getMultisigBalance";
import { getMultisigInfo, type MultisigInfo } from "@/view-functions/getOwners";
import {
  getPendingTransactions,
  type PendingMultisigTransaction,
} from "@/view-functions/getPendingTransactions";
import { depositToTreasury } from "@/entry-functions/depositToTreasury";
import { proposeTransfer } from "@/entry-functions/proposeTransfer";
import { TransactionOnExplorer } from "@/components/ExplorerLink";

export function TreasuryLive() {
  if (!MULTISIG_ADDRESS) {
    return (
      <div className="px-6 py-24 max-w-[1280px] mx-auto flex justify-center">
        <Card className="max-w-md p-8 text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Treasury
          </div>
          <h1 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground mb-3">
            Treasury not configured
          </h1>
          <p className="text-sm text-muted-foreground">
            Set{" "}
            <span className="font-mono text-foreground">
              NEXT_PUBLIC_MULTISIG_ADDRESS
            </span>{" "}
            (
            <span className="font-mono">
              bun run scripts/bootstrap-multisig.testnet.ts
            </span>
            )
          </p>
        </Card>
      </div>
    );
  }
  return <TreasuryLiveBody multisigAddress={MULTISIG_ADDRESS} />;
}

function TreasuryLiveBody({ multisigAddress }: { multisigAddress: string }) {
  const { toast } = useToast();
  const { connected } = useWallet();
  const { submit, isPending, error, clearError } = useMultisigWrite();

  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const balanceQuery = useQuery({
    queryKey: ["treasury", "balance", multisigAddress],
    queryFn: () => getMultisigBalance(multisigAddress),
    staleTime: 10_000,
  });
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

  // User-rejected is non-blocking: muted toast, never the inline alert.
  useEffect(() => {
    if (error?.kind === "user-rejected") {
      toast({ title: "Cancelled in wallet" });
      clearError();
    }
  }, [error, toast, clearError]);

  const info = infoQuery.data;
  const explorerAccountUrl = `https://explorer.aptoslabs.com/account/${multisigAddress}?network=${NETWORK}`;

  // M1 is APT-only — dialogs validate and parse amounts before calling these.
  const handleDepositSubmit = async (amountOctas: bigint): Promise<boolean> => {
    clearError();
    const hash = await submit(
      depositToTreasury({ multisigAddress, amountOctas }),
      {
        onSuccess: (txnHash) => {
          toast({
            title: "Deposit confirmed",
            description: <TransactionOnExplorer hash={txnHash} />,
          });
        },
      },
    );
    setShowDepositDialog(false);
    return hash !== null;
  };

  const handleSendSubmit = async (
    recipient: string,
    amountOctas: bigint,
  ): Promise<boolean> => {
    clearError();
    const hash = await submit(
      proposeTransfer({ multisigAddress, recipient, amountOctas }),
      {
        onSuccess: (txnHash) => {
          toast({
            title: info
              ? `Transfer proposed — needs ${info.numSignaturesRequired} approvals`
              : "Transfer proposed — awaiting owner approvals",
            description: <TransactionOnExplorer hash={txnHash} />,
          });
        },
      },
    );
    setShowSendDialog(false);
    return hash !== null;
  };

  const inlineError =
    error && error.kind !== "user-rejected" ? writeErrorMessage(error) : null;

  return (
    <div className="space-y-12 px-6 py-12 max-w-[1280px] mx-auto">
      {/* Page header */}
      <header className="flex flex-col gap-6 pb-8 border-b border-border md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Dashboard ·{" "}
            <span className="font-mono text-foreground">TESTNET</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05] mb-3 text-foreground">
            Treasury Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            NYU Blockchain Lab · Live from Aptos testnet · multisig{" "}
            <span className="font-mono text-foreground tabular-nums">
              {shortAddr(multisigAddress)}
            </span>{" "}
            · seq{" "}
            <span className="font-mono text-foreground tabular-nums">
              #{info ? info.lastResolvedSequenceNumber.toString() : "—"}
            </span>{" "}
            resolved
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 shrink-0 md:items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSendDialog(true)}
              disabled={!connected || isPending}
              className="gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Send
            </Button>
            <Button
              onClick={() => setShowDepositDialog(true)}
              disabled={!connected || isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Deposit
            </Button>
          </div>
          {!connected && (
            <p className="text-xs text-muted-foreground">
              Connect wallet to deposit or send.
            </p>
          )}
        </div>
      </header>

      {/* Inline write error (all non-user-rejected kinds) */}
      {inlineError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive"
        >
          <span>{inlineError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={clearError}
            className="shrink-0 text-destructive hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Treasury Balance"
          query={balanceQuery}
          render={(balance) => `${formatApt(balance)} APT`}
          meta="On-chain APT"
        />
        <KpiCard
          label="Pending Proposals"
          query={pendingQuery}
          render={(pending) => `${pending.length}`}
          meta="awaiting signatures"
        />
        <KpiCard
          label="Multisig Threshold"
          query={infoQuery}
          render={(i: MultisigInfo) =>
            `${i.numSignaturesRequired} / ${i.owners.length}`
          }
          meta="Quorum requirement"
        />
        <KpiCard
          label="Owners"
          query={infoQuery}
          render={(i: MultisigInfo) => `${i.owners.length}`}
          meta="authorized signers"
        />
      </section>

      {/* Holdings */}
      <section>
        <Card className="overflow-hidden">
          <div className="flex items-baseline justify-between px-6 pt-6 pb-4 border-b border-border">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-foreground m-0">
              Holdings
            </h2>
            <a
              className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground"
              href={explorerAccountUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on explorer →
            </a>
          </div>
          {balanceQuery.isPending ? (
            <SectionSkeleton rows={1} />
          ) : balanceQuery.isError ? (
            <SectionError onRetry={() => balanceQuery.refetch()} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Asset
                    </th>
                    <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Balance
                    </th>
                    <th className="text-right px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Network
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border last:border-b-0">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-sm bg-info" />
                        APT
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          Aptos
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-foreground">
                      {formatApt(balanceQuery.data)}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      Aptos Testnet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Pending transactions */}
      <section>
        <Card className="overflow-hidden">
          <div className="flex items-baseline justify-between px-6 pt-6 pb-4 border-b border-border">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-foreground m-0">
              Pending Transactions
            </h2>
            <a
              className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground"
              href={explorerAccountUrl}
              target="_blank"
              rel="noreferrer"
            >
              Multisig account →
            </a>
          </div>
          {pendingQuery.isPending ? (
            <SectionSkeleton rows={3} />
          ) : pendingQuery.isError ? (
            <SectionError onRetry={() => pendingQuery.refetch()} />
          ) : pendingQuery.data.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No pending transactions — the queue is clear.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {pendingQuery.data.map((tx) => (
                <PendingRow
                  key={tx.sequenceNumber.toString()}
                  tx={tx}
                  numSignaturesRequired={info?.numSignaturesRequired ?? null}
                  explorerAccountUrl={explorerAccountUrl}
                />
              ))}
            </ul>
          )}
        </Card>
      </section>

      <DepositDialog
        open={showDepositDialog}
        onClose={() => setShowDepositDialog(false)}
        multisigAddress={multisigAddress}
        isPending={isPending}
        onSubmit={handleDepositSubmit}
      />

      <SendDialog
        open={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        info={info ?? null}
        isPending={isPending}
        onSubmit={handleSendSubmit}
      />
    </div>
  );
}

/**
 * Local light-mode dialogs (mirroring GovernanceLive's NewProposalDialog) for
 * the REAL treasury writes — the legacy dark-glass DepositModal/SendModal
 * remain mock-page-only.
 */
function DepositDialog({
  open,
  onClose,
  multisigAddress,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  multisigAddress: string;
  isPending: boolean;
  onSubmit: (amountOctas: bigint) => Promise<boolean>;
}) {
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const amountOctas = parseAptToOctas(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (amountOctas === null || isPending) return;
    const ok = await onSubmit(amountOctas);
    if (ok) {
      setAmount("");
      setTouched(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(multisigAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — the address below is select-all on click.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Deposit to treasury"
    >
      <Card className="w-full max-w-md border-border bg-card p-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-1">
          Treasury
        </div>
        <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground mb-5">
          Deposit
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-1.5">
              Treasury address
            </div>
            <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <span className="font-mono text-xs text-foreground break-all select-all">
                {multisigAddress}
              </span>
              <button
                type="button"
                onClick={() => void copyAddress()}
                className="shrink-0 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="deposit-amount">Amount (APT)</FieldLabel>
            <Input
              id="deposit-amount"
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
              disabled={isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Deposit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function SendDialog({
  open,
  onClose,
  info,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  info: MultisigInfo | null;
  isPending: boolean;
  onSubmit: (recipient: string, amountOctas: bigint) => Promise<boolean>;
}) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  if (!open) return null;

  const recipientValid = isValidRecipient(recipient.trim());
  const amountOctas = parseAptToOctas(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!recipientValid || amountOctas === null || isPending) return;
    const ok = await onSubmit(
      AccountAddress.from(recipient.trim()).toString(),
      amountOctas,
    );
    if (ok) {
      setRecipient("");
      setAmount("");
      setTouched(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Propose transfer"
    >
      <Card className="w-full max-w-md border-border bg-card p-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-1">
          Treasury
        </div>
        <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground mb-5">
          Propose Transfer
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <FieldLabel htmlFor="send-recipient">Recipient</FieldLabel>
            <Input
              id="send-recipient"
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
            <FieldLabel htmlFor="send-amount">Amount (APT)</FieldLabel>
            <Input
              id="send-amount"
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
          {info && (
            <div className="rounded-md border border-border px-3 py-2.5 text-xs text-muted-foreground">
              Requires{" "}
              <span className="font-mono tabular-nums text-foreground">
                {info.numSignaturesRequired}
              </span>{" "}
              of{" "}
              <span className="font-mono tabular-nums text-foreground">
                {info.owners.length}
              </span>{" "}
              approvals before execution.
            </div>
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
              disabled={isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Propose transfer
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
  children: React.ReactNode;
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

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-destructive mt-1.5">{children}</p>;
}

function isValidRecipient(addr: string): boolean {
  if (!/^0x[0-9a-fA-F]{1,64}$/.test(addr)) return false;
  try {
    AccountAddress.from(addr);
    return true;
  } catch {
    return false;
  }
}

function writeErrorMessage(error: TreasuryWriteError): string {
  if (error.kind === "unknown") {
    return `Transaction failed: ${error.raw.slice(0, 240)}`;
  }
  return TREASURY_ERROR_MESSAGES[error.kind];
}

function KpiCard<T>({
  label,
  query,
  render,
  meta,
}: {
  label: string;
  query: UseQueryResult<T, Error>;
  render: (data: T) => string;
  meta: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {label}
      </div>
      {query.isPending ? (
        <div className="h-9 w-28 mb-1 animate-pulse rounded-sm border border-border bg-muted" />
      ) : query.isError ? (
        <div className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
          <span>Couldn’t load from the fullnode</span>
          <Button variant="ghost" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="font-mono tabular-nums text-3xl font-medium text-foreground leading-[1.1] mb-1">
          {render(query.data)}
        </div>
      )}
      <div className="text-xs text-muted-foreground">{meta}</div>
    </Card>
  );
}

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <div className="px-6 py-6 space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-sm border border-border bg-muted"
        />
      ))}
    </div>
  );
}

function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="px-6 py-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
      <span>Couldn’t load from the fullnode</span>
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function PendingRow({
  tx,
  numSignaturesRequired,
  explorerAccountUrl,
}: {
  tx: PendingMultisigTransaction;
  numSignaturesRequired: number | null;
  explorerAccountUrl: string;
}) {
  const transfer =
    tx.decoded &&
    tx.decoded.recipient !== null &&
    tx.decoded.amountOctas !== null
      ? { recipient: tx.decoded.recipient, amountOctas: tx.decoded.amountOctas }
      : null;
  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 text-sm">
      <span className="font-mono tabular-nums text-muted-foreground">
        #{tx.sequenceNumber.toString()}
      </span>
      <div className="min-w-0">
        <div className="text-foreground">
          {transfer ? (
            <>
              Send{" "}
              <span className="font-mono tabular-nums font-medium">
                {formatApt(transfer.amountOctas)} APT
              </span>{" "}
              →{" "}
              <span className="font-mono text-muted-foreground">
                {shortAddr(transfer.recipient)}
              </span>
            </>
          ) : (
            <>
              Unrecognized payload —{" "}
              <a
                href={explorerAccountUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                verify on explorer
              </a>
            </>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          by <span className="font-mono">{shortAddr(tx.creator)}</span> ·{" "}
          <span className="font-mono tabular-nums">
            {new Date(tx.creationTimeSecs * 1000).toISOString().slice(0, 10)}
          </span>
        </div>
      </div>
      <ApprovalPill
        approvals={tx.approvals.length}
        required={numSignaturesRequired}
        ready={tx.canBeExecuted}
      />
    </li>
  );
}

function ApprovalPill({
  approvals,
  required,
  ready,
}: {
  approvals: number;
  required: number | null;
  ready: boolean;
}) {
  const count = `${approvals} / ${required ?? "—"}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold uppercase tracking-[0.08em]",
        ready
          ? "border-success/25 bg-success-tint text-success"
          : "border-warning/25 bg-warning-tint text-warning",
      )}
    >
      {ready ? "Ready" : "Awaiting"} ·{" "}
      <span className="font-mono tabular-nums">{count}</span>
    </span>
  );
}
