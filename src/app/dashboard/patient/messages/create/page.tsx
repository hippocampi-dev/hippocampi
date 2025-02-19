"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CreateConversation from "~/components/patient-dashboard/CreateConversation";

export default function CreateConversationPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || "";
  const { data: session } = useSession();
  const patientId = session?.user.id || "";
  
  return (
    <div className="p-8">
      <CreateConversation patientId={patientId} doctorId={doctorId} />
    </div>
  );
}
