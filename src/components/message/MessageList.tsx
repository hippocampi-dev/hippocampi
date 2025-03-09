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
        const lastMessageUser = conversation?.lastMessageUser;

        return (
          <Link
            key={conversation?.conversation.conversationId}
            href={`/dashboard/${dashboard}/messages/${conversation?.conversation.conversationId}`}
            className="flex items-center p-4 hover:bg-gray-200"
          >
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage
                src={`${lastMessageUser?.firstName} ${lastMessageUser?.lastName}`} 
                alt={`${lastMessageUser?.firstName} ${lastMessageUser?.lastName}`}
              />
              <AvatarFallback>{lastMessageUser?.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold truncate">{`${lastMessageUser?.firstName} ${lastMessageUser?.lastName}`}</h3>
                <span className="text-xs text-gray-500">{formatMessageTime(conversation?.lastMessage?.time.toString()!)}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {
                  conversation?.lastMessage?.senderId === 
                  (dashboard === 'doctor' 
                    ? conversation?.conversation.doctorId 
                    : conversation?.conversation.patientId)
                  && "You: "
                }
                {conversation?.lastMessage?.content}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  )
}