import { redirect } from "next/navigation";
import { getDoctorAvailabilities } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default async function Page() {
    const doctorId = await getUserId();
    if (!doctorId) {
        redirect('/')
    }
    const doctorAvailabilities = await getDoctorAvailabilities(doctorId);
    return (
        <div>
            {JSON.stringify(doctorAvailabilities)}
        </div>
    )
}