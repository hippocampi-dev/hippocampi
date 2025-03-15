'server-only'

import { createConversation, createMessage, setMessagesRead } from "~/server/db/queries";
import { ConversationsInterface, MessagesInterface } from "~/server/db/type";

export async function sendMessage(message: MessagesInterface) {
  return await createMessage(message);
}

export async function createConversationServerAction(conversation: ConversationsInterface) {
  return await createConversation(conversation);
}

export async function setMessagesReadServerAction(conversationId: string, otherUserId: string) {
  return await setMessagesRead(conversationId, otherUserId);
}

