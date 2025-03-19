"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useToast } from "~/app/contexts/ToastContext"

export default function OnboardingStart() {
  const router = useRouter()
  const { toast } = useToast()
  const [inviteCode, setInviteCode] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!inviteCode.trim()) {
      toast({
        title: "Invite Code Required",
        description: "Please enter your invitation code to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (inviteCode !== '000000') {
      toast({
        title: "Incorrect Invite Code",
        description: "Please enter the correct invitation code to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call to validate invite code
    setTimeout(() => {
      setLoading(false)
      router.push("/onboarding/profile-information")
    }, 200)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to the Onboarding Process</CardTitle>
          <CardDescription>Please enter your invitation code and agree to the terms to begin.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invitation Code</Label>
              <Input
                id="invite-code"
                placeholder="Enter your invitation code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">This code was sent to your email address.</p>
            </div>

            <div className="space-y-4 rounded-md border p-4">
              <div className="text-sm font-medium">Verbal Agreement</div>
              <div className="text-sm text-muted-foreground">
                <p>By checking the box below, you acknowledge that:</p>
                <ul className="list-disc pl-5 pt-2 space-y-1">
                  <li>You have been contacted by our team and verbally agreed to join our network</li>
                  <li>You understand the onboarding timeline of approximately 2-4 weeks</li>
                  <li>You will provide all required documentation in a timely manner</li>
                  <li>All information provided will be accurate and complete</li>
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreement"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <Label htmlFor="agreement" className="text-sm font-medium">
                  I agree to the terms and conditions
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Validating..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}