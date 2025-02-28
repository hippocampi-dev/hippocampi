'use client'

import { useState } from "react"
import { Input } from "../ui/input";

export default function PatientSearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Input
      type="search"
      placeholder="Search patients..."
      className="max-w-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}