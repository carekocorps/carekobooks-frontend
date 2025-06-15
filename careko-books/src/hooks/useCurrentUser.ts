"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/user.services";
import { getDecodedToken } from "@/services/auth.service";
import { UserType } from "@/types/user";

interface TokenPayload {
  preferred_username: string;
  sub?: string;
  email?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenData = getDecodedToken<TokenPayload>();
        const username = tokenData?.preferred_username || tokenData?.sub;

        if (!username) {
          throw new Error("Usuário não autenticado ou token inválido.");
        }

        const userData = await UserService.getUserByUsername(username);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, error };
}
