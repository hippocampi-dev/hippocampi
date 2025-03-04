import { cn } from "~/lib/utils"

import { Star } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"


function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-50/10", className)}
      {...props}
    />
  )
}

export function DoctorCardSkeleton() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      <CardContent className="p-6">
        {/* External link placeholder */}
        <div className="absolute top-2 right-2 p-2">
          <div className="h-5 w-5 rounded bg-gray-100"></div>
        </div>

        <div className="flex items-start gap-4">
          {/* Doctor image placeholder */}
          <div className="h-20 w-20 rounded-full bg-gray-100"></div>
          <div>
            {/* Doctor name placeholder */}
            <div className="h-6 w-40 rounded bg-gray-100 mb-2"></div>
            {/* Specialization placeholder */}
            <div className="h-4 w-32 rounded bg-gray-100 mb-2"></div>
            {/* Rating placeholder */}
            <div className="flex items-center">
              <Star className="h-4 w-4 text-gray-100" />
              <div className="ml-1 h-4 w-8 rounded bg-gray-100"></div>
            </div>
          </div>
        </div>

        {/* Location placeholder */}
        <div className="mt-4 flex items-center">
          <div className="h-4 w-4 rounded bg-gray-100 mr-2"></div>
          <div className="h-4 w-24 rounded bg-gray-100"></div>
        </div>

        {/* Bio placeholder */}
        <div className="mt-4 pt-4 border-t">
          <div className="h-4 w-full rounded bg-gray-100 mb-2"></div>
          <div className="h-4 w-3/4 rounded bg-gray-100"></div>
        </div>

        {/* Choose Doctor button placeholder */}
        <div className="mt-6 h-10 w-full rounded bg-gray-100"></div>
      </CardContent>
    </Card>
  )
}

export function DoctorsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="text-gray-600 mb-6">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DoctorCardSkeleton />
        <DoctorCardSkeleton />
        <DoctorCardSkeleton />
        <DoctorCardSkeleton />
        <DoctorCardSkeleton />
        <DoctorCardSkeleton />
      </div>
    </div>
  )
}



export { Skeleton }
