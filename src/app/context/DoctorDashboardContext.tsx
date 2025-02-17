'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import { DoctorDashboardSidebar } from '~/components/doctor-dashboard/dashboard-sidebar';
import { SidebarProvider } from '~/components/ui/sidebar';
import { PatientDoctorManagementInterface, PatientHealthInformationInterface, PatientsInterface, AppointmentsInterface, UserIdInterface, DoctorsInterface, role, DoctorSubscriptionsInterface } from '~/server/db/type';

// Define the context type
interface DoctorDashboardData {
  isSubscribed?: Boolean
  patients?: PatientsInterface[]
  patientDict?: PatientDict
  management?: PatientDoctorManagementInterface[]
  appointments?: AppointmentsInterface[]
}

export interface IPatient {
  patient: PatientsInterface
  management: PatientDoctorManagementInterface
  healthInfo: PatientHealthInformationInterface
}

export type PatientDict = { [key: string]: IPatient }

interface DoctorContextProps {
  doctor?: DoctorsInterface,
  data?: DoctorDashboardData,
  isLoading?: boolean,
  error?: Error | undefined,
  fetchPatientData?: () => Promise<void>
}

export const DoctorDashboardContext = createContext<DoctorContextProps | undefined>({});

// Define provider props with proper children typing
interface DoctorDashboardProviderProps {
  children: React.ReactNode;
}

export function DoctorDashboardProvider({ children }: DoctorDashboardProviderProps) {
  const [props, setProps] = useState<DoctorContextProps>();
  const [data, setData] = useState<DoctorDashboardData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const {data: session} = useSession();

  const fetchPatientData = async () => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      // fetch Patient-Doctor Management
      const management = await fetchManagement();
      
      // fetch appointments
      const appointments = await fetchAppointments();

      // fetch doctor
      const doctor = await fetchDoctor();

      const fetchedPatients: PatientsInterface[] = []; // patients
      const patientManagementList: { [key: string]: IPatient } = {} // patient PatientDict

      // PatientDict stuff
      management.forEach(async (m) => {

        const patient = await fetchPatient(m.patientId as "string"); // fetch patient

        if (!patient) return;

        fetchedPatients.push(patient); // append patient

        const healthInfo = await fetchHealthInfo() // fetch health info

        patientManagementList[m.patientId] = { // append PatientDict
          patient: patient,
          management: m,
          healthInfo: healthInfo
        };
      });

      // Filter out any failed fetches
      const validPatients = fetchedPatients.filter(
        (patient): patient is PatientsInterface => 
          patient !== undefined && patient !== null
      ) as PatientsInterface[];

      const _data: DoctorDashboardData = {
        patients: validPatients,
        patientDict: patientManagementList,
        management: management,
        appointments: appointments,
      }

      const props: DoctorContextProps = {
        doctor: doctor,
        data: data,
        isLoading: isLoading,
        error: error,
        fetchPatientData: fetchPatientData
      };

      // set values
      setData(_data);
      setProps(props);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch patient data'));
    } finally {
      setIsLoading(false);
    }
  };


  const validateUser = async () => {
    if (!session) return true;

    try {
      const response = await fetch("/api/db/management/user-role/get");

      const result = await response.json();
      if (result.response.userRole === role.doctor || result.response.userRole === role.admin) {
        return true;
      }
      return false
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const onStart = async () => {
      const isValid = await validateUser();
      const subscription = await fetchSubscription();
      if (!isValid) { // if not doctor --> redirect to patient dashboard
        redirect('/dashboard/patient');
      }
      else if (!subscription!.isSubscribed!) { // not subscribed --> redirect to subscriptions page
        redirect(subscription?.url!);
      }
      else {
        fetchPatientData();
      }
    }

    onStart();
  }, []);

  return (
    <DoctorDashboardContext.Provider value={props}>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <DoctorDashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </SidebarProvider>
    </DoctorDashboardContext.Provider>
  );
}

// return PatientsInterface
export const fetchPatient = async (patientId: UserIdInterface) => {
  try {
    const response = await fetch('/api/db/patient/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientId),
      // cache: 'force-cache',
      // next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    const result = await response.json();

    const filteredResult: PatientsInterface = result.response;

    return filteredResult;
  } catch (error) {
    console.log(`Failed to fetch patient ${patientId}`);
    return undefined;
  }
}

// return PatientDoctorManagement[]
export const fetchManagement = async () => {
  try {
    const response = await fetch('/api/db/management/patient-doctor-management/get');
    
    const result = await response.json();
   
    const filteredResult: PatientDoctorManagementInterface[] = result.response;
    
    return filteredResult;
  } catch (error) {
    console.log('Failed to fetch patient-doctor-management');
    return [];
  }
}

// return ScheduledMeetings
export const fetchAppointments = async () => {
  try {
    const response = await fetch('/api/db/management/appointments/get');

    const result = await response.json();

    const filteredResult: AppointmentsInterface[] = result.response;

    return filteredResult
  } catch (error) {
    console.log('Failed to fetch scheduled appointments');
    return [];
  }
}

// return PatientsInterface[]
export const fetchPatients = async () => {
  // Fetch Patient-Doctor Management
  const management = await fetchManagement();

  // Filter into ids list
  const patientIds = management.map((m) => m.patientId);

  return patientIds;
}

export const fetchDoctor = async () => {
  try {
    const response = await fetch('/api/db/doctor/get');

    const result = await response.json();

    const filteredResult: DoctorsInterface = result.response;

    return filteredResult;
  } catch (error) {
    console.log('Failed to fetch doctor');
    return undefined;
  }
}

export const fetchHealthItem = async (route: string) => {
  try {
    const response = await fetch(route);
    
    const result = await response.json();

    const filteredResult = result.response;

    return filteredResult
  } catch (error) {
    console.log('Failed to some health info item');
    return [];
  }
}

export const fetchHealthInfo = async () => {
  const allergies = await fetchHealthItem('/api/db/patient/allergies/get');
  const cognitiveSymptoms = await fetchHealthItem('/api/db/patient/cognitive-symptoms/get');
  const dianoses = await fetchHealthItem('/api/db/patient/diagnoses/get');
  const emergencyContacts = await fetchHealthItem('/api/db/patient/emergency-contacts/get');
  const medications = await fetchHealthItem('/api/db/patient/medications/get');
  const treatments = await fetchHealthItem('/api/db/patient/treatments/get');
  const medicalHistory = await fetchHealthItem('/api/db/patient/medical-history/get');

  const patientDictKey: PatientHealthInformationInterface = {
    allergies: allergies,
    cognitiveSymptoms: cognitiveSymptoms,
    dianoses: dianoses,
    emergencyContacts: emergencyContacts,
    medications: medications,
    treatments: treatments,
    medicalHistory: medicalHistory
  }

  return patientDictKey;
}

// fetch subscription
export const fetchSubscription = async () => {
  try {
    const response = await fetch('/api/db/doctor/subscription/get');
    
    const result = await response.json();

    const data: DoctorSubscriptionsInterface = result.response;

    if (data.status === 'subscribed') { // subscribed
      return {
        isSubscribed: true,
        url: null
      }
    }
    if (data.stripeCustomerId) { // canceled subscription
      return {
        isSubscribed: false,
        url: '/dashboard/doctor/account'
      }
    }
    else {
      return {
        isSubscribed: false,
        url: '/checkout/subscription'
      }
    }
  } catch (error) {
    console.log('Failed to subscription');
    return undefined;
  }
}