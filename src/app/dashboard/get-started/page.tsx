"use client";

import DoctorForm from "~/components/doctor-form/page";
import { useEffect, useState } from "react";
import Loading from "~/components/loading/page";
import PatientDashboard from "~/components/patient-dashboard/page";
import { role } from "~/server/db/type";

export default function NewUserForm() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/management/user-role/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result: string = await response.json();
        setUserRole(result);
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
    <PatientDashboard />
  )

  if (userRole === role.doctor) return (
    <main className="container mx-auto py-10">
      <DoctorForm />
    </main>
  );
}
