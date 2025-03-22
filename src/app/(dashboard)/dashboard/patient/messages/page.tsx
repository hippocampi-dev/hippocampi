export const dynamic = "force-dynamic"

import { Suspense } from "react";
import Loading from "~/components/loading/page";
import Messages from "~/components/message/Messages";
import { getConversationDict } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default function PatientMessages() {
  return (
    <Suspense fallback={<Loading />}>
      <PatientMessagesContainer />
    </Suspense>
  );
}

async function PatientMessagesContainer() {
  // Fetch the user ID
  const userId = await getUserId();
  
  // Fetch the conversation data using the user ID
  const conversationDict = await getConversationDict(userId as "string");

  return (
    <Messages 
      conversationDict={conversationDict} 
      dashboard={'patient'} 
    />
  );
}