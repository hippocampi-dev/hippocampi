'use client'

import { useEffect, useState } from "react";
import { PatientsInterface } from "~/server/db/type";

export default function PatientDashboard() {
  const [patient, setPatient] = useState<PatientsInterface>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db/patient/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const result: PatientsInterface = await response.json();

        setPatient(result);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData();
  }, [])
  return (
    <main>{JSON.stringify(patient)}</main>
  )
}