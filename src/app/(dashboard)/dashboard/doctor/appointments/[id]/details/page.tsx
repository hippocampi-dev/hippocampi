"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit, FiDownload } from 'react-icons/fi';

interface ConsultationData {
  id: string;
  patientName: string;
  appointmentDate: string;
  consultationPdf: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching consultation data
    const fetchConsultation = async () => {
      try {
        // In a real app: const data = await fetchConsultationData(params.id);
        // Simulate API call with mock data
        const mockData: ConsultationData = {
          id: params.id,
          patientName: "John Doe",
          appointmentDate: "2023-08-15",
          consultationPdf: "/mock-consultation.pdf", // This would be a URL to the PDF in a real app
          createdAt: "2023-08-10T10:00:00Z",
          updatedAt: "2023-08-10T10:30:00Z",
        };
        
        setTimeout(() => {
          setConsultation(mockData);
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (error) {
        console.error("Error fetching consultation:", error);
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [params.id]);

  const handleEditClick = () => {
    router.push(`/dashboard/doctor/appointments/${params.id}/details/edit`);
  };

  const handleDownloadPdf = () => {
    // In a real app, this would download the actual PDF
    alert("PDF download functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="p-6 max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">No consultation found</h2>
          <p className="text-gray-500 mt-2">This appointment does not have any consultation notes yet.</p>
          <button
            onClick={handleEditClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Consultation Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FiDownload className="mr-2" /> Download PDF
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiEdit className="mr-2" /> Edit Consultation
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                <p className="text-lg font-medium">{consultation.patientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Appointment Date</h3>
                <p className="text-lg font-medium">
                  {new Date(consultation.appointmentDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="text-lg font-medium">
                  {new Date(consultation.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {consultation.consultationPdf ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-[800px] w-full">
                {/* In a real app, you'd use a PDF viewer component here */}
                <div className="flex justify-center items-center h-full bg-gray-100">
                  <div className="text-center p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Consultation PDF</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      PDF viewer would be displayed here. Click the download button to view the PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700">No PDF Available</h2>
              <p className="text-gray-500 mt-2">
                The consultation has been started but no PDF has been generated yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
