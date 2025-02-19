import { getDoctor } from "~/server/db/queries";


export default async function doctorsInformation({id}: {id: string}) {
    const doctorInfo = getDoctor(id as "string");
    return (
        <main>{JSON.stringify(doctorInfo)}</main>
    )
}