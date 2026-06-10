import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type ExecuteTransferArguments = {
  multisigAddress: string;
  recipient: string;
  amountOctas: bigint;
};

/**
 * Executes an approved multisig transfer. The `multisigAddress` field makes
 * the adapter build a TransactionPayloadMultiSig: the executing owner signs
 * and pays gas, while the chain matches this inner payload byte-for-byte
 * against the stored proposal (EPAYLOAD_DOES_NOT_MATCH on any drift).
 */
export const executeTransfer = (
  args: ExecuteTransferArguments,
): InputTransactionData => {
  const { multisigAddress, recipient, amountOctas } = args;
  return {
    data: {
      multisigAddress,
      function: "0x1::aptos_account::transfer",
      functionArguments: [recipient, amountOctas.toString()],
    },
  };
};
