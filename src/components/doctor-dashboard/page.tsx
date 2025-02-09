'use client'

import { useEffect, useState } from "react";
import { DoctorsInterface } from "~/server/db/type";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorsInterface>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db/doctor/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const result: DoctorsInterface = await response.json();

        setDoctor(result);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData();
  }, [])
  return (
    <main>{JSON.stringify(doctor)}</main>
  )
}