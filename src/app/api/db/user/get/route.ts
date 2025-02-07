import { auth } from "~/server/auth"

export const GET = async () => {
  // Get the session context
  const session = await auth()
  
  // Access user ID from session
  const userId = session?.user?.id
  
  return {
    body: { userId }
  }
}