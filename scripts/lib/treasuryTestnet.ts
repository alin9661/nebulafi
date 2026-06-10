/**
 * Shared helpers for the testnet treasury scripts (E2E loop + bootstrap).
 * Standalone on purpose: scripts sign with local keys via the SDK, never the
 * wallet adapter, and read env directly (bun loads .env natively).
 */
import {
  Account,
  AccountAddress,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  type CommittedTransactionResponse,
  type InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";

export const OCTAS_PER_APT = 100_000_000n;

export const getTestnetClient = (): Aptos => {
  const network = process.env.NEXT_PUBLIC_APP_NETWORK ?? "testnet";
  if (network !== "testnet") {
    throw new Error(
      `These scripts are testnet-only; NEXT_PUBLIC_APP_NETWORK is "${network}"`,
    );
  }
  // No API key: the key in .env is browser-origin-scoped (sends 401 without
  // an Origin header). Anonymous rate limits cover these few calls fine.
  // http2: false — Bun doesn't fully support HTTP/2 (SDK warning).
  return new Aptos(
    new AptosConfig({
      network: Network.TESTNET,
      clientConfig: { http2: false },
    }),
  );
};

export const getPublisherAccount = (): Account => {
  const key = process.env.NEXT_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY;
  if (!key) {
    throw new Error("NEXT_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY not set in .env");
  }
  return Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(key) });
};

export const explorerTxnUrl = (hash: string) =>
  `https://explorer.aptoslabs.com/txn/${hash}?network=testnet`;

export const submitAndWait = async (
  aptos: Aptos,
  signer: Account,
  data: InputGenerateTransactionPayloadData,
  label: string,
): Promise<CommittedTransactionResponse> => {
  // Cap max gas: mempool requires balance ≥ maxGasAmount × gasUnitPrice, and
  // the SDK default (200k units = 0.2 APT at min price) exceeds the small
  // throwaway-account funding these scripts use. All ops here are ≪ 50k units.
  const transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data,
    options: { maxGasAmount: 50_000 },
  });
  const pending = await aptos.signAndSubmitTransaction({ signer, transaction });
  const committed = await aptos.waitForTransaction({
    transactionHash: pending.hash,
  });
  if (!committed.success) {
    throw new Error(
      `${label} failed on-chain (${committed.vm_status}): ${explorerTxnUrl(pending.hash)}`,
    );
  }
  console.log(`  ✓ ${label}: ${explorerTxnUrl(pending.hash)}`);
  return committed;
};

export const getAptBalance = async (
  aptos: Aptos,
  address: string,
): Promise<bigint> => {
  const [raw] = await aptos.view<[string]>({
    payload: {
      function: "0x1::coin::balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [address],
    },
  });
  return BigInt(raw);
};

/** Predict the multisig address, then create it in the next transaction.
 * The prediction is derived from the creator's current sequence number, so
 * nothing else may be submitted by the creator in between. */
export const createMultisig = async (
  aptos: Aptos,
  creator: Account,
  additionalOwners: string[],
  numSignaturesRequired: number,
): Promise<string> => {
  const [predicted] = await aptos.view<[string]>({
    payload: {
      function: "0x1::multisig_account::get_next_multisig_account_address",
      functionArguments: [creator.accountAddress.toString()],
    },
  });
  await submitAndWait(
    aptos,
    creator,
    {
      function: "0x1::multisig_account::create_with_owners",
      functionArguments: [additionalOwners, numSignaturesRequired, [], []],
    },
    `create ${numSignaturesRequired}-of-${additionalOwners.length + 1} multisig ${predicted}`,
  );
  return AccountAddress.from(predicted).toString();
};

export const formatApt = (octas: bigint): string =>
  `${Number(octas) / Number(OCTAS_PER_APT)} APT`;
