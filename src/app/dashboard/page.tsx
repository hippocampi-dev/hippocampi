'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "~/components/loading/page";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const response = await fetch("/api/db/management/user-role/get");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || 'An error occurred');
        }

        const data = await response.json();
        console.log(data);
        const role = data.response.userRole;
        
        if (role === 'doctor') {
          router.push('/dashboard/doctor');
        } else if (role === 'patient') {
          router.push('/dashboard/patient');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    redirectUser();
  }, []); // Add router to dependencies

  return <Loading />;
}