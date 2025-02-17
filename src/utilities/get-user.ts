import { auth } from "~/server/auth"

/**
 * Retrieves the user ID from the current session
 * @returns {string | null} User ID if authenticated, null otherwise
 * @throws Will throw an error if there's an issue accessing the session
 */
export async function getUserId(): Promise<string | null> {
  try {
    // Get the session context
    const session = await auth();
    
    // Return the user ID if exists, null otherwise
    return session?.user?.id ?? null;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error getting user ID:', error);
    throw error;
  }
}