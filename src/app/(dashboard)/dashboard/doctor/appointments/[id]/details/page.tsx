"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiEdit, FiDownload, FiUsers, FiCalendar } from 'react-icons/fi';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/app/contexts/ToastContext";
import { getAppointmentDetails } from '~/app/_actions/schedule/actions';
import { getPatientDetails, getDoctorDetails } from '~/app/_actions/users/actions';
import { fetchConsultationNotes } from "~/app/_actions/schedule/actions";

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
}

export default function AppointmentDetails() {
  const params = useParams<{ id: string}>()
  
  const router = useRouter();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [notesDraft, setNotesDraft] = useState(false);

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
          } else {
            setPatient(null);
          }
          if (doctorData) {
            setDoctor({
              id: doctorData.doctorId,
              firstName: doctorData.firstName,
              lastName: doctorData.lastName,
              specialty: null, // Replace with actual property if available in doctorData
            });
          } else {
            setDoctor(null);
          }
          
          // Fetch consultation notes to check if they're in draft form
          const notesResponse = await fetchConsultationNotes(params.id);
          if (notesResponse.success && notesResponse.data) {
            setNotesDraft(notesResponse.data.isDraft || false);
          }
        }
      } catch (error) {
        // ...existing error handling...
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [params.id, toast]);

  const handleEditClick = () => {
    router.push(`/dashboard/doctor/appointments/${params.id}/details/edit`);
  };

  const handleDownloadPdf = () => {
    if (appointment?.file) {
      window.open(appointment.file, '_blank');
    } else {
      toast({
        title: "No PDF Available",
        description: "There is no PDF file available for this appointment.",
        variant: "destructive"
      });
    }
  };

  const navigateToAllPatients = () => {
    router.push('/dashboard/doctor/patients');
  };

  const navigateToAllAppointments = () => {
    router.push('/dashboard/doctor/appointments');
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
    <div className="container max-w-6xl py-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Appointment Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {appointment?.status} | Last updated: {formatDate(appointment?.updated_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={navigateToAllPatients}
              >
                <FiUsers size={16} /> All Patients
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={navigateToAllAppointments}
              >
                <FiCalendar size={16} /> All Appointments
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
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleEditClick}
              >
                <FiEdit size={16} /> 
                {appointment?.file 
                  ? (notesDraft ? 'Continue Editing' : 'Edit')
                  : 'Create'} Consultation
              </Button>
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
              <h3 className="font-semibold text-lg mb-4">Appointment Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialty</p>
                  <p className="font-medium">{doctor?.specialty || 'N/A'}</p>
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
                    {notesDraft && (
                      <p className="text-sm text-muted-foreground mt-2">Note: These notes are in draft form.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg font-medium text-muted-foreground">No consultation notes available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create a consultation note to add details about this appointment
                    </p>
                    <Button onClick={handleEditClick} className="mt-4">
                      Create Consultation Note
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {appointment?.file && (
              <TabsContent value="pdf" className="mt-0">
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <div className="h-[800px] w-full">
                    <iframe 
                      src={`${appointment.file}#toolbar=0`} 
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
