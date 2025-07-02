"use client";

import { useState, useEffect } from "react";

import { ProgressService } from "@/services/progress.service";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { HeartFilled } from "@/components/ui/heart-filled";
import { Heart } from "@/components/ui/heart";
import { useProgress } from "@/hooks/useProgresses";

interface FavoriteProgressButtonProps {
  bookId: number;
  initialIsFavorite: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function FavoriteProgressButton({
  bookId,
  initialIsFavorite,
  onFavoriteChange
}: FavoriteProgressButtonProps) {
  const { user } = useCurrentUser();
  let username = user?.username;
  const {
      existingProgress,
      formData,
      isLoading: isProgressLoading,
      handleInputChange,
      handleSubmit:
      resetForm,
    } = useProgress({ bookId, username });
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let progressId = existingProgress?.id ?? 0;

  useEffect(() => {
    setIsFavorite(existingProgress?.isFavorite ?? false);
  }, [existingProgress?.isFavorite ?? false]);

  const handleFavoriteToggle = async () => {
    if (!user || isSubmitting) return;
    
    setIsSubmitting(true);
    const previousState = isFavorite;
    
    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      if (onFavoriteChange) onFavoriteChange(newFavoriteState);
      
      if (newFavoriteState) {
        await ProgressService.favorite(progressId);
        toast.success("Progresso favoritado");
      } else {
        await ProgressService.unfavorite(progressId);
        toast.success("Favorito removido");
      }
    } catch (error) {
      setIsFavorite(previousState);
      if (onFavoriteChange) onFavoriteChange(previousState);
      
      toast.error("Erro ao atualizar favorito");
      console.error("Favorite error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={isSubmitting}
      className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {isFavorite ? (
        <HeartFilled className="w-5 h-5 text-red-500 fill-current" />
      ) : (
        <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      )}
    </button>
  );
}