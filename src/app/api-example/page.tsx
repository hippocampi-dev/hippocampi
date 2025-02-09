// dif view for user if patient or doctor --> create components for each

// ignore /account and /checkout, both are for payment

"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState({ loading: true, content: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/management/credentials/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData({
          loading: false,
          content: result,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          loading: false,
          content: null,
        });
      }
    };

    fetchData();
  }, []);

  if (data.loading) return <div>Loading...</div>;
  return <main>{JSON.stringify(data.content, null, 2)}</main>;
}
