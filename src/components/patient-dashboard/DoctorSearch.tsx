"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function DoctorSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Retrieve initial values from URL
  const initialTerm = searchParams.get("term") || "";
  const initialSpecialization = searchParams.get("specialization") || "";

  const updateSearchParams = useDebouncedCallback((term: string, specialization: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("term", term);
    } else {
      params.delete("term");
    }
    console.log("Speicalization = " + specialization)
    if (specialization == "All") {
      params.delete("specialization");
    } else if (specialization) {
      params.set("specialization", specialization);
    } else {
      params.delete("specialization")
    }
    replace(`${pathname}?${params.toString()}`);
  },300);

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    updateSearchParams(newTerm, initialSpecialization);
  }

  const handleSpecializationChange = (value: string) => {
    updateSearchParams(initialTerm, value);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by name, specialty, or location"
            className="pl-10"
            onChange={handleTermChange}
          />
        </div>
        <div className="flex gap-4">
          <Select value={initialSpecialization} onValueChange={handleSpecializationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Specialties</SelectItem>
              <SelectItem value="Cardiologist">Cardiologist</SelectItem>
              <SelectItem value="Neurologist">Neurologist</SelectItem>
              <SelectItem value="Pediatrician">Pediatrician</SelectItem>
              <SelectItem value="Dermatologist">Dermatologist</SelectItem>
              <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
              <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your doctor search</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Specialty</h3>
                  <Select value={initialSpecialization} onValueChange={handleSpecializationChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="Neurologist">Neurologist</SelectItem>
                      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                      <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                      <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
