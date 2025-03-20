"use client";

import { useEffect, useState } from "react";
import { DoctorsInterface, PatientDoctorManagementInterface } from "~/server/db/type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AvailabilityCarousel } from "./AvailabilityCarousel";

// Remove the server action import
// import { fetchDoctorDetails } from "./actions"; 

interface DoctorAppointmentsProps {
  patientId: string;
  doctorManagement: PatientDoctorManagementInterface[];
}

export function DoctorAppointments({ patientId, doctorManagement }: DoctorAppointmentsProps) {
  const [doctors, setDoctors] = useState<{ doctor: DoctorsInterface; lastVisit: Date | null }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorDetails = async () => {
      try {
        // Use fetch to call the API endpoint instead of direct server action
        const doctorDetails = await Promise.all(
          doctorManagement.map(async (mgmt) => {
            const response = await fetch(`/api/db/doctor/details?id=${mgmt.doctorId}`);
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Failed to fetch doctor details");
            }
            
            return {
              doctor: data.doctor,
              lastVisit: mgmt.lastVisit ? new Date(mgmt.lastVisit) : null,
            };
          })
        );
        setDoctors(doctorDetails);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load doctor details:", error);
        setLoading(false);
      }
    };

    loadDoctorDetails();
  }, [doctorManagement]);

  if (loading) {
    return <div className="flex justify-center py-10">Loading your doctors...</div>;
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-lg mb-4">You don't have any doctors assigned yet.</p>
        <Button>Find Doctors</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Doctors</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(({ doctor, lastVisit }) => (
          <Card 
            key={doctor.doctorId} 
            className={`transition-all cursor-pointer hover:shadow-md ${selectedDoctor === doctor.doctorId ? 'border-primary ring-2 ring-primary/20' : ''}`}
            onClick={() => setSelectedDoctor(doctor.doctorId)}
          >
            <CardHeader>
              <CardTitle>Dr. {doctor.firstName} {doctor.lastName}</CardTitle>
              <CardDescription>{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden">
                  {doctor.profileUrl && (
                    <img 
                      src={doctor.profileUrl}
                      alt={`Dr. ${doctor.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  {lastVisit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last Visit: {lastVisit.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedDoctor === doctor.doctorId ? "default" : "outline"} 
                className="w-full"
                onClick={() => setSelectedDoctor(doctor.doctorId)}
              >
                {selectedDoctor === doctor.doctorId ? "Selected" : "Select Doctor"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedDoctor && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
          <AvailabilityCarousel doctorId={selectedDoctor} patientId={patientId} />
        </div>
      )}
    </div>
  );
}
