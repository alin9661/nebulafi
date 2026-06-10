import { getAptosClient } from "@/lib/aptos";

export const getMultisigBalance = async (
  multisigAddress: string,
): Promise<bigint> => {
  const [balance] = await getAptosClient().view<[string]>({
    payload: {
      function: "0x1::coin::balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [multisigAddress],
    },
  });
  return BigInt(balance);
};
