// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("Your message has been sent!");
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="py-16 px-4 md:px-20 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <Button type="submit" variant="default">
          Send Message
        </Button>
        {status && <p className="mt-2 text-center text-gray-700">{status}</p>}
      </form>
      <div className="mt-12 text-center text-gray-600">
        <p>Contact Email: info@hippocampi.com</p>
        <p>Phone: (555) 123-4567</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="https://www.linkedin.com/company/hippocampi" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://twitter.com/hippocampi" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
