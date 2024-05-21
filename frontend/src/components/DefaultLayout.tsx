"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "./Header";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('invoice-token') : null;
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
