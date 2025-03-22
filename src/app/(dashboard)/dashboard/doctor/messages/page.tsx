export const dynamic = "force-dynamic"

import { Suspense } from "react";
import Loading from "~/components/loading/page";
import Messages from "~/components/message/Messages";
import { getConversationDict } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default async function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <MessagesContainer />
    </Suspense>
  );
}

async function MessagesContainer() {
  // Fetch the user ID
  const userId = await getUserId();
  
  // Fetch the conversation data using the user ID
  const conversationDict = await getConversationDict(userId as "string");

  return (
    <Messages 
      conversationDict={conversationDict} 
      dashboard={'doctor'} 
    />
  );
}