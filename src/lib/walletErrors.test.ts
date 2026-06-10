import { describe, expect, it } from "vitest";
import { mapTreasuryWriteError, TreasuryWriteError } from "./walletErrors";

const ABORT = "Move abort in 0x1::multisig_account";

describe("mapTreasuryWriteError", () => {
  const cases: Array<{
    name: string;
    input: unknown;
    expected: TreasuryWriteError;
  }> = [
    {
      name: "user rejection as Error",
      input: new Error("User has rejected the request"),
      expected: { kind: "user-rejected" },
    },
    {
      name: "user rejection as plain string",
      input: "User has rejected the request",
      expected: { kind: "user-rejected" },
    },
    {
      name: "not-an-owner via hex abort code",
      input: new Error(`${ABORT}: 0x507d3`),
      expected: { kind: "not-an-owner" },
    },
    {
      name: "not-an-owner via decimal abort code",
      input: new Error(`${ABORT}: sub_status 2003`),
      expected: { kind: "not-an-owner" },
    },
    {
      name: "threshold-not-met via hex abort code",
      input: new Error(`${ABORT}: 0x107d9`),
      expected: { kind: "threshold-not-met" },
    },
    {
      name: "threshold-not-met via decimal abort code",
      input: new Error(`${ABORT}: sub_status 2009`),
      expected: { kind: "threshold-not-met" },
    },
    {
      name: "payload-mismatch via hex abort code",
      input: new Error(`${ABORT}: 0x107da`),
      expected: { kind: "payload-mismatch" },
    },
    {
      name: "payload-mismatch via decimal abort code",
      input: new Error(`${ABORT}: sub_status 2010`),
      expected: { kind: "payload-mismatch" },
    },
    {
      name: "threshold-not-met via prologue validation string (no multisig_account)",
      input: new Error(
        "Invalid transaction: Type: Validation Code: MULTISIG_TRANSACTION_INSUFFICIENT_APPROVALS",
      ),
      expected: { kind: "threshold-not-met" },
    },
    {
      name: "payload-mismatch via prologue validation string (no multisig_account)",
      input: new Error(
        "Invalid transaction: Type: Validation Code: MULTISIG_TRANSACTION_PAYLOAD_DOES_NOT_MATCH",
      ),
      expected: { kind: "payload-mismatch" },
    },
    {
      name: "stale sequence number from vm_status",
      input: new Error("Transaction failed: SEQUENCE_NUMBER_TOO_OLD"),
      expected: { kind: "stale-sequence-number" },
    },
    {
      name: "insufficient gas",
      input: new Error("INSUFFICIENT_BALANCE for transaction fee"),
      expected: { kind: "insufficient-gas" },
    },
    {
      name: "random string falls through to unknown",
      input: "something completely unexpected happened",
      expected: {
        kind: "unknown",
        raw: "something completely unexpected happened",
      },
    },
    {
      name: "non-Error object becomes unknown with JSON raw",
      input: { code: 4100, info: "weird wallet object" },
      expected: {
        kind: "unknown",
        raw: JSON.stringify({ code: 4100, info: "weird wallet object" }),
      },
    },
  ];

  it.each(cases)("$name", ({ input, expected }) => {
    expect(mapTreasuryWriteError(input)).toEqual(expected);
  });
});
