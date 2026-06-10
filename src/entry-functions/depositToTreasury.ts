import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type DepositToTreasuryArguments = {
  multisigAddress: string;
  amountOctas: bigint;
};

export const depositToTreasury = (
  args: DepositToTreasuryArguments,
): InputTransactionData => {
  const { multisigAddress, amountOctas } = args;
  return {
    data: {
      function: "0x1::aptos_account::transfer",
      functionArguments: [multisigAddress, amountOctas.toString()],
    },
  };
};
