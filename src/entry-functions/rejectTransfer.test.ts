import { describe, expect, it } from "vitest";
import { rejectTransfer } from "./rejectTransfer";

const MULTISIG = "0x" + "ab".repeat(32);

describe("rejectTransfer", () => {
  it("builds multisig_account::reject_transaction", () => {
    const { data } = rejectTransfer({
      multisigAddress: MULTISIG,
      sequenceNumber: 9n,
    });
    expect(data).toEqual({
      function: "0x1::multisig_account::reject_transaction",
      functionArguments: [MULTISIG, "9"],
    });
  });
});
