
"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Middle() {
  const [data, setData] = useState({ loading: true, content: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/management/user-role/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
  if (data.content) redirect("/dashboard")
    if (!data.content) redirect("select-role");
}
