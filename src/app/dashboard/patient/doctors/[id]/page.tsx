'use client'
import { useParams, usePathname } from 'next/navigation';
import doctorsInformation from './doctors';
export default function Page() {
  const params = useParams();
  const id = params.id;



  return (
    <main>{doctorsInformation({id as "string"})}</main>
  )
}