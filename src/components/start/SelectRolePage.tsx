"use client";

import { useState } from "react";
import { z } from "zod";
import { role } from "~/server/db/type";
import useSetUserRole from "~/app/hooks/useSetUserRole";
import { redirect } from "next/navigation";

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
      setUserRole(selectedRole).then(redirect("/dashboard"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Select Your Role
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedRole(role.doctor)}
            className={`flex-1 rounded-lg border p-4 text-center text-lg font-medium transition-all ${
              selectedRole === "doctor"
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => setSelectedRole(role.patient)}
            className={`flex-1 rounded-lg border p-4 text-center text-lg font-medium transition-all ${
              selectedRole === "patient"
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            Patient
          </button>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selectedRole}
          className={`mt-8 w-full rounded-lg p-4 text-center text-lg font-bold transition-all ${
            selectedRole
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
