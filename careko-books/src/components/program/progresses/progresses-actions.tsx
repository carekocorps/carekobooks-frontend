"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ProgressService } from "@/services/progress.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { BookProgress, CreateBookProgress, UpdateBookProgress } from "@/types/bookProgress";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  bookId: number;
}

export function ProgressActions({ bookId }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [existingProgress, setExistingProgress] = useState<BookProgress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateBookProgress | UpdateBookProgress>({
    status: "PLANS_TO_READ",
    isFavorite: false,
    score: 0,
    pageCount: 0,
    username: user?.username || "",
    bookId: bookId,
  });

  // Busca o progresso existente
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.username) return;
      
      try {
        setIsLoading(true);
        const progresses = await ProgressService.searchProgresses({
          username: user.username,
          bookId,
          pageSize: 1,
        });
        
        if (progresses.length > 0) {
          setExistingProgress(progresses[0]);
          setFormData({
            ...progresses[0],
            id: progresses[0].id,
            username: user.username,
            bookId: bookId,
          });
        } else {
          setExistingProgress(null);
          setFormData({
            status: "PLANS_TO_READ",
            isFavorite: false,
            score: 0,
            pageCount: 0,
            username: user.username,
            bookId: bookId,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar progresso", err);
        toast.error("Não foi possível verificar seu progresso");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.username) {
      fetchProgress();
    }
  }, [user, bookId]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        bookId: bookId,
      };

      if (existingProgress) {
        await ProgressService.updateProgress(
          existingProgress.id, 
          submissionData as UpdateBookProgress
        );
        toast.success("Progresso atualizado com sucesso!");
      } else {
        await ProgressService.createProgress(
          submissionData as CreateBookProgress
        );
        toast.success("Progresso criado com sucesso!");
      }
      
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar progresso", err);
      toast.error("Ocorreu um erro ao salvar o progresso");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) return null;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full py-5 text-base rounded-xl">
            {existingProgress ? (
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Atualizar Progresso
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Progresso
              </div>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent 
          className="sm:max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {existingProgress ? "Atualizar Progresso" : "Criar Progresso"}
            </DialogTitle>
            <DialogDescription>
              Informe seu progresso de leitura, incluindo status, nota e páginas lidas.
            </DialogDescription>
        </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v)}
                  onOpenChange={(open) => {
                    if (!open) {
                      setTimeout(() => {
                        const firstInput = document.querySelector('input');
                        firstInput?.focus();
                      }, 50);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANS_TO_READ">Planejo Ler</SelectItem>
                    <SelectItem value="READING">Lendo</SelectItem>
                    <SelectItem value="FINISHED">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="favorite"
                  checked={formData.isFavorite}
                  onCheckedChange={(v) => handleInputChange("isFavorite", v)}
                />
                <Label htmlFor="favorite">Favorito</Label>
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
                  onFocus={(e) => e.target.select()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageCount">Páginas Lidas</Label>
                <Input
                  id="pageCount"
                  type="number"
                  min="0"
                  value={formData.pageCount}
                  onChange={(e) => handleInputChange("pageCount", parseInt(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar Progresso"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}