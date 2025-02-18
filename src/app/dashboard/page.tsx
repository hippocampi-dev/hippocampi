'use client'
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "~/components/loading/page";
import { useCheckUserRole } from "../hooks/useCheckUserRole";

export default function Dashboard() {
  useCheckUserRole();
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const userRoleResponse = await fetch("/api/db/management/user-role/get");
        
        if (!userRoleResponse.ok) {
          const errorData = await userRoleResponse.json();
          throw new Error(errorData?.error || 'An error occurred');
        }

        const userRoleData = await userRoleResponse.json();

        if (!userRoleData.response) redirect('/select-role')

        const role = userRoleData.response.userRole;
        
        if (role === 'doctor') {
          const doctorResponse = await fetch('api/db/doctor/get');
          const doctorData = await doctorResponse.json();
          const doctor = doctorData.response;

          if (!doctor) {
            router.push('/dashboard/get-started');
          } else {
            router.push('/dashboard/doctor');
          }
        } else if (role === 'patient') {
          const patientResponse = await fetch('api/db/patient/get');
          const patientData = await patientResponse.json();
          const patient = patientData.response;

          if (!patient) {
            router.push('/dashboard/get-started');
          } else {
            router.push('/dashboard/patient');
          }
        }
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };

    redirectUser();
  }, []); // Add router to dependencies

  return <Loading />;
}