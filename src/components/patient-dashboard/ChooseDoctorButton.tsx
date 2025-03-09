'use client'

import { redirect, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Router } from "lucide-react";
import { ConversationsInterface } from "~/server/db/type";
import { createConversationServerAction } from "~/app/_actions/message/actions";

interface ChooseDoctorButtonProps {
    iDoctorId: string;
    patientId: string;
  }
  
  export default function ChooseDoctorButton({ iDoctorId, patientId }: ChooseDoctorButtonProps) {
    const router = useRouter();
    interface PatientDoctorManagement {
        patientId: string;
        doctorId: string;
        // Add any other required fields here.
      }
    
      interface HandleSubmitProps {
        doctorId: string;
        patientId: string;
      }
    
    
    
      const handleSubmit = async ({ doctorId, patientId }: HandleSubmitProps): Promise<void> => {
        
        try {
          // Create the patient-doctor management object.
          const patientDoctorManagement: PatientDoctorManagement = {
            patientId: patientId,
            doctorId: doctorId,
            // Add any other required fields here.
          };

          const conversation: ConversationsInterface = {
            patientId: patientId,
            doctorId: doctorId,
          }

          const res: Response = await fetch("/api/db/management/patient-doctor-management/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientDoctorManagement),
          });
          
          if (res.ok) {
            const result = await createConversationServerAction(conversation);
            router.push("/dashboard");
          } else {
            throw new Error("Failed to assign doctor");
          }
    
          // Redirect to the dashboard after success.
        } catch (err: any) {
        }
      }

    return (
        <div className="mt-6">
            <Button onClick={() => handleSubmit({ doctorId: iDoctorId, patientId })} className="w-full">Select Doctor</Button>
        </div>
    )
}