"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThreadService } from "@/services/threads.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { Thread, CreateThread, UpdateThread } from "@/types/thread";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  bookId: number;
}

export function ThreadActions({ bookId }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [existingThread, setExistingThread] = useState<Thread | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateThread | UpdateThread>({
    title: "",
    description: "",
    username: user?.username || "",
    bookId: bookId,
  });

  useEffect(() => {
    const fetchThread = async () => {
      if (!user?.username) return;
      
      try {
        setIsLoading(true);
        const threads = await ThreadService.searchThreads({
          username: user.username,
          bookId,
          pageSize: 1,
        });
        
        if (threads.length > 0) {
          setExistingThread(threads[0]);
          setFormData({
            title: threads[0].title,
            description: threads[0].description,
            username: user.username,
            bookId: bookId,
          });
        } else {
          setExistingThread(null);
          setFormData({
            title: "",
            description: "",
            username: user.username,
            bookId: bookId,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar thread", err);
        toast.error("Não foi possível verificar seu thread");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.username) {
      fetchThread();
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

      if (existingThread) {
        await ThreadService.updateThread(
          existingThread.id, 
          submissionData as UpdateThread
        );
        toast.success("Thread atualizado com sucesso!");
      } else {
        await ThreadService.createThread(
          submissionData as CreateThread
        );
        toast.success("Thread criado com sucesso!");
      }
      
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar thread", err);
      toast.error("Ocorreu um erro ao salvar o thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingThread?.id) return;
    
    try {
      setIsSubmitting(true);
      await ThreadService.deleteThread(existingThread.id);
      toast.success("Thread excluído com sucesso!");
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Erro ao excluir thread", err);
      toast.error("Ocorreu um erro ao excluir o thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) return null;

  return (
    <div className="mt-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full py-5 text-base rounded-xl">
            {existingThread ? (
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Editar Thread
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Thread
              </div>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent 
          className="sm:max-w-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {existingThread ? "Editar Thread" : "Criar Thread"}
            </DialogTitle>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              {existingThread && (
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Excluir Thread
                </Button>
              )}
              
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
                  {isSubmitting ? "Salvando..." : "Salvar Thread"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}