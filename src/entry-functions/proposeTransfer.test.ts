import { Hex } from "@aptos-labs/ts-sdk";
import { describe, expect, it } from "vitest";
import { decodeMultisigPayload } from "@/lib/multisigPayload";
import { proposeTransfer } from "./proposeTransfer";

const MULTISIG = "0x" + "ab".repeat(32);
const RECIPIENT = "0x" + "cd".repeat(32);

describe("proposeTransfer", () => {
  it("builds multisig_account::create_transaction with BCS payload bytes", () => {
    const { data } = proposeTransfer({
      multisigAddress: MULTISIG,
      recipient: RECIPIENT,
      amountOctas: 42n,
    });
    if (!("function" in data) || !data.functionArguments) {
      throw new Error("expected entry function data");
    }
    expect(data.function).toBe("0x1::multisig_account::create_transaction");
    expect(data.functionArguments).toHaveLength(2);
    expect(data.functionArguments[0]).toBe(MULTISIG);
    expect(data.functionArguments[1]).toBeInstanceOf(Uint8Array);
  });

  it("emits bytes that round-trip through decodeMultisigPayload", () => {
    const { data } = proposeTransfer({
      multisigAddress: MULTISIG,
      recipient: RECIPIENT,
      amountOctas: 987_654_321n,
    });
    if (!("function" in data) || !data.functionArguments) {
      throw new Error("expected entry function data");
    }
    const bytes = data.functionArguments[1] as Uint8Array;
    expect(bytes[0]).toBe(0); // MultiSigTransactionPayload EntryFunction variant

    const decoded = decodeMultisigPayload(Hex.fromHexInput(bytes).toString());
    expect(decoded).toEqual({
      functionId: "0x1::aptos_account::transfer",
      recipient: RECIPIENT,
      amountOctas: 987_654_321n,
    });
  });
});
