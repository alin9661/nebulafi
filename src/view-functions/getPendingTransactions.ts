import { getAptosClient } from "@/lib/aptos";
import {
  DecodedMultisigPayload,
  decodeMultisigPayload,
} from "@/lib/multisigPayload";

type RawMultisigTransaction = {
  payload: { vec: [] | [string] };
  payload_hash: { vec: [] | [string] };
  votes: { data: { key: string; value: boolean }[] };
  creator: string;
  creation_time_secs: string;
};

export type PendingMultisigTransaction = {
  sequenceNumber: bigint;
  creator: string;
  creationTimeSecs: number;
  approvals: string[];
  rejections: string[];
  decoded: DecodedMultisigPayload | null;
  payloadHex: string | null;
  canBeExecuted: boolean;
};

export const getPendingTransactions = async (
  multisigAddress: string,
): Promise<PendingMultisigTransaction[]> => {
  const client = getAptosClient();
  const [pendingResponse, [lastResolved]] = await Promise.all([
    client.view({
      payload: {
        function: "0x1::multisig_account::get_pending_transactions",
        functionArguments: [multisigAddress],
      },
    }) as Promise<unknown> as Promise<[RawMultisigTransaction[]]>,
    client.view<[string]>({
      payload: {
        function: "0x1::multisig_account::last_resolved_sequence_number",
        functionArguments: [multisigAddress],
      },
    }),
  ]);
  const [rawTransactions] = pendingResponse;

  return Promise.all(
    rawTransactions.map(async (raw, index) => {
      // MultisigTransaction carries no sequence number on-chain; back-compute
      // it from the last resolved sequence number and the list position.
      const sequenceNumber = BigInt(lastResolved) + 1n + BigInt(index);
      const [canBeExecuted] = await client.view<[boolean]>({
        payload: {
          function: "0x1::multisig_account::can_be_executed",
          functionArguments: [multisigAddress, sequenceNumber.toString()],
        },
      });
      const payloadHex = raw.payload.vec[0] ?? null;
      return {
        sequenceNumber,
        creator: raw.creator,
        creationTimeSecs: Number(raw.creation_time_secs),
        approvals: raw.votes.data
          .filter((vote) => vote.value === true)
          .map((vote) => vote.key),
        rejections: raw.votes.data
          .filter((vote) => vote.value === false)
          .map((vote) => vote.key),
        decoded: payloadHex ? decodeMultisigPayload(payloadHex) : null,
        payloadHex,
        canBeExecuted,
      };
    }),
  );
};
