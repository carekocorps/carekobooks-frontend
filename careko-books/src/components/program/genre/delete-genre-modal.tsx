import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { GenreService } from "@/services/genre.service";

interface DeleteGenreModalProps {
  genreName: string;
  onDeleted?: () => void;
}

export default function DeleteGenreModal({ genreName, onDeleted }: DeleteGenreModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await GenreService.deleteGenre(genreName);
      setIsOpen(false);
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error("Erro ao excluir o gênero:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Excluir gênero"
          className="w-8 h-8 rounded-md border border-red-400 bg-red-100 text-red-700 p-0
                     flex items-center justify-center shadow-sm
                     transform transition-transform duration-200 hover:scale-105 hover:bg-red-200"
        >
          <i className="bi bi-trash text-base"></i>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir este gênero?</DialogTitle>
          <DialogDescription>
            Esta ação é irreversível. Todos os livros associados a este gênero serão desvinculados.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                Excluindo...
              </>
            ) : (
              "Sim, excluir!"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}