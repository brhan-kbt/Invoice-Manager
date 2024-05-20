import DefaultLayout from "@/components/DefaultLayout";
import Header from "@/components/Header";
import Dashboard from "./dashboard/Dashboard";

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
