import { Tilt_Neon, Tilt_Warp } from "next/font/google";
import "./globals.css";
import { Avatar} from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import NavBar from "@/components/program/nav-bar";
import Dropdown from "@/components/program/dropdown";
import SearchBar from "@/components/program/search-bar";
import {NuqsAdapter} from "nuqs/adapters/next"
import Link from "next/link";

const tiltNeon = Tilt_Neon({
  variable: "--font-tilt-neon",
  subsets: ["latin"],
  weight: ["400"], 
});

const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tiltNeon.variable} antialiased`}>
        <main className="bg-[#F5F3FE] min-h-screen flex flex-col items-center">
        <NuqsAdapter>
          <nav className="w-full h-25 
          bg-gradient-to-r from-[#001233] to-[#023e7d]
          flex items-center justify-between px-20"
          >
            <Link href="/" passHref>
            <div className="flex flex-col text-white font-bold">
              <h1 className={`text-3xl ${tiltWarp.className}`}>CarekoBooks</h1>
              <p className="text-sm">Leia, Registre e Compartilhe</p>
            </div>
            </Link>
            <NavBar />
            
            <div className="flex items-center justify-center gap-4">
              <SearchBar/>

              <Dropdown >
                <div className="flex items-center justify-center gap-3 cursor-pointer">

                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src="/image.png"
                    alt="Imagem de avatar"
                    className="object-cover w-full h-full"
                  />
                </Avatar>

                <i className="bi bi-chevron-down text-white"></i>
                </div>
              </Dropdown>
            </div>

          </nav>
          {children}
        </NuqsAdapter>
        </main>
      </body>
    </html>
  );
}
