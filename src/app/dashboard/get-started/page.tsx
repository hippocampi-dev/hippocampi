"use client";

import DoctorForm from "~/components/doctor-form/page";
import { useEffect, useState } from "react";
import Loading from "~/components/loading/page";
import PatientDashboard from "~/components/patient-dashboard/page";
import { role, UserRolesInterface } from "~/server/db/type";
import PatientForm from "~/components/start/PatientForm";

export default function NewUserForm() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/management/user-role/get");
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || 'An error occurred');
        }
    
        const data = await response.json();
        
        setUserRole(data.response.userRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (userRole === "") return (
    <Loading />
  )

  if (userRole === role.patient) return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <PatientForm />
    </main>
  )

  if (userRole === role.doctor) return (
    <main className="container mx-auto py-10">
      <DoctorForm />
    </main>
  );
}
