import { describe, expect, it } from "vitest";
import { executeTransfer } from "./executeTransfer";

const MULTISIG = "0x" + "ab".repeat(32);
const RECIPIENT = "0x" + "cd".repeat(32);

describe("executeTransfer", () => {
  it("builds a multisig payload with the inner transfer", () => {
    const { data } = executeTransfer({
      multisigAddress: MULTISIG,
      recipient: RECIPIENT,
      amountOctas: 1_000_000n,
    });
    expect(data).toEqual({
      multisigAddress: MULTISIG,
      function: "0x1::aptos_account::transfer",
      functionArguments: [RECIPIENT, "1000000"],
    });
  });
});
