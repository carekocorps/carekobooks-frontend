'use client';

import { Tilt_Neon, Tilt_Warp } from "next/font/google";
import "./globals.css";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import NavBar from "@/components/program/nav-bar";
import Dropdown from "@/components/program/dropdown";
import SearchBar from "@/components/program/search-bar";
import { NuqsAdapter } from "nuqs/adapters/next";
import Link from "next/link";
import { Toaster } from "sonner";
import AuthProvider, { useAuth } from "@/components/program/auth/auth-provider"; 
import { useCurrentUser } from "@/hooks/useCurrentUser";

const tiltNeon = Tilt_Neon({
  variable: "--font-tilt-neon",
  subsets: ["latin"],
  weight: ["400"], 
});

const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: ["400"],
});

function AuthenticatedContent({ children }: { children: React.ReactNode }) { 
  const { logout } = useAuth();
  const { user, loading, error } = useCurrentUser();

  return (
    <main className="bg-white min-h-screen flex flex-col items-center">
      <NuqsAdapter>
        <nav className="w-full bg-[#001233] px-4 md:px-8 py-4">
          <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            <Link href="/" passHref>
              <div className="flex flex-col text-white font-bold leading-tight">
                <h1 className={`text-2xl sm:text-3xl ${tiltWarp.className}`}>CarekoBooks</h1>
                <p className="text-sm sm:text-base">Leia, Registre e Compartilhe</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 flex-wrap justify-center w-full sm:w-auto">
              <NavBar />
              <SearchBar />

              <Dropdown onLogout={logout}>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage
                      src={user?.image?.url ?? "/default-avatar.png"}
                      alt="Imagem de avatar"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                  <i className="bi bi-chevron-down text-white text-sm sm:text-base"></i>
                </div>
              </Dropdown>
            </div>
          </div>
        </nav>

        {children}
        <Toaster richColors />
      </NuqsAdapter>
    </main>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tiltNeon.variable} antialiased`}>
        <AuthProvider>
          <AuthenticatedContent>{children}</AuthenticatedContent> 
        </AuthProvider>
      </body>
    </html>
  );
}

