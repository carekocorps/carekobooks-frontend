import { useState, useEffect, useCallback } from "react";
import { ProgressService } from "@/services/progress.service";
import { BookProgress, CreateBookProgress, UpdateBookProgress } from "@/types/bookProgress";
import { toast } from "sonner";

type Status = "PLANS_TO_READ" | "READING" | "FINISHED";

interface UseProgressOptions {
  bookId: number;
  username?: string;
}

export function useProgress({ bookId, username }: UseProgressOptions) {
  const [existingProgress, setExistingProgress] = useState<BookProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    status: "PLANS_TO_READ" as Status,
    isFavorite: false,
    score: 0,
    pageCount: 0,
  });

  const fetchProgress = useCallback(async () => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await ProgressService.getProgresses(
        1, 
        1, 
        'createdAt',
        false, 
        { username, bookId, } 
      );
      
      if (response.content.length > 0) {
        const progress = response.content[0];
        setExistingProgress(progress);
        setFormData({
          status: progress.status,
          isFavorite: progress.isFavorite,
          score: progress.score,
          pageCount: progress.pageCount,
        });
      } else {
        setExistingProgress(null);
        resetForm();
      }
    } catch (err) {
      console.error("Erro ao buscar progresso", err);
      toast.error("Não foi possível verificar seu progresso");
    } finally {
      setIsLoading(false);
    }
  }, [bookId, username]);

  const resetForm = () => {
    setFormData({
      status: "PLANS_TO_READ",
      isFavorite: false,
      score: 0,
      pageCount: 0,
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!username) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        username,
        bookId,
      };

      if (existingProgress) {
        await ProgressService.updateProgress(existingProgress.id, {
          ...payload,
          id: existingProgress.id
        } as UpdateBookProgress);
        toast.success("Progresso atualizado com sucesso!");
      } else {
        await ProgressService.createProgress(payload as CreateBookProgress);
        toast.success("Progresso criado com sucesso!");
      }
      
      await fetchProgress();
    } catch (err: any) {
      console.error("Erro ao salvar progresso", err);
      
      if (err.response?.status === 409) {
        toast.error(
          "Não é possível atualizar o progresso pois ele já foi finalizado",
          { description: "Progressos finalizados não podem ser alterados" }
        );
      } else {
        toast.error("Ocorreu um erro ao salvar o progresso");
      }
      throw err; 
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    existingProgress,
    formData,
    isLoading,
    isSubmitting,
    fetchProgress,
    handleInputChange,
    handleSubmit,
    resetForm
  };
}