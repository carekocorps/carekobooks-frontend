import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { BookService } from "@/services/books.service";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { CalendarIcon, ImageIcon, ImagePlus, X } from "lucide-react";

export default function CreateBookModal() {
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
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFile = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const removeImage = () => { handleImageFile(null); fileInputRef.current!.value = ""; };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        publishedAt: formData.publishedAt || "",
        image,
      };
      await BookService.createBook(payload);
      setIsOpen(false);
      setFormData({ title: "", synopsis: "", authorName: "", publisherName: "", publishedAt: "", pageCount: 0, genres: [] });
      setImage(null);
      setPreviewImage(null);
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
          className="w-9 h-9 p-0 rounded-full border border-primary text-primary hover:bg-primary/10 transition"
          aria-label="Criar novo livro"
        >
          <i className="bi bi-plus-lg text-xl" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-6 space-y-6 rounded-lg dark:bg-zinc-900">
        <DialogHeader className="pb-2 border-b dark:border-zinc-700">
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
            <i className="bi bi-book-plus-fill" /> Adicionar Novo Livro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <Label htmlFor="title">Título do Livro *</Label>
              <Input
                id="title" name="title" value={formData.title}
                onChange={handleChange} required
                placeholder="Digite o título completo"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="authorName">Autor *</Label>
              <Input
                id="authorName" name="authorName" value={formData.authorName}
                onChange={handleChange} required
                placeholder="Nome completo do autor"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="publisherName">Editora *</Label>
              <Input
                id="publisherName" name="publisherName" value={formData.publisherName}
                onChange={handleChange} required
                placeholder="Nome da editora"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Label>Capa do Livro</Label>
              <div
                className={`mt-1 relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer transition ${
                  isDragging ? "border-primary bg-primary/10" : "border-zinc-300 hover:border-primary"
                }`}
                style={{ minHeight: previewImage ? "auto" : "140px" }}
                onClick={triggerFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage ? (
                  <div className="relative group">
                    <img src={previewImage} alt="Capa" className="w-32 h-48 object-cover rounded-md" />
                    <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ImagePlus className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={e => { e.stopPropagation(); removeImage(); }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-sm text-zinc-500">
                    <ImageIcon className="mx-auto mb-2 w-8 h-8" />
                    Arraste ou clique para adicionar<br/> capa (PNG/JPG, até 5 MB)
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="publishedAt" className="flex items-center gap-1">
                <CalendarIcon className="text-primary" /> Data de Publicação *
              </Label>
              <Input
                id="publishedAt" name="publishedAt" type="date"
                value={formData.publishedAt} onChange={handleChange}
                required className="mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pageCount">Número de Páginas *</Label>
                <Input
                  id="pageCount" name="pageCount" type="number"
                  min={1} value={formData.pageCount.toString()}
                  onChange={handleChange} required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="genres">Gêneros</Label>
                <Input
                  id="genres" value={formData.genres.join(", ")}
                  onChange={handleGenresChange}
                  placeholder="Ex: Ficção, Romance"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-zinc-500">Max. 3 gêneros</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="synopsis">Sinopse *</Label>
            <Textarea
              id="synopsis" name="synopsis" rows={5}
              value={formData.synopsis} onChange={handleChange}
              placeholder="Descreva o enredo em até 500 caracteres"
              required className="mt-1"
            />
          </div>
        </form>

        <Separator />

        <DialogFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={(e) => handleCreate(e as any)} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Livro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
