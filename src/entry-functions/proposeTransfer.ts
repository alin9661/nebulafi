import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { encodeAptTransferPayload } from "@/lib/multisigPayload";

export type ProposeTransferArguments = {
  multisigAddress: string;
  recipient: string;
  amountOctas: bigint;
};

export const proposeTransfer = (
  args: ProposeTransferArguments,
): InputTransactionData => {
  const { multisigAddress, recipient, amountOctas } = args;
  return {
    data: {
      function: "0x1::multisig_account::create_transaction",
      functionArguments: [
        multisigAddress,
        encodeAptTransferPayload({ recipient, amountOctas }),
      ],
    },
  };
};
