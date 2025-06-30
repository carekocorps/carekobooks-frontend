"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#001233] dark:bg-[#0c1233] text-white py-8 mt-8">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <h2 className="text-base font-semibold mb-2">Sobre o CarekoBooks</h2>
          <p className="text-gray-300">
            CarekoBooks é uma plataforma para amantes da leitura registrarem suas experiências, explorarem novos livros e compartilharem conhecimento.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-2">Contato</h2>
          <p className="text-gray-300">Email: carekobooks@gmail.com</p>
          <div className="flex gap-4 mt-2">
            <Link href="https://github.com/carekocorps" className="hover:text-gray-300" aria-label="GitHub">
              <i className="bi bi-github text-lg" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} CarekoBooks. Todos os direitos reservados.
      </div>
    </footer>
  );
}
