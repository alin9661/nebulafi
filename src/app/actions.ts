"use server";

import { getLastSuccessVersion } from "@/db/getLastSuccessVersion";
import { getAptosClient } from "@/lib/aptos";
import { GetMessageProps, getMessage } from "@/db/getMessage";
import { GetMessagesProps, getMessages } from "@/db/getMessages";
import {
  GetProposalMetadataProps,
  ProposalMetadata,
  UpsertProposalMetadataProps,
  getProposalMetadataByAddr,
  upsertProposalMetadata,
} from "@/db/proposalMetadata";
import { Message } from "@/lib/type/message";

export const getMessagesOnServer = async ({
  page,
  limit,
  sortedBy,
  order,
}: GetMessagesProps): Promise<{
  messages: Message[];
  total: number;
}> => {
  return getMessages({ page, limit, sortedBy, order });
};

export const getMessageOnServer = async ({
  messageObjAddr,
}: GetMessageProps): Promise<{
  message: Message;
}> => {
  return getMessage({ messageObjAddr });
};

export const getLastVersionOnServer = async (): Promise<number> => {
  return getLastSuccessVersion();
};

export const upsertProposalMetadataOnServer = async (
  props: UpsertProposalMetadataProps,
): Promise<void> => {
  // Cheap server-side chain validation: only accept seq numbers that
  // plausibly refer to a real proposal on this multisig
  // (1 <= seqNo < next_sequence_number). Signature-based authorization
  // (proving the caller is an owner) lands with the M3 threat model.
  const [nextSeq] = await getAptosClient().view<[string]>({
    payload: {
      function: "0x1::multisig_account::next_sequence_number",
      functionArguments: [props.multisigAddr],
    },
  });
  if (
    !Number.isInteger(props.seqNo) ||
    props.seqNo < 1 ||
    props.seqNo >= Number(nextSeq)
  ) {
    throw new Error("seq_no does not correspond to an on-chain proposal");
  }
  return upsertProposalMetadata(props);
};

export const getProposalMetadataOnServer = async (
  props: GetProposalMetadataProps,
): Promise<ProposalMetadata[]> => {
  return getProposalMetadataByAddr(props);
};
