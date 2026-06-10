import { describe, expect, it } from "vitest";
import { approveTransfer } from "./approveTransfer";

const MULTISIG = "0x" + "ab".repeat(32);

describe("approveTransfer", () => {
  it("builds multisig_account::approve_transaction", () => {
    const { data } = approveTransfer({
      multisigAddress: MULTISIG,
      sequenceNumber: 7n,
    });
    expect(data).toEqual({
      function: "0x1::multisig_account::approve_transaction",
      functionArguments: [MULTISIG, "7"],
    });
  });
});
