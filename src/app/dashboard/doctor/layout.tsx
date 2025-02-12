import { DoctorDashboardProvider } from "~/app/context/DoctorDashboardContext";

export default function DoctorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DoctorDashboardProvider>
      {children}
    </DoctorDashboardProvider>
  )
}