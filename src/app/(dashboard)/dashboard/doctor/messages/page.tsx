export const dynamic = "force-dynamic"

import { Suspense } from "react";
import Messages from "~/components/message/Messages";
import { getConversationDict } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default async function Home() {
  return (
    <Suspense fallback={<MessagesLoadingSkeleton />}>
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

function MessagesLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="space-y-4 w-full max-w-3xl px-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}