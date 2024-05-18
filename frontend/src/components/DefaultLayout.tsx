"use client";
import React, { useState, ReactNode, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "./Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const router = useRouter();

  if (! (typeof window !== "undefined" ? localStorage.getItem('token') : null)) {
    router.push("/login");
  }
  return (
    <>
      <div className="flex  h-screen overflow-hidden bg-white text-black">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
