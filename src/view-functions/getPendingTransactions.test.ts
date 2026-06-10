import {
  AccountAddress,
  EntryFunction,
  MultiSigTransactionPayload,
  parseTypeTag,
  U64,
} from "@aptos-labs/ts-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeAptTransferPayload } from "@/lib/multisigPayload";
import { getPendingTransactions } from "./getPendingTransactions";

type ViewArgs = {
  payload: {
    function: string;
    typeArguments?: string[];
    functionArguments?: unknown[];
  };
};

const viewMock = vi.hoisted(() =>
  vi.fn<(args: ViewArgs) => Promise<unknown[]>>(),
);

vi.mock("@/lib/aptos", () => ({
  getAptosClient: () => ({ view: viewMock }),
}));

const MULTISIG_ADDRESS = "0x" + "ab".repeat(32);
const OWNER_A = "0x" + "11".repeat(32);
const OWNER_B = "0x" + "22".repeat(32);
const OWNER_C = "0x" + "33".repeat(32);
const RECIPIENT = "0x" + "cd".repeat(32);

const toHex = (bytes: Uint8Array): string =>
  "0x" + Buffer.from(bytes).toString("hex");

const TRANSFER_PAYLOAD_HEX = toHex(
  encodeAptTransferPayload({ recipient: RECIPIENT, amountOctas: 250000000n }),
);

const OTHER_FUNCTION_PAYLOAD_HEX = toHex(
  new MultiSigTransactionPayload(
    EntryFunction.build(
      "0x1::coin",
      "transfer",
      [parseTypeTag("0x1::aptos_coin::AptosCoin")],
      [AccountAddress.from(RECIPIENT), new U64(1n)],
    ),
  ).bcsToBytes(),
);

type RawTransaction = {
  payload: { vec: [] | [string] };
  payload_hash: { vec: [] | [string] };
  votes: { data: { key: string; value: boolean }[] };
  creator: string;
  creation_time_secs: string;
};

const makeRawTransaction = (
  overrides: Partial<RawTransaction> = {},
): RawTransaction => ({
  payload: { vec: [TRANSFER_PAYLOAD_HEX] },
  payload_hash: { vec: [] },
  votes: { data: [] },
  creator: OWNER_A,
  creation_time_secs: "1749500000",
  ...overrides,
});

const routeViews = (config: {
  pending: RawTransaction[];
  lastResolved: string;
  canBeExecuted?: (sequenceNumber: string) => boolean;
}) => {
  viewMock.mockImplementation(async ({ payload }) => {
    switch (payload.function) {
      case "0x1::multisig_account::get_pending_transactions":
        return [config.pending];
      case "0x1::multisig_account::last_resolved_sequence_number":
        return [config.lastResolved];
      case "0x1::multisig_account::can_be_executed":
        return [
          config.canBeExecuted?.(String(payload.functionArguments?.[1])) ??
            false,
        ];
      default:
        throw new Error(`Unrouted view: ${payload.function}`);
    }
  });
};

const canBeExecutedCalls = () =>
  viewMock.mock.calls
    .map(([args]) => args.payload)
    .filter(
      (payload) => payload.function === "0x1::multisig_account::can_be_executed",
    );

describe("getPendingTransactions", () => {
  beforeEach(() => {
    viewMock.mockReset();
  });

  it("returns [] when there are no pending transactions", async () => {
    routeViews({ pending: [], lastResolved: "0" });

    await expect(getPendingTransactions(MULTISIG_ADDRESS)).resolves.toEqual(
      [],
    );
    expect(canBeExecutedCalls()).toHaveLength(0);
  });

  it("decodes a single pending APT transfer", async () => {
    routeViews({
      pending: [
        makeRawTransaction({
          votes: {
            data: [
              { key: OWNER_A, value: true },
              { key: OWNER_B, value: true },
              { key: OWNER_C, value: false },
            ],
          },
        }),
      ],
      lastResolved: "0",
      canBeExecuted: () => true,
    });

    const [transaction] = await getPendingTransactions(MULTISIG_ADDRESS);

    expect(transaction.sequenceNumber).toBe(1n);
    expect(transaction.creator).toBe(OWNER_A);
    expect(transaction.creationTimeSecs).toBe(1749500000);
    expect(transaction.approvals).toEqual([OWNER_A, OWNER_B]);
    expect(transaction.rejections).toEqual([OWNER_C]);
    expect(transaction.payloadHex).toBe(TRANSFER_PAYLOAD_HEX);
    expect(transaction.decoded?.recipient).toBe(RECIPIENT);
    expect(transaction.decoded?.amountOctas).toBe(250000000n);
    expect(transaction.canBeExecuted).toBe(true);
    expect(canBeExecutedCalls()).toEqual([
      expect.objectContaining({
        functionArguments: [MULTISIG_ADDRESS, "1"],
      }),
    ]);
  });

  it("back-computes sequence numbers from last_resolved_sequence_number", async () => {
    routeViews({
      pending: [
        makeRawTransaction(),
        makeRawTransaction(),
        makeRawTransaction(),
      ],
      lastResolved: "5",
      canBeExecuted: (sequenceNumber) => sequenceNumber === "6",
    });

    const transactions = await getPendingTransactions(MULTISIG_ADDRESS);

    expect(transactions.map((t) => t.sequenceNumber)).toEqual([6n, 7n, 8n]);
    expect(transactions.map((t) => t.canBeExecuted)).toEqual([
      true,
      false,
      false,
    ]);
    expect(canBeExecutedCalls()).toEqual([
      expect.objectContaining({
        functionArguments: [MULTISIG_ADDRESS, "6"],
      }),
      expect.objectContaining({
        functionArguments: [MULTISIG_ADDRESS, "7"],
      }),
      expect.objectContaining({
        functionArguments: [MULTISIG_ADDRESS, "8"],
      }),
    ]);
  });

  it("returns null payloadHex and decoded for hash-only proposals", async () => {
    routeViews({
      pending: [
        makeRawTransaction({
          payload: { vec: [] },
          payload_hash: { vec: ["0x" + "ee".repeat(32)] },
        }),
      ],
      lastResolved: "0",
    });

    const [transaction] = await getPendingTransactions(MULTISIG_ADDRESS);

    expect(transaction.payloadHex).toBeNull();
    expect(transaction.decoded).toBeNull();
  });

  it("decodes functionId but not transfer fields for other functions", async () => {
    routeViews({
      pending: [
        makeRawTransaction({ payload: { vec: [OTHER_FUNCTION_PAYLOAD_HEX] } }),
      ],
      lastResolved: "0",
    });

    const [transaction] = await getPendingTransactions(MULTISIG_ADDRESS);

    expect(transaction.decoded).toEqual({
      functionId: "0x1::coin::transfer",
      recipient: null,
      amountOctas: null,
    });
  });
});
