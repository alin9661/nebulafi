import {
  AccountAddress,
  Deserializer,
  EntryFunction,
  EntryFunctionBytes,
  Hex,
  MultiSigTransactionPayload,
  U64,
} from "@aptos-labs/ts-sdk";

export const APT_TRANSFER_FUNCTION = "0x1::aptos_account::transfer";

export type AptTransferArgs = {
  recipient: string;
  amountOctas: bigint;
};

/**
 * BCS bytes of MultiSigTransactionPayload wrapping aptos_account::transfer.
 * This is the `payload: vector<u8>` argument that
 * 0x1::multisig_account::create_transaction stores on-chain; the chain
 * compares it byte-for-byte against the payload submitted at execute time
 * (EPAYLOAD_DOES_NOT_MATCH), so encode and execute must agree exactly.
 */
export const encodeAptTransferPayload = ({
  recipient,
  amountOctas,
}: AptTransferArgs): Uint8Array => {
  const entryFunction = EntryFunction.build(
    "0x1::aptos_account",
    "transfer",
    [],
    [AccountAddress.from(recipient), new U64(amountOctas)],
  );
  return new MultiSigTransactionPayload(entryFunction).bcsToBytes();
};

export type DecodedMultisigPayload = {
  functionId: string;
  /** null when the stored call is not a recognized APT transfer */
  recipient: string | null;
  amountOctas: bigint | null;
};

/**
 * Decode a stored multisig payload (hex from get_pending_transactions) back
 * into human-readable facts. Returns null when the bytes don't parse;
 * returns functionId with null transfer fields for unrecognized functions —
 * the UI must render those as "unrecognized payload", never guess.
 */
export const decodeMultisigPayload = (
  payloadHex: string,
): DecodedMultisigPayload | null => {
  try {
    const bytes = Hex.fromHexString(payloadHex).toUint8Array();
    const inner = MultiSigTransactionPayload.deserialize(new Deserializer(bytes));
    const entryFunction = inner.transaction_payload;
    if (!(entryFunction instanceof EntryFunction)) {
      return null; // script payloads are out of scope for M1
    }
    const functionId = [
      entryFunction.module_name.address.toString(),
      entryFunction.module_name.name.identifier,
      entryFunction.function_name.identifier,
    ].join("::");

    if (functionId === APT_TRANSFER_FUNCTION && entryFunction.args.length === 2) {
      const [recipientArg, amountArg] = entryFunction.args as EntryFunctionBytes[];
      return {
        functionId,
        recipient: AccountAddress.from(recipientArg.value.value).toString(),
        amountOctas: new Deserializer(amountArg.value.value).deserializeU64(),
      };
    }
    return { functionId, recipient: null, amountOctas: null };
  } catch {
    return null;
  }
};
