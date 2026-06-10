"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/lib/aptos";
import {
  TreasuryWriteError,
  mapTreasuryWriteError,
} from "@/lib/walletErrors";

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

  const submit = async (
    transaction: InputTransactionData,
    opts?: { onSuccess?: (hash: string) => void | Promise<void> },
  ): Promise<string | null> => {
    setIsPending(true);
    setError(null);
    try {
      const committed = await signAndSubmitTransaction(transaction);
      await getAptosClient().waitForTransaction({
        transactionHash: committed.hash,
      });
      await opts?.onSuccess?.(committed.hash);
      return committed.hash;
    } catch (e) {
      const mapped = mapTreasuryWriteError(e);
      setError(mapped);
      return null;
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["treasury"] });
      setIsPending(false);
    }
  };

  return { submit, isPending, error, clearError: () => setError(null) };
}
