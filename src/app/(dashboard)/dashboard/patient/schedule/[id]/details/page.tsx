"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { getAppointmentDetails } from '~/app/_actions/schedule/actions';
import { getPatientDetails, getDoctorDetails } from '~/app/_actions/users/actions';

interface AppointmentData {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  reason: string | null;
  status: "Scheduled" | "Canceled" | "Completed" | "No-Show";
  notes: string | null;
  file: string | null;
  created_at: string;
  updated_at: string;
}

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string | null;
}

interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string | null;
  specialization?: string | null;
}

export default function PatientAppointmentDetails() {
  const params = useParams<{ id: string}>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pdf");
  const pdfUrl = `${appointment?.file}?t=${new Date().getTime()}`;

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        const appointmentData = await getAppointmentDetails(params.id);
        setAppointment(appointmentData);
        
        if (appointmentData) {
          // Fetch patient and doctor info
          const patientData = await getPatientDetails(appointmentData.patientId);
          const doctorData = await getDoctorDetails(appointmentData.doctorId);
          
          if (patientData) {
            setPatient({
              id: patientData.patientId,
              firstName: patientData.firstName,
              lastName: patientData.lastName,
              dateOfBirth: patientData.dateOfBirth,
              email: patientData.email,
              phone: patientData.phoneNumber || null,
            });
          }
          
          if (doctorData) {
            setDoctor({
              id: doctorData.doctorId,
              firstName: doctorData.firstName,
              lastName: doctorData.lastName,
              specialty: null, // Adjusted to handle missing property
              specialization: doctorData.specialization || null,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        toast.error("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [params.id]);

  const handleDownloadPdf = () => {
    if (appointment?.file) {
      window.open(appointment.file, '_blank');
    } else {
      toast.error("No PDF file available for this appointment.");
    }
  };

  const navigateBack = () => {
    router.push('/dashboard/patient/schedule');
  };

  // Format date function
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-auto container max-w-6xl py-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Appointment Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {appointment?.status} | {formatDate(appointment?.scheduledAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={navigateBack}
              >
                <FiArrowLeft size={16} /> Back to Appointments
              </Button>
              {appointment?.file && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleDownloadPdf}
                >
                  <FiDownload size={16} /> Download PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted/40 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{patient ? formatDate(patient.dateOfBirth).split(',')[1] : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{patient?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Doctor Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialty</p>
                  <p className="font-medium">{doctor?.specialty || doctor?.specialization || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Time</p>
                  <p className="font-medium">{formatDate(appointment?.scheduledAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{appointment?.reason || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              {appointment?.file && <TabsTrigger value="pdf">PDF Document</TabsTrigger>}
              <TabsTrigger value="details">Consultation Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-0">
              <div className="bg-card p-6 border rounded-lg">
                {appointment?.notes ? (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line">{appointment.notes}</div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg font-medium text-muted-foreground">No consultation notes available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {appointment?.file && (
              <TabsContent value="pdf" className="mt-0">
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <div className="h-[800px] w-full">
                    <iframe 
                      src={`${pdfUrl}#toolbar=0`} 
                      className="w-full h-full" 
                      title="Consultation PDF" 
                    />
                  </div>
                  <div className="bg-background p-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadPdf}
                      className="flex items-center gap-2"
                    >
                      <FiDownload size={16} /> Download PDF
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
