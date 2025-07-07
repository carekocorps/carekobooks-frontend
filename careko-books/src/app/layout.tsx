'use client';

import { Tilt_Neon, Tilt_Warp } from "next/font/google";
import "./globals.css";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

import { NuqsAdapter } from "nuqs/adapters/next";
import Link from "next/link";
import { Toaster } from "sonner";
import AuthProvider, { useAuth } from "@/components/program/auth/auth-provider";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from "@/components/ui/theme-provider";
import NavBar from "@/components/program/layout/nav-bar";
import SearchBar from "@/components/program/layout/search-bar";
import Dropdown from "@/components/program/layout/dropdown";
import Footer from "@/components/program/layout/footer";

const tiltNeon = Tilt_Neon({
  variable: "--font-tilt-neon",
  subsets: ["latin"],
  weight: ["400"],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      retry: 2,
    },
  },
});

const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tilt-warp",
});

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { user } = useCurrentUser();

  return (
      <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center">
        <NuqsAdapter>
          <nav className="w-full bg-[#001233] dark:bg-[#0c1233] px-4 md:px-8 py-4">
            <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/carekobooks-logo.png"
                    alt="CarekoBooks Logo"
                    width={48}
                    height={48}
                    priority
                />
                <div className="flex flex-col font-bold leading-tight">
                  <h1
                      className={`
                    text-2xl sm:text-3xl 
                    text-white dark:text-white 
                    ${tiltWarp.variable}
                  `}
                  >
                    CarekoBooks
                  </h1>
                  <p className="text-sm sm:text-base text-white dark:text-gray-300">
                    Leia, Registre e Compartilhe
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-4 flex-wrap justify-center w-full sm:w-auto">
                <NavBar isAdmin={user?.roles?.includes("admin") ?? false} />
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
                    <i className="bi bi-chevron-down text-white dark:text-white text-sm sm:text-base" />
                  </div>
                </Dropdown>
              </div>
            </div>
          </nav>

          {children}

          <Footer />

          <Toaster
              richColors
              position="top-right"
              toastOptions={{
                className:
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              }}
          />
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
      <html lang="pt-BR">
      <head>
        <link rel="icon" href="/carekocutes.svg" type="image/svg+xml" />
        <title>CarekoBooks</title>
      </head>
      <body className={`${tiltNeon.variable} antialiased`}>
      <AuthProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <AuthenticatedContent>{children}</AuthenticatedContent>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
      </body>
      </html>
  );
}
