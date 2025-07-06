"use client";
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
import { BookService } from "@/services/books.service";

interface DeleteBookModalProps {
  bookId: number;
  onDeleted?: () => void;
  onDeleteBook?: (bookId: number) => void;
}

export default function DeleteBookModal({ 
  bookId, 
  onDeleted,
  onDeleteBook 
}: DeleteBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await BookService.deleteBook(bookId);
      setIsOpen(false);
      
      if (onDeleteBook) onDeleteBook(bookId);
      
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error("Erro ao excluir o livro:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Excluir livro"
          className="w-8 h-8 rounded-md border border-red-400 bg-red-100 text-red-700 
                     dark:border-red-600 dark:bg-red-950 dark:text-red-300
                     p-0 flex items-center justify-center shadow-sm 
                     transform transition-transform duration-200 hover:scale-105 
                     hover:bg-red-200 dark:hover:bg-red-800/30"
        >
          <i className="bi bi-trash text-base"></i>
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-zinc-900 dark:text-zinc-100">
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir?</DialogTitle>
          <DialogDescription className="dark:text-zinc-400">
            Esta ação é irreversível. O livro será permanentemente removido.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 
                       dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 
                       dark:bg-red-700 dark:hover:bg-red-800"
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