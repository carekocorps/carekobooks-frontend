"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProgress } from "@/hooks/useProgresses";

interface Props {
  bookId: number;
}

export function ProgressActions({ bookId }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const username = user?.username;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    existingProgress,
    formData,
    isLoading: isProgressLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit: submitProgress,
    resetForm,
  } = useProgress({ bookId, username });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitProgress();
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {}
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!existingProgress) resetForm();
  };

  const handleScoreChange = (value: string) => {
    if (value === "") return null;
    const num = parseInt(value);
    return isNaN(num) ? null : Math.min(100, Math.max(0, num));
  };

  if (!user || isProgressLoading) return null;

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full py-5 text-base rounded-xl border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
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
          onEscapeKeyDown={handleCloseModal}
          onInteractOutside={handleCloseModal}
        >
          <DialogHeader>
            <DialogTitle>
              {existingProgress ? "Atualizar Progresso" : "Criar Progresso"}
            </DialogTitle>
            <DialogDescription>
              Informe seu progresso de leitura, incluindo status, nota e páginas lidas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v)}
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
                  max={100}
                  value={formData.score ?? ""}
                  onChange={(e) => {
                    handleInputChange("score", handleScoreChange(e.target.value));
                  }}
                  placeholder="0-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageCount">Páginas Lidas</Label>
                <Input
                  id="pageCount"
                  min="0"
                  value={formData.pageCount}
                  onChange={(e) => handleInputChange("pageCount", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Progresso"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}