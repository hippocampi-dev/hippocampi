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
    console.log('effect used"');
    if (!session) return;
    const fetchConversations = async () => {
      const res = await fetch(`/api/db/messages/conversations/get`, {
        method: "POST",
        body: JSON.stringify(session.user.id),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setConversations(data);
    };
    fetchConversations();
  }, [session]);
  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">My Conversations</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li
              key={conv.conversationId}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <p className="font-bold">{conv.subject || "No Subject"}</p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(conv.updated_at).toLocaleString()}
                </p>
                {conv.status === "open" && (
                  <span className="text-xs font-semibold text-red-500">
                    Unread messages
                  </span>
                )}
              </div>
              <Link href={`/dashboard/patient/messages/${conv.conversationId}`}>
                <button className="rounded bg-blue-600 px-4 py-2 text-white">
                  View
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button asChild>
        <Link href="/dashboard/patient/messages/create">New Message</Link>
      </Button>
    </div>
  );
}
