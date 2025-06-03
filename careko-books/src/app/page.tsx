import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeContent from "./home/page";


export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    redirect("/login");
  }

  return <HomeContent />;
}