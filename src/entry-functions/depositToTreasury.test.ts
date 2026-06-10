import { describe, expect, it } from "vitest";
import { depositToTreasury } from "./depositToTreasury";

const MULTISIG = "0x" + "ab".repeat(32);

describe("depositToTreasury", () => {
  it("builds an aptos_account::transfer to the multisig", () => {
    const { data } = depositToTreasury({
      multisigAddress: MULTISIG,
      amountOctas: 150_000_000n,
    });
    expect(data).toEqual({
      function: "0x1::aptos_account::transfer",
      functionArguments: [MULTISIG, "150000000"],
    });
  });
});
