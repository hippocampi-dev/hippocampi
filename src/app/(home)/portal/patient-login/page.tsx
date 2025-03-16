import { redirect } from "next/navigation";

export default async function PatientLogin() {
  redirect('/auth/login');
}