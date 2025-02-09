'use client'

import { useEffect, useState } from "react";
import { DoctorsInterface } from "~/server/db/type";
import Loading from "../loading/page";
import { redirect } from "next/navigation";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorsInterface | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db/Doctor/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const result: DoctorsInterface = await response.json();

        if (!result) {
          redirect('dashboard/get-started');
        }

        setDoctor(result);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData();
  }, [])

  if (!doctor) {
    return <Loading />
  }

  return (
    <main>{JSON.stringify(doctor)}</main>
  )
}