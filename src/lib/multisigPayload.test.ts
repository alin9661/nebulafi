import {
  AccountAddress,
  EntryFunction,
  Hex,
  MultiSigTransactionPayload,
  parseTypeTag,
  U64,
} from "@aptos-labs/ts-sdk";
import { describe, expect, it } from "vitest";
import {
  APT_TRANSFER_FUNCTION,
  decodeMultisigPayload,
  encodeAptTransferPayload,
} from "./multisigPayload";

const RECIPIENT = "0x" + "cd".repeat(32);

describe("encodeAptTransferPayload / decodeMultisigPayload", () => {
  it("round-trips and normalizes mixed-case recipients to lowercase long form", () => {
    const mixedCase = "0x" + "Cd".repeat(16) + "CD".repeat(16);
    const bytes = encodeAptTransferPayload({
      recipient: mixedCase,
      amountOctas: 123_456n,
    });
    const decoded = decodeMultisigPayload(Hex.fromHexInput(bytes).toString());
    expect(decoded).toEqual({
      functionId: APT_TRANSFER_FUNCTION,
      recipient: RECIPIENT,
      amountOctas: 123_456n,
    });
  });

  it("returns null on garbage hex", () => {
    expect(decodeMultisigPayload("0xdeadbeef")).toBeNull();
  });

  it("returns null on empty string", () => {
    expect(decodeMultisigPayload("")).toBeNull();
  });

  it("returns functionId with null transfer fields for non-transfer payloads", () => {
    const entryFunction = EntryFunction.build(
      "0x1::coin",
      "transfer",
      [parseTypeTag("0x1::aptos_coin::AptosCoin")],
      [AccountAddress.from(RECIPIENT), new U64(5n)],
    );
    const bytes = new MultiSigTransactionPayload(entryFunction).bcsToBytes();
    expect(decodeMultisigPayload(Hex.fromHexInput(bytes).toString())).toEqual({
      functionId: "0x1::coin::transfer",
      recipient: null,
      amountOctas: null,
    });
  });
});
