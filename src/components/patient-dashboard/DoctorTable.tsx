import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { fetchFilteredDoctors } from "~/server/db/queries";
import { DoctorsInterface } from "~/server/db/type";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import ChooseDoctorButton from "./ChooseDoctorButton";



export default async function DoctorsTable({
  specialization,
  term,
  currentPage,
}: {
  term: string;
  specialization: string;
  currentPage: number;
}) {
  const session = await auth();
  // Fetch filtered doctors
  const filteredDoctors: DoctorsInterface[] = await fetchFilteredDoctors(specialization, term, currentPage);


  return (
    <div className="mt-6 flow-root">
      <p className="text-gray-600 mb-6">
        {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
      </p>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No doctors found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.doctorId} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <CardContent className="p-6">
                {/* External link to doctor's full profile */}
                <a
                  href={`${doctor.profileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-primary transition-colors"
                  aria-label={`View ${doctor.firstName} ${doctor.lastName}'s full profile`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>

                <div className="flex items-start gap-4">
                  {/* <Image
                    src={doctor.profileUrl || "/placeholder.svg"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  /> */}
                  <div>
                    <h3 className="font-bold text-lg">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {doctor.specialization || "General Practitioner"}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium">
                        {doctor.ratings || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    {doctor.location}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Bio: {doctor.bio}</p>
                </div>

                <ChooseDoctorButton iDoctorId = {doctor.doctorId} patientId = {session?.user.id || ''}/>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
