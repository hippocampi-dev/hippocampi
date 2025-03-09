"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { MessageBubble } from "../ui/message-bubble"
import { ConversationsInterface, MessagesInterface, UserInterface } from "~/server/db/type"
import { sendMessage } from "~/app/_actions/message/actions"

interface props {
  conversation: ConversationsInterface
  sender: UserInterface
  receiver: UserInterface
  currentMessages: MessagesInterface[]
}

export default function Conversation({ conversation ,sender, receiver, currentMessages }: props) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<MessagesInterface[]>(currentMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: MessagesInterface = {
      conversationId: conversation.conversationId as "string",
      senderId: sender.id as "string",
      content: message,
      time: new Date()
    }

    const result = await sendMessage(newMessage)
    
    setMessages([
      ...messages,
      result[0]!
    ]);

    setMessage("");
  }

  if (!conversation) return <div>Loading...</div>

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage
              src={receiver.name!} 
              alt={receiver.name!}
            />
            <AvatarFallback>{receiver.name!.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-semibold">{receiver.name!}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg: MessagesInterface) => (
          <MessageBubble
            key={msg.messageId}
            message={msg}
            isMe={msg.senderId === sender.id}
            showAvatar={msg.senderId === receiver.id} // show avatar if messages is from receiver
            avatar={receiver.image!}
            name={receiver.name!}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="iMessage"
            className="flex-1 rounded-full bg-white border-gray-300"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}