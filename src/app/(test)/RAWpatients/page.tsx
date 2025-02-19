import { auth } from "~/server/auth";
import { getConversation } from "~/server/db/queries";


export default async function Test() {
    const session = await auth()
    // const conversation = getConversation(session?.user.id)
}