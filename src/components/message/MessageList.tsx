import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { formatMessageTime } from "~/lib/utils"
import { ConversationDict } from "~/server/db/type"

interface props {
  conversationDict: ConversationDict
  dashboard: 'patient' | 'doctor'
}

export function MessagesList({ conversationDict, dashboard }: props) {
  return (
    <div className="divide-y divide-gray-200">
      {Object.keys(conversationDict).map(key => {
        const conversation = conversationDict[key];
        const otherUser = conversation?.otherUser;
        const isYou = conversation?.lastMessage?.senderId === 
        (dashboard === 'doctor' 
          ? conversation?.conversation.doctorId 
          : conversation?.conversation.patientId);
        const hasUnread = !conversation?.lastMessage?.read && !isYou;
        const startedConversation = conversation?.lastMessage

        return (
          <Link
            key={conversation?.conversation.conversationId}
            href={`/dashboard/${dashboard}/messages/${conversation?.conversation.conversationId}`}
            className="flex items-center p-4 hover:bg-gray-200"
          >
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage
                src={`${otherUser?.firstName} ${otherUser?.lastName}`} 
                alt={`${otherUser?.firstName} ${otherUser?.lastName}`}
              />
              <AvatarFallback>{otherUser?.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                {/* If last message is from other person and not read --> bold */}
                <h3 className={`text-base ${hasUnread ? "font-bold" : "font-semibold"} truncate`}>
                  {`${otherUser?.firstName} ${otherUser?.lastName}`}
                </h3>
                <span className={`text-xs ${hasUnread ? "text-black font-semibold" : "text-gray-500"}`}>
                  {startedConversation ? formatMessageTime(conversation?.lastMessage?.time.toString()!) : ""}
                </span>
              </div>
              <p className={`text-sm truncate ${hasUnread ? "text-black font-semibold" : "text-gray-500"}`}>
                {isYou && "You: "}
                {startedConversation ? conversation?.lastMessage?.content : "Start a conversation"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  )
}