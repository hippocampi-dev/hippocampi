"use client";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ExternalLink, Star, ArrowLeft, } from "lucide-react";
import Link from "next/link";
import { redirect, } from "next/navigation";
import { useEffect, useState } from "react";
import { DoctorsInterface, UserIdInterface } from "~/server/db/type";
import ChooseDoctorButton from "~/components/patient-dashboard/ChooseDoctorButton";
import { getUserId } from "~/utilities/getUser";
import { useSession } from "next-auth/react";

// Assuming ChooseDoctorButton is a component from their codebase
// If this component doesn't exist, they'll need to implement it

interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  specialization: string;
  ratings: string;
  location: string;
  bio: string;
  profileUrl: string;
}

export default function DoctorDisplay() {
  const { data: session, status } = useSession()
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // Ensure filteredDoctors exists before slicing
  if (!localStorage.getItem("assessment results")) {
    redirect("/dashboard/patient/select-doctor")
  }
  const storageResults = localStorage.getItem("assessment results");
  if (!storageResults) {
    redirect("/dashboard/patient");
  }
  const storageJSON = JSON.parse(storageResults);
  console.log("storage" + JSON.stringify(storageJSON));
  useEffect(() => {
    interface DoctorId {
      doctorId: string;
    }
    
    const fetchDoctors = async () => {
      const doctorObjects: Doctor[] = await Promise.all(
        storageJSON.selectedDoctors?.map(async (doctorId: DoctorId) => {
          console.log("doctorId =" + doctorId.doctorId);
          const response = await fetch("/api/db/doctor/get/docId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doctorId),
          });
          const doctor: Doctor = await response.json();
          console.log("doctor is " + JSON.stringify(doctor));
          return doctor;
        }),
      );
      console.log("doctorObjects + ", JSON.stringify(doctorObjects));
      setDoctors(doctorObjects);
    };
    fetchDoctors();
    console.log("doctors are " + JSON.stringify(doctors));
  }, [storageResults]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/patient/cognitive-assessment/8">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <h2 className="mb-6 text-center text-2xl font-bold">
        We think these doctors would be best for you
      </h2>

      <div className="mt-6 flow-root">
        <p className="mb-6 text-gray-600">
          {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"} found
        </p>

        {doctors.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-medium">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Top row */}
            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                {/* External link to doctor's full profile */}
                <a
                  href={doctors[0]?.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 p-2 text-gray-500 transition-colors hover:text-primary"
                  aria-label={`View ${doctors[0]?.firstName} ${doctors[0]?.lastName}'s full profile`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>

                <div className="flex items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Dr. {doctors[0]?.firstName} {doctors[0]?.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {doctors[0]?.specialization || "General Practitioner"}
                    </p>
                    <div className="mt-1 flex items-center">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="ml-1 text-sm font-medium">
                        {doctors[0]?.ratings || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    {doctors[0]?.location}
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Bio: {doctors[0]?.bio}
                  </p>
                </div>

                <ChooseDoctorButton iDoctorId={doctors[0]?.doctorId || ""} patientId={session?.user.id as "string"} />
              </CardContent>
            </Card>

            {/* Text box spanning two columns */}
            <Card className="col-span-2 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="flex h-full flex-col justify-center p-8">
                <h3 className="mb-4 text-xl font-bold">
                  Based on your cognitive assessment, we've found the best doctor for you
                </h3>
                <p className="mb-3 text-gray-700">
                  {JSON.stringify(storageJSON.recommendations)}
                </p>
              </CardContent>
            </Card>

            {/* Bottom row with 3 doctors */}
            {doctors.slice(1, 4).map((doctor) => (
              <Card
                key={doctor.doctorId}
                className="relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <a
                    href={doctor.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 top-2 p-2 text-gray-500 transition-colors hover:text-primary"
                    aria-label={`View ${doctor.firstName} ${doctor.lastName}'s full profile`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>

                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {doctor.specialization || "General Practitioner"}
                      </p>
                      <div className="mt-1 flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="ml-1 text-sm font-medium">
                          {doctor.ratings || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      {doctor.location}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-600">Bio: {doctor.bio}</p>
                  </div>

                  <ChooseDoctorButton
                    iDoctorId={doctor.doctorId}
                    patientId={session?.user.id as "string"}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
