"use client";

import { useState } from "react";
import { z } from "zod";
import { role } from "~/server/db/type";
import useSetUserRole from "~/app/hooks/useSetUserRole";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Brain, UserRound } from "lucide-react";
import Image from "next/image";

const RoleSchema = z.nativeEnum(role);

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<role>();
  // Call the hook at the top level of the component.
  const setUserRole = useSetUserRole();

  const handleConfirm = () => {
    const parsed = RoleSchema.safeParse(selectedRole);
    if (!parsed.success) {
      alert("Invalid role selected");
      return;
    }
    if (selectedRole) {
      setUserRole(selectedRole).then(() => setTimeout(() => redirect("/middle"), 100));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/highresneuronbackground.jpeg"
          alt="Neural background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40"></div>
      </div>
      
      <div className="z-10 w-full max-w-2xl animate-fade-in-up rounded-3xl bg-white p-12 shadow-lg">
        <h1 className="mb-8 text-center text-4xl font-light tracking-tighter text-gray-900">
          Join our integrative care network
        </h1>
        <p className="mb-10 text-center text-darkAccent text-lg">
          Select your role to get personalized access to our platform
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 animate-fade-in-stagger">
          <div 
            onClick={() => setSelectedRole(role.doctor)}
            className={`flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-3xl transition-all cursor-pointer ${
              selectedRole === "doctor"
                ? "bg-primary text-white shadow-md"
                : "bg-lightAccent hover:bg-primary/10"
            }`}
          >
            <div className={`p-4 rounded-full ${selectedRole === "doctor" ? "bg-white/20" : "bg-sky-100"}`}>
              <UserRound className={`h-12 w-12 ${selectedRole === "doctor" ? "text-white" : "text-primary"}`} />
            </div>
            <h2 className="text-2xl font-light">Provider</h2>
          </div>
          
          <div 
            onClick={() => setSelectedRole(role.patient)}
            className={`flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-3xl transition-all cursor-pointer ${
              selectedRole === "patient"
                ? "bg-primary text-white shadow-md"
                : "bg-lightAccent hover:bg-primary/10"
            }`}
          >
            <div className={`p-4 rounded-full ${selectedRole === "patient" ? "bg-white/20" : "bg-sky-100"}`}>
              <Brain className={`h-12 w-12 ${selectedRole === "patient" ? "text-white" : "text-primary"}`} />
            </div>
            <h2 className="text-2xl font-light">Patient</h2>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={handleConfirm}
            disabled={!selectedRole}
            variant={selectedRole ? "default" : "secondary"}
            size="md"
            className="animate-fade-in"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
