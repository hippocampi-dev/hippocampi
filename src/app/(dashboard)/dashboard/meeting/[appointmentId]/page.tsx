'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VideoCall, VideoPreviewComponent } from '~/components/video-call/VideoCall';
import { getAppointmentDetails } from '~/app/_actions/schedule/actions';
import { AppointmentsInterface } from '~/server/db/type';
import { createMeeting } from '~/app/_actions/stream/actions';

export default function MeetingPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<AppointmentsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinCall, setJoinCall] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userType, setUserType] = useState<'doctor' | 'patient' | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        
        if (!appointmentId || typeof appointmentId !== 'string') {
          throw new Error('Invalid appointment ID');
        }
        
        // Fetch appointment details
        const appointmentData = await getAppointmentDetails(appointmentId);
        setAppointment(appointmentData);
        
        // Create the meeting if it doesn't exist
        await createMeeting(appointmentId, appointmentData.doctorId as string);
        
        // Determine if user is doctor or patient based on stored user session
        // This is a simplified approach - in a real app you'd use your auth system
        const userSession = sessionStorage.getItem('userSession');
        const parsedSession = userSession ? JSON.parse(userSession) : null;
        
        if (parsedSession) {
          if (parsedSession.id === appointmentData.doctorId) {
            setUserType('doctor');
            setUserId(appointmentData.doctorId as string);
            setUserName(`Dr. ${parsedSession.name || 'Doctor'}`);
          } else if (parsedSession.id === appointmentData.patientId) {
            setUserType('patient');
            setUserId(appointmentData.patientId as string);
            setUserName(parsedSession.name || 'Patient');
          } else {
            throw new Error('Unauthorized to join this meeting');
          }
        } else {
          // Fallback for demo purposes - this would be handled by auth in a real app
          // Just for testing, default to a role
          setUserType('doctor'); 
          setUserId(appointmentData.doctorId as string);
          setUserName('Test Doctor');
        }
      } catch (err) {
        console.error('Error loading appointment:', err);
        setError(err instanceof Error ? err.message : 'An error occurred loading the appointment');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Appointment not found</p>
      </div>
    );
  }

  if (!userType || !userId || !userName) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to determine user identity</p>
      </div>
    );
  }

  if (!joinCall) {
    return (
      <VideoPreviewComponent
        appointmentId={appointmentId as string}
        userId={userId}
        userName={userName}
        onJoin={() => setJoinCall(true)}
      />
    );
  }

  return (
    <VideoCall
      appointmentId={appointmentId as string}
      userId={userId}
      userName={userName}
    />
  );
}
