"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/user.services";
import { getDecodedToken } from "@/services/auth.service";
import { ExtendedUserType, UserType } from "@/types/user";

interface TokenPayload {
  preferred_username: string;
  realm_access?: {
    roles: string[];
  };
}

export function useCurrentUser() {
  const [user, setUser] = useState<ExtendedUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenData = getDecodedToken<TokenPayload>();
        const username = tokenData?.preferred_username;
        const roles = tokenData?.realm_access?.roles; 

        if (!username) {
          throw new Error("Usuário não autenticado ou token inválido.");
        }

        const userData = await UserService.getUserByUsername(username);
        setUser({ ...userData, roles });
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
