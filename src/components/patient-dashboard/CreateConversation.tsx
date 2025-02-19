"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { json } from "stream/consumers";

type Doctor = {
  doctorId: string;
  firstName: string;
  lastName: string;
  specialization?: string | null;
};

type CreateConversationProps = {
  patientId: string;
  doctorId?: string; // Optional preselected doctor
};

export default function CreateConversation({ patientId, doctorId: initialDoctorId }: CreateConversationProps) {
  const router = useRouter();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(initialDoctorId);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If no doctor is preselected, fetch the list of doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/db/doctor/all");
        if (!res.ok) {
          throw new Error("Failed to load doctors");
        }
        const data = await res.json();
        const normalized = Array.isArray(data.response) ? data.response : [data.response];
        setDoctors(normalized);


      } catch (err) {
        console.error(err);
        setError("Failed to load doctors");
      }
    }
    fetchDoctors();
  }, [initialDoctorId]);
  console.log(doctors)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure a doctor is selected (either via prop or dropdown)
    const targetDoctorId = selectedDoctorId;
    if (!targetDoctorId) {
      setError("Please select a doctor");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Create or get existing conversation
      const convRes = await fetch("/api/db/messages/conversations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId: targetDoctorId, subject }),
      });
      if (!convRes.ok) throw new Error("Failed to create conversation");
      const conversation = await convRes.json();
      const conversationId = conversation.conversationId;

      // Create the initial message
      const msgRes = await fetch("/api/db/messages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, senderId: patientId, content: messageContent }),
      });
      if (!msgRes.ok) throw new Error("Failed to send message");
      router.push(`/dashboard/messages/${conversationId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Start a Conversation</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!initialDoctorId && (
        <div className="mb-4">
          <label htmlFor="doctorSelect" className="block font-semibold mb-1">
            Select a Doctor
          </label>
          <select
            id="doctorSelect"
            value={selectedDoctorId || ""}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          >
            <option value="" disabled>
              -- Choose a Doctor --
            </option>
            {doctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                Dr. {doc.firstName} {doc.lastName} {doc.specialization ? `- ${doc.specialization}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}
      {initialDoctorId && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Messaging Doctor: {initialDoctorId}
            {/* Optionally, fetch and display the doctor's name */}
          </p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="subject" className="block font-semibold mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter conversation subject"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block font-semibold mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
