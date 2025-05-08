import { Tilt_Neon, Tilt_Warp } from "next/font/google";
import { Input } from "@/components/ui/input"
import "./globals.css";
import { Avatar} from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import NavBar from "@/components/program/nav-bar";
import Dropdown from "@/components/program/dropdown";

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
          <nav className="w-full h-25 
          bg-gradient-to-r from-[#001233] to-[#023e7d]
          flex items-center justify-between px-20"
          >
            <div className="flex flex-col text-white font-bold">
              <h1 className={`text-3xl ${tiltWarp.className}`}>CarekoBooks</h1>
              <p className="text-sm">Leia, Registre e Compartilhe</p>
            </div>

            <NavBar />
            
            <div className="flex items-center justify-center gap-4">
                <Input
                  type="search"
                  placeholder="Buscar livros..." 
                  className="text-white placeholder:text-white/70 bg-white/40 rounded-md"
                />

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
        </main>
      </body>
    </html>
  );
}
