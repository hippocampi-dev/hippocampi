"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import PersonalInfoForm from "./PersonalInfoForm"
import MedicalInfoForm from "./MedicalInfoForm"


export default function PatientForm() {
  const [step, setStep] = useState(1);

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Patient Registration</CardTitle>
        <div className="flex justify-center space-x-2 mt-4">
          <div className={`h-2 w-16 rounded-full ${step === 1 ? "bg-black" : "bg-gray-200"}`} />
          <div className={`h-2 w-16 rounded-full ${step === 2 ? "bg-black" : "bg-gray-200"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <PersonalInfoForm />}
            {step === 2 && <MedicalInfoForm />}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant="outline">
              Previous
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button className="ml-auto">Submit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

