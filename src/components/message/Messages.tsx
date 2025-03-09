import { ConversationDict } from "~/server/db/type";
import { MessagesList } from "./MessageList";

interface props {
  conversationDict: ConversationDict
  dashboard: 'patient' | 'doctor'
}

export default function Messages({ conversationDict, dashboard }: props) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <div className="text-2xl font-semibold">Messages</div>
          {/* <Link href="/dashboard/patient/messages/new-message" className="text-blue-500 font-medium">
            New
          </Link> */}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <MessagesList conversationDict={conversationDict} dashboard={dashboard} />
      </div>
    </div>
  )
}