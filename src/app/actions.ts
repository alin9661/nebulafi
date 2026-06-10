"use server";

import { getLastSuccessVersion } from "@/db/getLastSuccessVersion";
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
  return upsertProposalMetadata(props);
};

export const getProposalMetadataOnServer = async (
  props: GetProposalMetadataProps,
): Promise<ProposalMetadata[]> => {
  return getProposalMetadataByAddr(props);
};
