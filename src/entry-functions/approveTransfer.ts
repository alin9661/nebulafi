import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type ApproveTransferArguments = {
  multisigAddress: string;
  sequenceNumber: bigint;
};

export const approveTransfer = (
  args: ApproveTransferArguments,
): InputTransactionData => {
  const { multisigAddress, sequenceNumber } = args;
  return {
    data: {
      function: "0x1::multisig_account::approve_transaction",
      functionArguments: [multisigAddress, sequenceNumber.toString()],
    },
  };
};
