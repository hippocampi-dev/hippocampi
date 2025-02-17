// app/dashboard/page.tsx
import * as React from 'react';
import TitleCard from '~/components/patient-dashboard/TitleCard';
import PatientNotifications from '~/components/patient-dashboard/PatientNotifications';
import HealthcareProviders from '~/components/patient-dashboard/HealthcareProviders';
import { Bell, Calendar, ChevronDown, FileText, Home, LogOut, User, UserCircle, Video } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default async function DashboardHome() {
  // Assume session is already handled in the layout (or fetched here via your method)
  const session = { user: { name: "John Doe" } }; // replace with actual session logic

  return (
    <div>
      <TitleCard name={session.user.name} />
      <div className="grid flex-1 gap-8 overflow-hidden md:grid-cols-3">
        <PatientNotifications />
        <div className="flex flex-col space-y-8">
          <HealthcareProviders />
          <div className="card p-4 bg-white rounded shadow">
            <div className="card-header mb-4">
              <h2 className="text-xl font-bold">Meeting Link</h2>
            </div>
            <div className="card-content">
              <Button className="w-full">
                <Video className="mr-2 h-4 w-4" />
                Join Video Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
