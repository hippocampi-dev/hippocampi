import Conversation from "~/components/message/Conversation";
import { createMessage, getMessages, getTargetConversation, getUser } from "~/server/db/queries";

interface props {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: props) {
  const { id } = await params;
  const conversation = await getTargetConversation(id);
  const sender = await getUser(conversation?.patientId as "string");
  const receiver = await getUser(conversation?.doctorId as "string");
  const messages = await getMessages(id);
  
  return (
    <Conversation
      conversation={conversation!}
      sender={sender!}
      receiver={receiver!}
      currentMessages={messages}
    />
  )
}