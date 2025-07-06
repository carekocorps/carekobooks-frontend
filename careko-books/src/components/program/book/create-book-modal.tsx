"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookService } from "@/services/books.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ImageIcon, ImagePlus, X } from "lucide-react";

const bookSchema = z.object({
  title: z.string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título não pode ter mais de 100 caracteres"),
  synopsis: z.string()
    .min(1, "A sinopse deve ter pelo menos 10 caracteres")
    .max(1000, "A sinopse não pode ter mais de 1000 caracteres"),
  authorName: z.string()
    .min(1, "O nome do autor deve ter pelo menos 3 caracteres")
    .max(120, "O nome do autor não pode ter mais de 120 caracteres"),
  publisherName: z.string()
    .min(2, "O nome da editora deve ter pelo menos 2 caracteres")
    .max(120, "O nome da editora não pode ter mais de 120 caracteres"),
  publishedAt: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida. Use o formato AAAA-MM-DD"),
  pageCount: z.number()
    .min(1, "O livro deve ter pelo menos 1 página")
    .max(10000, "O número máximo de páginas é 10.000"),
  genres: z.array(z.string().min(1, "Gênero não pode ser vazio"))
    .min(1, "Pelo menos 1 gênero é necessário"),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function CreateBookModal() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      authorName: "",
      publisherName: "",
      publishedAt: "",
      pageCount: 0,
      genres: [],
    }
  });

  const { mutate: createBook, isPending } = useMutation({
    mutationFn: async (data: BookFormData) => {
      const payload = {
        ...data,
        image,
      };
      return await BookService.createBook(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsOpen(false);
      reset();
      setImage(null);
      setPreviewImage(null);
      toast.success("Livro criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar livro:", error);
      toast.error("Falha ao criar livro");
    }
  });

  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genres = e.target.value.split(",").map(g => g.trim()).filter(g => g);
    setValue("genres", genres);
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

  const onSubmit = (data: BookFormData) => {
    createBook(data);
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <Label htmlFor="title">Título do Livro *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Digite o título completo"
                className="mt-1"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="authorName">Autor *</Label>
              <Input
                id="authorName"
                {...register("authorName")}
                placeholder="Nome completo do autor"
                className="mt-1"
              />
              {errors.authorName && <p className="mt-1 text-sm text-red-500">{errors.authorName.message}</p>}
            </div>

            <div>
              <Label htmlFor="publisherName">Editora *</Label>
              <Input
                id="publisherName"
                {...register("publisherName")}
                placeholder="Nome da editora"
                className="mt-1"
              />
              {errors.publisherName && <p className="mt-1 text-sm text-red-500">{errors.publisherName.message}</p>}
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
                id="publishedAt"
                type="date"
                {...register("publishedAt")}
                className="mt-1"
              />
              {errors.publishedAt && <p className="mt-1 text-sm text-red-500">{errors.publishedAt.message}</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pageCount">Número de Páginas *</Label>
                <Input
                  id="pageCount"
                  type="number"
                  min={1}
                  {...register("pageCount", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.pageCount && <p className="mt-1 text-sm text-red-500">{errors.pageCount.message}</p>}
              </div>
              <div>
                <Label htmlFor="genres">Gêneros</Label>
                <Input
                  id="genres"
                  onChange={handleGenresChange}
                  placeholder="Ex: Ficção, Romance"
                  className="mt-1"
                  defaultValue={watch("genres")?.join(", ")}
                />
                {errors.genres && <p className="mt-1 text-sm text-red-500">{errors.genres.message}</p>}
                <p className="mt-1 text-xs text-zinc-500">Max. 3 gêneros</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="synopsis">Sinopse *</Label>
            <Textarea
              id="synopsis"
              rows={5}
              {...register("synopsis")}
              placeholder="Descreva o enredo em até 500 caracteres"
              className="mt-1"
            />
            {errors.synopsis && <p className="mt-1 text-sm text-red-500">{errors.synopsis.message}</p>}
          </div>
        </form>

       <Separator />

        <DialogFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Livro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}