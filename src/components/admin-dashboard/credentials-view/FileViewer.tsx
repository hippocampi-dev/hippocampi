"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function FileViewer({ fileUrl }: { fileUrl: string }) {
  const [fileType, setFileType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkFileType() {
      try {
        const response = await fetch(fileUrl, { method: 'HEAD' })
        const contentType = response.headers.get('content-type')
        setFileType(contentType)
      } catch (error) {
        console.error('Error checking file type:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFileType()
  }, [fileUrl])

  if (loading) {
    return <div>Loading...</div>
  }

  if (fileType?.startsWith('image/')) {
    return (
      <Image
        src={fileUrl || "/placeholder.svg"}
        alt="Certification Document"
        fill
        className="object-cover"
      />
    )
  } else if (fileType === 'application/pdf') {
    return (
      <iframe
        src={fileUrl}
        width="100%"
        height="500px"
        title="PDF Document"
        className="border rounded"
      />
    )
  } else {
    return (
      <div className="p-4 border rounded">
        <p>File type: {fileType}</p>
        <a href={fileUrl} download className="text-blue-600 hover:underline">
          Download file
        </a>
      </div>
    )
  }
}