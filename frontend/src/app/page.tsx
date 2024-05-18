import DefaultLayout from "@/components/DefaultLayout";
import { Metadata } from "next";
import Dashboard from "./dashboard/Dashboard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Header/>
        <Dashboard/>
      </DefaultLayout>
    </>
  );
}
