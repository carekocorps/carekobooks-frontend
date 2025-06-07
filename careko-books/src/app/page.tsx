import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeContent from "./home/page";


export default async function Home() {
  return <HomeContent />;
}