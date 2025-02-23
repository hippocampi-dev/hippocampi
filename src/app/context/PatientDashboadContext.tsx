'use client'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import { SidebarProvider } from '~/components/ui/sidebar';
import {
  DoctorsInterface,
  PatientDoctorManagementInterface,
  role, 
  SubscriptionsInterface,
  UserIdInterface, 
} from '~/server/db/type';

// Define the context type
interface DoctorDashboardData {
  isSubscribed?: Boolean;
  doctors?: DoctorsInterface[];
  management?: PatientDoctorManagementInterface[];
  id?: UserIdInterface
}

interface DoctorContextProps {
  data?: DoctorDashboardData
  isLoading?: boolean;
  error?: Error | undefined;
}

export const PatientDashboardContext = createContext<DoctorContextProps | undefined>(undefined);

// Define provider props with proper children typing
interface PatientDashboardProviderProps {
  children: React.ReactNode;
}

export function PatientDashboardProvider({ children }: PatientDashboardProviderProps) {
  const [state, setState] = useState<DoctorContextProps>({
    isLoading: true,
    error: undefined,
  });
  
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<Error>();

  const fetchDoctorData = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      // fetch Doctor-Doctor Management
      const management = await fetchManagement();
      
      const fetchedDoctors: DoctorsInterface[] = [];

      // Process patients sequentially to ensure data consistency
      for (const m of management) {
        try {
          const doctor = await fetchDoctor(m.doctorId as "string");
          fetchedDoctors.push(doctor);
        } catch (error) {
          console.error(`Failed to process patient ${m.doctorId}:`, error);
        }
      }

      const _data: DoctorDashboardData = {
        doctors: fetchedDoctors,
        management: management,
        id: session?.user.id as "string"
      };

      // console.log(_data);

      setState(prev => ({
        ...prev,
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
      return result.response.userRole === role.patient || result.response.userRole === role.admin;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return false;
    }
  };

  useEffect(() => {
    const onStart = async () => {
      const isValid = await validateUser();
      // const subscription = await fetchSubscription();
      
      if (!isValid) {
        redirect('/dashboard/doctor');
      // } else if (!subscription?.isSubscribed) {
      //   redirect(subscription?.url || '/dashboard/patient/billing');
      } else {
        await fetchDoctorData()
      }

      setState({
        ...state,
        isLoading: false
      })
    };
    
    onStart();
  }, []);

  return (
    <PatientDashboardContext.Provider value={state}>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </SidebarProvider>
    </PatientDashboardContext.Provider>
  );
}

// fetch subscription
export const fetchSubscription = async () => {
  try {
    const response = await fetch('/api/db/management/subscription/get');
    
    const result = await response.json();

    const data: SubscriptionsInterface = result.response;

    if (data.status === 'subscribed') { // subscribed
      return {
        isSubscribed: true,
        url: null
      }
    }
    if (data.stripeCustomerId) { // old customer that canceled subscription
      return {
        isSubscribed: false,
        url: '/dashboard/patient/billing'
      }
    }
    else { // new customer
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


// return DoctorDoctorManagement[]
export const fetchManagement = async () => {
  try {
    const response = await fetch('/api/db/management/patient-doctor-management/get')
      .then(r => r.json())
      .then(r => r.response);
    
    return response;
  } catch (error) {
    console.log('Failed to fetch patient-doctor-management');
    return [];
  }
}

// return DoctorsInterface
export const fetchDoctor = async (doctorId: UserIdInterface) => {
  try {
    const response = await fetch('/api/db/patient/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doctorId),
    })
      .then(r => r.json())
      .then(r => r.response)

    return response;
  } catch (error) {
    console.log(`Failed to fetch doctor ${doctorId}`);
    return undefined;
  }
}