'use server'

import { createConversation, createMessage } from "~/server/db/queries";
import { ConversationsInterface, MessagesInterface } from "~/server/db/type";

export async function sendMessage(message: MessagesInterface) {
  return await createMessage(message);
}

export async function createConversationServerAction(conversation: ConversationsInterface) {
  return await createConversation(conversation);
}