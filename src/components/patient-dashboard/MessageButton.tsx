"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

type MessageButtonProps = {
  doctorId: string;
  patientId: string;
};

export default function MessageButton({
  doctorId,
  patientId,
}: MessageButtonProps) {
  const router = useRouter();

  const handleMessageClick = async () => {
    router.push(`/dashboard/patient/messages/create?doctor=${doctorId}`);
  };

  return (
    <button
      className="h-9 flex-1 bg-slate-900 px-4 py-2 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
      onClick={handleMessageClick}
    >
      Message
    </button>
  );
}
