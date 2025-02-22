"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

type Message = {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  created_at: string;
};

export default function ConversationDetailPage() {
  const { conversationId } = useParams();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversationName, setConversationName] = useState("Loading");

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/db/messages/get?conversationId=${conversationId}`,
      );
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    };
    const fetchConversationName = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/db/messages/conversations/getName?conversationId=${conversationId}`,
      );
      const data = await res.json();
      setConversationName(data.subject);
      setLoading(false);
    };
    fetchMessages();
    fetchConversationName();
  }, [conversationId]);

  const handleSend = async () => {
    if (!session) return;
    const senderId = session.user.id; // current user id
    const res = await fetch("/api/db/messages/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, senderId, content: newMessage }),
    });
    if (res.ok) {
      const message = await res.json();
      // Optionally, re-fetch or append the new message to state
      setMessages((prev) => [...prev, ...message]);
      setNewMessage("");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="mx-auto max-w-3xl rounded bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-bold">{conversationName}</h1>
      <div className="mb-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.messageId} className="rounded border p-4">
            <p className="text-gray-700">{msg.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded border p-2"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
