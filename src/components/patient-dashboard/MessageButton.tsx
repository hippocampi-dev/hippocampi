"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

type MessageButtonProps = {
  doctorId: string;
  patientId: string;
};

export default function MessageButton({ doctorId, patientId }: MessageButtonProps) {
  const router = useRouter();

  const handleMessageClick = async () => {
    // Create (or fetch) conversation and then redirect
    const res = await fetch("/api/db/messages/conversations/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, doctorId, subject: "New Conversation" }),
    });
    if (res.ok) {
      const conversation = await res.json();
      router.push(`/dashboard/patient/messages/${conversation.conversationId}`);
    }
  };

  return (
    
    <button className = "h-9 px-4 py-2 flex-1 bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90" onClick={handleMessageClick}
    >
      Message
    </button>
  );
}
