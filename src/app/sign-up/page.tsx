"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { ArrowLeft } from "lucide-react"

export default function SignIn() {
  const handleSignIn = () => {
    signIn("google", {
      callbackUrl: `${window.location.origin}/dashboard`,
    })
  }
  console.log()
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <div className="p-4">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to main page
          </Link>
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" onClick={handleSignIn} className="w-full">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="text-center">By signing in, you agree to our Terms of Service and Privacy Policy.</div>
          <div className="text-center">
            Don't have an account?{" "}
            <a href="/signup" className="underline text-primary">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

