import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { formatMessageTime } from "~/lib/utils"
import { MessagesInterface } from "~/server/db/type"

interface MessageBubbleProps {
  message: MessagesInterface
  isMe: boolean
  showAvatar?: boolean
  avatar?: string
  name?: string
}

export function MessageBubble({ message, isMe, showAvatar = false, avatar, name }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      {showAvatar && !isMe && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[70%] ${!showAvatar && !isMe ? "ml-10" : ""}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isMe ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-200 text-black rounded-bl-md"
          }`}
        >
          {message.content}
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isMe ? "text-right" : "text-left"}`}>
          {formatMessageTime(message.time.toString())}
        </div>
      </div>
    </div>
  )
}