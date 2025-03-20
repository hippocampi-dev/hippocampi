import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z, ZodError, ZodType } from "zod"

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateStringToDate(dateString: string): Date {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return parsedDate;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()

  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US',
    {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // If this week, show day name
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  }

  // Otherwise show date
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

/**
 * Format a time string (HH:MM) with AM/PM
 */
export function formatTimeWithAMPM(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if ((hours) == null || minutes == null) {
    return time;
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export const availabilitySchema = z
  .object({
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], {
      required_error: "Please select a day of the week",
    }),
    "start-time": z.string({
      required_error: "Please select a start time",
    }),
    "end-time": z.string({
      required_error: "Please select an end time",
    }),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data["start-time"].split(":").map(Number)
      const [endHour, endMinute] = data["end-time"].split(":").map(Number)

      if (startHour === undefined || startMinute === undefined || endHour === undefined || endMinute === undefined) {
        return false
      }

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      return endMinutes > startMinutes
    },
    {
      message: "End time must be after start time",
      path: ["end-time"],
    },
  )

export type AvailabilityFormData = z.infer<typeof availabilitySchema>
