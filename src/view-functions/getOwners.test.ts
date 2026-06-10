import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMultisigInfo, getOwners } from "./getOwners";

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

const routes: Record<string, unknown[]> = {
  "0x1::multisig_account::owners": [[OWNER_A, OWNER_B, OWNER_C]],
  "0x1::multisig_account::num_signatures_required": ["2"],
  "0x1::multisig_account::last_resolved_sequence_number": ["7"],
};

describe("getMultisigInfo", () => {
  beforeEach(() => {
    viewMock.mockReset();
    viewMock.mockImplementation(async ({ payload }) => {
      const response = routes[payload.function];
      if (!response) throw new Error(`Unrouted view: ${payload.function}`);
      return response;
    });
  });

  it("merges the three views into one object", async () => {
    await expect(getMultisigInfo(MULTISIG_ADDRESS)).resolves.toEqual({
      owners: [OWNER_A, OWNER_B, OWNER_C],
      numSignaturesRequired: 2,
      lastResolvedSequenceNumber: 7n,
    });
  });

  it("returns numSignaturesRequired as a number", async () => {
    const info = await getMultisigInfo(MULTISIG_ADDRESS);

    expect(typeof info.numSignaturesRequired).toBe("number");
    expect(typeof info.lastResolvedSequenceNumber).toBe("bigint");
  });

  it("passes the multisig address to each view", async () => {
    await getMultisigInfo(MULTISIG_ADDRESS);

    expect(viewMock).toHaveBeenCalledTimes(3);
    for (const [args] of viewMock.mock.calls) {
      expect(args.payload.functionArguments).toEqual([MULTISIG_ADDRESS]);
    }
  });
});

describe("getOwners", () => {
  beforeEach(() => {
    viewMock.mockReset();
    viewMock.mockImplementation(async ({ payload }) => {
      const response = routes[payload.function];
      if (!response) throw new Error(`Unrouted view: ${payload.function}`);
      return response;
    });
  });

  it("returns just the owners list", async () => {
    await expect(getOwners(MULTISIG_ADDRESS)).resolves.toEqual([
      OWNER_A,
      OWNER_B,
      OWNER_C,
    ]);
  });
});
