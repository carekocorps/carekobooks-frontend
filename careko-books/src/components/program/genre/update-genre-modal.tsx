import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { GenreService } from "@/services/genre.service";

interface UpdateGenreModalProps {
  name: string;
}

export default function UpdateGenreModal({ name }: UpdateGenreModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && name) {
      setLoadingData(true);
      GenreService.getGenreByName(name)
        .then((response) => {
          if (response.data) {
            setFormData({
              name: response.data.name || "",
              displayName: response.data.displayName || "",
              description: response.data.description || "",
            });
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar gênero:", error);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [isOpen, name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await GenreService.updateGenre(name, formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao Atualizar gênero:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Atualizar gênero"
          className="w-8 h-8 rounded-md border border-primary bg-primary/10 text-primary p-0 
                     flex items-center justify-center shadow-sm 
                     transform transition-transform duration-200 hover:scale-105 hover:bg-primary/20"
        >
          <i className="bi bi-pencil text-base"></i>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-lg bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader className="border-b pb-4 border-gray-200 dark:border-zinc-700">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <i className="bi bi-tags"></i>
            <span>Editar Gênero</span>
          </DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground dark:text-zinc-400">Carregando dados do gênero...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <i className="bi bi-tag text-primary"></i>
                  Nome Interno *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: fiction"
                  required
                  className="border-gray-300 focus:border-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="displayName"
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <i className="bi bi-type text-primary"></i>
                  Nome Exibido *
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Ex: Ficção"
                  required
                  className="border-gray-300 focus:border-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <i className="bi bi-card-text text-primary"></i>
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o gênero (opcional)"
                  rows={4}
                  className="border-gray-300 focus:border-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <p className="text-xs text-muted-foreground dark:text-zinc-400">
                  Máximo de 500 caracteres
                </p>
              </div>
            </div>

            <Separator className="my-2 dark:bg-zinc-700" />

            <DialogFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-100 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:text-white min-w-24"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 min-w-24 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    <span>Salvar</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
