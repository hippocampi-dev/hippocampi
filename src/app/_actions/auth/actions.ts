// 'use server'

// // In a Server Action or API Route
// import { auth } from "~/server/auth"; // Your NextAuth setup file
// import { update }

// export async function updateUserRole() {
//   const session = await auth();
  
//   if (session) {
//     // Update the session/JWT
//     await auth().update({
//       ...session,
//       user: {
//         ...session.user,
//         sessionVerified: true
//       }
//     });
    
//     return { success: true };
//   }
  
//   return { success: false };
// }u