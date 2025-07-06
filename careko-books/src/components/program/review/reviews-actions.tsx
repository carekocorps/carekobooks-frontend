"use client";

import { Button } from "@/components/ui/button";
import { Star, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ReviewService } from "@/services/bookReview.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import {
  BookReview,
  CreateBookReview,
  UpdateBookReview,
} from "@/types/bookReview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  bookId: number;
  onUpdate?: (review: BookReview | null) => void; 
}

export function ReviewActions({ bookId, onUpdate }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [existingReview, setExistingReview] = useState<BookReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateBookReview | UpdateBookReview>({
    title: "",
    content: "",
    score: 0,
    username: user?.username || "",
    bookId,
  });

  useEffect(() => {
    const fetchReview = async () => {
      if (!user?.username) return;

      try {
        setIsLoading(true);
        const reviews = await ReviewService.searchReviews({
          username: user.username,
          bookId,
          pageSize: 1,
        });

        if (reviews.length > 0) {
          setExistingReview(reviews[0]);
          setFormData({
            ...reviews[0],
            id: reviews[0].id,
            username: user.username,
            bookId,
          });
        } else {
          setExistingReview(null);
          setFormData({
            title: "",
            content: "",
            score: 0,
            username: user.username,
            bookId,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar revisão", err);
        toast.error("Não foi possível verificar sua revisão");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.username) {
      fetchReview();
    }
  }, [user, bookId]);

  const handleInputChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.username) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setIsSubmitting(true);

      const submissionData = {
        ...formData,
        username: user.username,
        bookId,
      };

      let result: BookReview;

      if (existingReview) {
        result = await ReviewService.updateReview(existingReview.id, submissionData as UpdateBookReview);
        toast.success("Revisão atualizada com sucesso!");
      } else {
        result = await ReviewService.createReview(submissionData as CreateBookReview);
        toast.success("Revisão criada com sucesso!");
      }

      setExistingReview(result);
      onUpdate?.(result);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar revisão", err);
      toast.error("Ocorreu um erro ao salvar a revisão");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview?.id) return;

    try {
      setIsSubmitting(true);
      await ReviewService.deleteReview(existingReview.id);
      toast.success("Revisão excluída com sucesso!");
      setExistingReview(null);
      onUpdate?.(null); 
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao excluir revisão", err);
      toast.error("Ocorreu um erro ao excluir a revisão");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) return null;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`
              w-full py-5 text-base rounded-xl border-2
              border-blue-600 text-blue-700 hover:bg-blue-50
              dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/40
              transition-all
            `}
          >
            <div className="flex items-center gap-2">
              {existingReview ? <Pencil className="w-4 h-4" /> : <Star className="w-4 h-4" />}
              {existingReview ? "Editar Resenha" : "Escrever Resenha"}
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-2xl bg-white dark:bg-gray-900 dark:text-gray-100"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {existingReview ? "Editar Revisão" : "Criar Revisão"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Preencha os campos abaixo para {existingReview ? "editar sua avaliação" : "criar uma nova avaliação"} sobre o livro.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={8}
                  required
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Nota (0-100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => handleInputChange("score", parseInt(e.target.value) || 0)}
                  required
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              {existingReview && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Excluir Revisão
                </Button>
              )}

              <div className="flex justify-end gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Revisão"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
