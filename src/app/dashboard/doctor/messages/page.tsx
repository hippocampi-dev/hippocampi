import Messages from "~/components/message/Messages";
import { getConversationDict } from "~/server/db/queries"
import { getUserId } from "~/utilities/getUser"

export default async function Home() {
  const userId = await getUserId();
  const conversationDict = await getConversationDict(userId as string);
  // console.log(conversationDict)

  return (
    <Messages conversationDict={conversationDict} dashboard={'doctor'} />
  )
}