"use client"

import { useSession } from "next-auth/react"

export default function Page() {
    const {data} = useSession()
    const userID = data
    return (
        <div className = "bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
        </div>
    )
}
