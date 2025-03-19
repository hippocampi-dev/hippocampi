"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Save } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { updatePatientInfo } from "~/lib/actions/patient"
import { patientSchema, type PatientSchemaType } from "~/lib/schemas/patients"

type ImportInterface = {
  userId: "string"
  patient: PatientSchemaType
}

export function ChangeInformationForm({ userId, patient }: ImportInterface) {
  const [isEditing, setIsEditing] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientSchemaType>({
    defaultValues: patient,
    resolver: zodResolver(patientSchema),
  })
  const router = useRouter()
   
  const onSubmit = async (data: PatientSchemaType) => {
    try {
      await updatePatientInfo(userId, data)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to update patient info:", error)
    }
  }

  const toggleEdit = () => {
    if (isEditing) {
      reset(patient)
    }
    setIsEditing(!isEditing)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Personal Information
            <Button variant="ghost" size="icon" onClick={toggleEdit} type="button">
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label="First Name"
              isDisabled={false}
              value={patient.firstName}
              isEditing={isEditing}
              register={register("firstName")}
              error={errors.firstName?.message}
            />
            <InfoField
              label="Last Name"
              isDisabled={false}
              value={patient.lastName}
              isEditing={isEditing}
              register={register("lastName")}
              error={errors.lastName?.message}
            />
            <InfoField
              label="Email"
              isDisabled={false}
              value={patient.email}
              isEditing={isEditing}
              register={register("email")}
              error={errors.email?.message}
            />
            <InfoField
              label="Phone Number"
              isDisabled={false}
              value={patient.phoneNumber}
              isEditing={isEditing}
              register={register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
            <InfoField
              label="Date of Birth"
              value={patient.dateOfBirth}
              isDisabled={true}
              isEditing={isEditing}
              register={register("dateOfBirth")}
              type="date"
              error={errors.dateOfBirth?.message}
            />
            <InfoField
              label="Street Address"
              isDisabled={false}
              value={patient.streetAddress}
              isEditing={isEditing}
              register={register("streetAddress")}
              error={errors.streetAddress?.message}
            />
            <InfoField
              label="City"
              isDisabled={false}
              value={patient.city}
              isEditing={isEditing}
              register={register("city")}
              error={errors.city?.message}
            />
            <InfoField
              label="State"
              isDisabled={false}
              value={patient.state}
              isEditing={isEditing}
              register={register("state")}
              error={errors.state?.message}
            />
            <InfoField
              label="Zip Code"
              isDisabled={false}
              value={patient.zipCode}
              isEditing={isEditing}
              register={register("zipCode")}
              error={errors.zipCode?.message}
            />
          </div>
        </CardContent>
        <CardFooter>
          {isEditing && (
            <Button type="submit" className="ml-auto">
              Save Changes
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

interface InfoFieldProps {
  label: string
  value: string | Date
  isEditing: boolean
  isDisabled: boolean
  register: any
  error?: string
  type?: string
}

function InfoField({ label, value, isEditing, isDisabled, register, error, type = "text" }: InfoFieldProps) {
  const displayValue = value instanceof Date ? value.toLocaleDateString() : value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <>
          <Input disabled={isDisabled} type={type} {...register} className="w-full" />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </>
      ) : (
        <p className="text-gray-900">{displayValue}</p>
      )}
    </div>
  )
}

