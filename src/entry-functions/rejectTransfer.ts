import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type RejectTransferArguments = {
  multisigAddress: string;
  sequenceNumber: bigint;
};

export const rejectTransfer = (
  args: RejectTransferArguments,
): InputTransactionData => {
  const { multisigAddress, sequenceNumber } = args;
  return {
    data: {
      function: "0x1::multisig_account::reject_transaction",
      functionArguments: [multisigAddress, sequenceNumber.toString()],
    },
  };
};
