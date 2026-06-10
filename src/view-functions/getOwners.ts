import { getAptosClient } from "@/lib/aptos";

export type MultisigInfo = {
  owners: string[];
  numSignaturesRequired: number;
  lastResolvedSequenceNumber: bigint;
};

export const getMultisigInfo = async (
  multisigAddress: string,
): Promise<MultisigInfo> => {
  const client = getAptosClient();
  const [[owners], [numSignaturesRequired], [lastResolvedSequenceNumber]] =
    await Promise.all([
      client.view<[string[]]>({
        payload: {
          function: "0x1::multisig_account::owners",
          functionArguments: [multisigAddress],
        },
      }),
      client.view<[string]>({
        payload: {
          function: "0x1::multisig_account::num_signatures_required",
          functionArguments: [multisigAddress],
        },
      }),
      client.view<[string]>({
        payload: {
          function: "0x1::multisig_account::last_resolved_sequence_number",
          functionArguments: [multisigAddress],
        },
      }),
    ]);
  return {
    owners,
    numSignaturesRequired: Number(numSignaturesRequired),
    lastResolvedSequenceNumber: BigInt(lastResolvedSequenceNumber),
  };
};

export const getOwners = async (multisigAddress: string): Promise<string[]> =>
  (await getMultisigInfo(multisigAddress)).owners;
