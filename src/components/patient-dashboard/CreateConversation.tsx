"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

type CreateConversationProps = {
  doctorId: string;
  patientId: string;
};

export default function CreateConversation({ doctorId, patientId }: CreateConversationProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create or get existing conversation
      const convRes = await fetch("/api/db/messages/conversations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId, subject }),
      });
      if (!convRes.ok) throw new Error("Failed to create conversation");
      const conversation = await convRes.json();
      const conversationId = conversation.conversationId;

      // Create initial message
      const msgRes = await fetch("/api/db/messages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, senderId: patientId, content: messageContent }),
      });
      if (!msgRes.ok) throw new Error("Failed to send message");

      // Redirect to the conversation detail page
      router.push(`/dashboard/messages/${conversationId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Start a Conversation</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="subject" className="block font-semibold mb-1">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter conversation subject"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block font-semibold mb-1">Message</label>
        <textarea
          id="message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
