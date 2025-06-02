import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { GenreService } from "@/services/genre.service";

export default function CreateGenreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await GenreService.createGenre(formData);
      setIsOpen(false);
      setFormData({
        name: "",
        displayName: "",
        description: "",
      });
    } catch (error) {
      console.error("Erro ao criar gênero:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Criar novo gênero"
          className="w-8 h-8 rounded-md border border-primary bg-primary/10 text-primary p-0 
                     flex items-center justify-center shadow-sm 
                     transform transition-transform duration-200 hover:scale-105 hover:bg-primary/20"
        >
          <i className="bi bi-plus text-lg" aria-hidden="true"></i>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <i className="bi bi-tags"></i>
            <span>Adicionar Novo Gênero</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium">
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
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="displayName" className="flex items-center gap-1 text-sm font-medium">
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
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-card-text text-primary"></i>
                Descrição *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o gênero"
                required
                rows={4}
                className="border-gray-300 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Mínimo de 50 caracteres</p>
            </div>
          </div>

          <Separator className="my-2" />

          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-100 min-w-24"
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
                  <span>Salvar Gênero</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
