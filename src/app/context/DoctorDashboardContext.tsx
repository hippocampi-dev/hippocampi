'use client'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import { DoctorDashboardSidebar } from '~/components/doctor-dashboard/dashboard-sidebar';
import { SidebarProvider } from '~/components/ui/sidebar';
import { 
  PatientDoctorManagementInterface, 
  PatientHealthInformationInterface, 
  PatientsInterface, 
  AppointmentsInterface, 
  UserIdInterface, 
  DoctorsInterface, 
  role, 
  DoctorSubscriptionsInterface, 
  InvoicesInterface 
} from '~/server/db/type';

// Define the context type
interface DoctorDashboardData {
  isSubscribed?: Boolean;
  patients?: PatientsInterface[];
  patientDict?: PatientDict;
  management?: PatientDoctorManagementInterface[];
  appointments?: AppointmentsInterface[];
  invoices?: InvoicesInterface[];
}

export interface IPatient {
  patient: PatientsInterface;
  management: PatientDoctorManagementInterface;
  healthInfo: PatientHealthInformationInterface;
}

export type PatientDict = { [key: string]: IPatient };

interface DoctorContextProps {
  doctor?: DoctorsInterface;
  data?: DoctorDashboardData;
  isLoading?: boolean;
  error?: Error | undefined;
  fetchPatientData?: () => Promise<void>;
}

export const DoctorDashboardContext = createContext<DoctorContextProps | undefined>(undefined);

// Define provider props with proper children typing
interface DoctorDashboardProviderProps {
  children: React.ReactNode;
}

export function DoctorDashboardProvider({ children }: DoctorDashboardProviderProps) {
  const [state, setState] = useState<DoctorContextProps>({
    isLoading: true,
    error: undefined,
    data: undefined,
    doctor: undefined,
    fetchPatientData: undefined
  });
  
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<Error>();

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
      // fetch invoices
      const invoices = await fetchInvoices();
      
      const fetchedPatients: PatientsInterface[] = [];
      const patientManagementList: { [key: string]: IPatient } = {};

      // Process patients sequentially to ensure data consistency
      for (const m of management) {
        try {
          const patient = await fetchPatient(m.patientId as "string");
          if (!patient) continue;
          
          fetchedPatients.push(patient);
          const healthInfo = await fetchHealthInfo();
          
          patientManagementList[m.patientId] = {
            patient,
            management: m,
            healthInfo
          };
        } catch (error) {
          console.error(`Failed to process patient ${m.patientId}:`, error);
        }
      }

      const _data: DoctorDashboardData = {
        patients: fetchedPatients,
        patientDict: patientManagementList,
        management: management,
        appointments: appointments,
        invoices: invoices
      };

      setState(prev => ({
        ...prev,
        doctor: doctor,
        data: _data,
        isLoading: false
      }));
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
      return result.response.userRole === role.doctor || result.response.userRole === role.admin;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return false;
    }
  };

  useEffect(() => {
    const onStart = async () => {
      const isValid = await validateUser();
      const subscription = await fetchSubscription();
      
      if (!isValid) {
        redirect('/dashboard/patient');
      } else if (!subscription?.isSubscribed) {
        redirect(subscription?.url || '/dashboard/doctor/account');
      } else {
        setState(prev => ({
          ...prev,
          fetchPatientData: fetchPatientData
        }));
        await fetchPatientData();
      }
    };
    
    onStart();
  }, []);

  return (
    <DoctorDashboardContext.Provider value={state}>
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
    const response = await fetch(route).then(r => r.json()).then(r => r.response);

    return response
  } catch (error) {
    console.log('Failed to some health info item');
    return [];
  }
}

export const fetchHealthInfo = async () => {
  const allergies = await fetchHealthItem('/api/db/patient/health-info/allergies/get');
  const cognitiveSymptoms = await fetchHealthItem('/api/db/patient/health-info/cognitive-symptoms/get');
  const diagnoses = await fetchHealthItem('/api/db/patient/health-info/diagnoses/get');
  const emergencyContacts = await fetchHealthItem('/api/db/patient/health-info/emergency-contacts/get');
  const medications = await fetchHealthItem('/api/db/patient/health-info/medications/get');
  const treatments = await fetchHealthItem('/api/db/patient/health-info/treatments/get');
  const medicalHistory = await fetchHealthItem('/api/db/patient/health-info/medical-history/get');

  const patientDictKey: PatientHealthInformationInterface = {
    allergies: allergies,
    cognitiveSymptoms: cognitiveSymptoms,
    diagnoses: diagnoses,
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

export const fetchInvoices = async () => {
  try {
    const response = await fetch('/api/db/management/invoices/get').then(r => r.json()).then(r => r.response);
    // console.log(response);
    return response;
  } catch (error) {
    console.log('Failed to patient invoices');
    return [];
  }
}