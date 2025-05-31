import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { BookService } from "@/services/books.service";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { CalendarIcon } from "lucide-react";

export default function UpdateBookModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    authorName: "",
    publisherName: "",
    publishedAt: "",
    pageCount: 0,
    genres: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "pageCount" ? Number(value) : value
    }));
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      genres: e.target.value.split(",").map(g => g.trim())
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await BookService.createBook(formData);
      setIsOpen(false);
      setFormData({
        title: "",
        synopsis: "",
        authorName: "",
        publisherName: "",
        publishedAt: "",
        pageCount: 0,
        genres: [],
      });
    } catch (error) {
      console.error("Erro ao criar livro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Atualizar Livro"
          className="w-8 h-8 rounded-md border border-primary bg-primary/10 text-primary p-0 
                     flex items-center justify-center shadow-sm 
                     transform transition-transform duration-200 hover:scale-105 hover:bg-primary/20"
        >
          <i className="bi bi-pencil text-base"></i>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <i className="bi bi-book-plus"></i>
            <span>Atualizar Um Livro</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Seção Informações Básicas */}
          <div className="space-y-4 md:col-span-1">
            <div className="space-y-1">
              <Label htmlFor="title" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-bookmark text-primary"></i>
                Título do Livro *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Digite o título completo"
                required
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="authorName" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-person text-primary"></i>
                Autor *
              </Label>
              <Input
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                placeholder="Nome completo do autor"
                required
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="publisherName" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-building text-primary"></i>
                Editora *
              </Label>
              <Input
                id="publisherName"
                name="publisherName"
                value={formData.publisherName}
                onChange={handleChange}
                placeholder="Nome da editora"
                required
                className="border-gray-300 focus:border-primary"
              />
            </div>
          </div>

          {/* Seção Detalhes */}
          <div className="space-y-4 md:col-span-1">
            <div className="space-y-1">
              <Label htmlFor="publishedAt" className="flex items-center gap-1 text-sm font-medium">
                <CalendarIcon className="text-primary" />
                Data de Publicação *
              </Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pageCount" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-file-text text-primary"></i>
                Número de Páginas *
              </Label>
              <Input
                id="pageCount"
                name="pageCount"
                type="number"
                min="1"
                value={formData.pageCount}
                onChange={handleChange}
                placeholder="Ex: 256"
                required
                className="border-gray-300 focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="genres" className="flex items-center gap-1 text-sm font-medium">
                <i className="bi bi-tags text-primary"></i>
                Gêneros
              </Label>
              <Input
                id="genres"
                value={formData.genres.join(", ")}
                onChange={handleGenresChange}
                placeholder="Separe por vírgulas (Ex: Ficção, Aventura, Romance)"
                className="border-gray-300 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Máximo de 3 gêneros recomendados</p>
            </div>
          </div>

          {/* Textarea que ocupa duas colunas */}
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="synopsis" className="flex items-center gap-1 text-sm font-medium">
              <i className="bi bi-card-text text-primary"></i>
              Sinopse *
            </Label>
            <Textarea
              id="synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Descreva brevemente o enredo do livro"
              required
              rows={4}
              className="border-gray-300 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">Mínimo de 100 caracteres</p>
          </div>

          <Separator className="md:col-span-2 my-2" />

          <DialogFooter className="md:col-span-2 flex justify-end gap-3">
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
                  <span>Salvar Livro</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}