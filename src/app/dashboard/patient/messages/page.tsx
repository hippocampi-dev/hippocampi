"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

type Conversation = {
  conversationId: string;
  patientId: string;
  doctorId: string;
  subject?: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function ConversationsPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchConversations = async () => {
      const res = await fetch(`/api/db/messages/conversations/get?patientId=${session.user.id}`);
      const data = await res.json();
      setConversations(data);
      setLoading(false);
    };
    fetchConversations();
  }, [session]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Conversations</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li key={conv.conversationId} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{conv.subject || "No Subject"}</p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(conv.updated_at).toLocaleString()}
                </p>
                {conv.status === "open" && (
                  <span className="text-red-500 text-xs font-semibold">Unread messages</span>
                )}
              </div>
              <Link href={`/dashboard/patient/messages/${conv.conversationId}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  View
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
        <Button asChild>
    <Link href="/dashboard/patient/messages/create">
        New Message
    </Link>
    </Button>

    </div>
  );
}
