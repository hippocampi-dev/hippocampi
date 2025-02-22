'use client'

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { DoctorsInterface } from "~/server/db/type";
import MessageButton from "./MessageButton";
import { useContext, useEffect, useState } from "react";
import Loading from "../loading/page";
import { PatientDashboardContext } from "~/app/context/PatientDashboadContext";

export default function HealthcareProviders() {
  const context = useContext(PatientDashboardContext)

  if (!context || context.isLoading) {
    return <Loading />
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Healthcare Providers</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col space-y-6">
          {context.data?.doctors!.map(doctor => (
            <li 
              key={doctor.doctorId}
              className="rounded border p-4 shadow-md"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {doctor.specialization || "General Practitioner"} | {doctor.location}
                </p>
                <p className="text-sm text-gray-600">
                  Ratings: {doctor.ratings ?? "N/A"}
                </p>
                <p className="mt-2 text-gray-700">{doctor.bio}</p>
              </div>
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`https://placeholder.com/reviews/${doctor.doctorId}`}>
                    Details
                  </Link>
                </Button>
                <Button variant="default" className="flex-1" asChild>
                  <MessageButton doctorId={doctor.doctorId} patientId={context.data?.id!} />
                </Button>
                <Button variant="default" className="flex-1" asChild>
                  <Link href={`/dashboard/appointments/schedule?doctorId=${doctor.doctorId}`}>
                    Schedule Appointment
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}