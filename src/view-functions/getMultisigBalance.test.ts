import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMultisigBalance } from "./getMultisigBalance";

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

describe("getMultisigBalance", () => {
  beforeEach(() => {
    viewMock.mockReset();
  });

  it("returns the balance as bigint", async () => {
    viewMock.mockResolvedValue(["123456789"]);

    await expect(getMultisigBalance(MULTISIG_ADDRESS)).resolves.toBe(
      123456789n,
    );
    expect(viewMock).toHaveBeenCalledWith({
      payload: {
        function: "0x1::coin::balance",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [MULTISIG_ADDRESS],
      },
    });
  });

  it("returns 0n for a zero balance", async () => {
    viewMock.mockResolvedValue(["0"]);

    await expect(getMultisigBalance(MULTISIG_ADDRESS)).resolves.toBe(0n);
  });
});
