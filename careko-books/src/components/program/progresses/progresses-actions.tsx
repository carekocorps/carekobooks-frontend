"use client";

import { Button } from "@/components/ui/button";
import { Check, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressService } from "@/services/progress.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface Props {
  bookId: number;
}

export function ProgressActions({ bookId }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState("");

  if (!user) return null;

  const handleClick = async (
    type: "READING" | "FINISHED" | "FAVORITE"
  ) => {
    try {
      setLoading(type);
      await ProgressService.createProgress({
        status:
          type === "FAVORITE"
            ? "PLANS_TO_READ"
            : type,
        isFavorite: type === "FAVORITE",
        score: type === "FINISHED" ? 100 : 0,
        pageCount: 0,
        username: user.username,
        bookId,
      });

      
      const messages = {
        READING: "Livro marcado como 'Quero Ler'",
        FINISHED: "Livro marcado como 'Já Li'",
        FAVORITE: "Livro adicionado aos favoritos",
      };
      toast.success(messages[type]);

      router.refresh();
    } catch (err) {
      console.error("Erro ao criar progresso", err);
      toast.error("Ocorreu um erro ao salvar o progresso.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <Button
        onClick={() => handleClick("READING")}
        disabled={loading === "READING"}
        className="bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-xl transition-all duration-200 hover:scale-[1.02]"
      >
        {loading === "READING" ? "Salvando..." : "Quero Ler"}
      </Button>

      <Button
        onClick={() => handleClick("FINISHED")}
        disabled={loading === "FINISHED"}
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-5 text-base flex gap-2 items-center justify-center rounded-xl transition-all duration-200 hover:scale-[1.02]"
      >
        <Check className="w-5 h-5" />
        {loading === "FINISHED" ? "Salvando..." : "Já Li"}
      </Button>

      <Button
        onClick={() => handleClick("FAVORITE")}
        disabled={loading === "FAVORITE"}
        variant="destructive"
        className="py-5 text-base flex gap-2 items-center justify-center rounded-xl transition-all duration-200 hover:scale-[1.02]"
      >
        <Heart className="w-5 h-5" />
        {loading === "FAVORITE" ? "Salvando..." : "Favoritar"}
      </Button>
    </div>
  );
}
