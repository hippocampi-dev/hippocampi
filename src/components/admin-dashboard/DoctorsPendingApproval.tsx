"use client"

import Link from "next/link"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DoctorDict } from "~/server/db/type"

interface props {
  dict: DoctorDict
}

export function DoctorsPendingApproval({ dict }: props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(dict).map((key) => {
            const doctor = dict[key]?.doctor;
            const credentials = dict[key]?.credentials;

            return (
              <TableRow key={doctor?.doctorId}>
                <TableCell className="font-medium">{`${doctor?.firstName} ${doctor?.lastName}`}</TableCell>
                <TableCell>{doctor?.email}</TableCell>
                <TableCell>{credentials?.dateSubmitted?.toDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      doctor?.onboardingStatus === 'pending' ? "outline" : doctor?.onboardingStatus === "approved" ? "success" : "destructive"
                    }
                  >
                    {doctor!.onboardingStatus!.charAt(0).toUpperCase() + doctor?.onboardingStatus!.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/admin/doctors/${doctor?.doctorId}`}>View Details</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          }
          )}
        </TableBody>
      </Table>
    </div>
  )
}