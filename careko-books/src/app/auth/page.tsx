"use client"

import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await AuthService.signIn("admin", "admin");

      console.log("Login bem-sucedido. Cookie de sessão armazenado pelo navegador.");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogin}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    >
      {loading ? "Logando..." : "Login como Admin"}
    </Button>
  );
}