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

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/db/messages/get?conversationId=${conversationId}`);
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    };
    fetchMessages();
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
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Conversation</h1>
      <div className="space-y-4 mb-6">
        {messages.map((msg) => (
          <div key={msg.messageId} className="p-4 border rounded">
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
          className="flex-1 border p-2 rounded"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
