"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/lib/aptos";
import { TreasuryWriteError, mapTreasuryWriteError } from "@/lib/walletErrors";

/**
 * Canonical treasury write flow (mirrors CreateMessage.tsx):
 * signAndSubmitTransaction → waitForTransaction → onSuccess →
 * invalidate ["treasury"] reads. Failures map to explicit T4 error states;
 * stale-sequence-number additionally refreshes reads since the proposal
 * list is known to be outdated.
 */
export function useMultisigWrite() {
  const { signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<TreasuryWriteError | null>(null);
  // Synchronous re-entrancy lock: React state updates flush async, so two
  // rapid clicks could both pass an isPending check — a ref cannot race.
  const inFlight = useRef(false);

  const submit = async (
    transaction: InputTransactionData,
    opts?: { onSuccess?: (hash: string) => void | Promise<void> },
  ): Promise<string | null> => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setIsPending(true);
    setError(null);
    try {
      let committedHash: string;
      try {
        const committed = await signAndSubmitTransaction(transaction);
        await getAptosClient().waitForTransaction({
          transactionHash: committed.hash,
        });
        committedHash = committed.hash;
      } catch (e) {
        setError(mapTreasuryWriteError(e));
        return null;
      }
      // The transaction IS committed past this point — a failing post-commit
      // callback (toast, metadata save) must never report it as failed.
      try {
        await opts?.onSuccess?.(committedHash);
      } catch (e) {
        setError({
          kind: "unknown",
          raw: `Transaction ${committedHash} is confirmed on-chain, but a follow-up step failed: ${
            e instanceof Error ? e.message : String(e)
          }`,
        });
      }
      return committedHash;
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["treasury"] });
      setIsPending(false);
      inFlight.current = false;
    }
  };

  return { submit, isPending, error, clearError: () => setError(null) };
}
