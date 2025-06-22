"use client";

import { Button } from "@/components/ui/button";
import { CornerUpLeft, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreadService } from "@/services/threads.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { ThreadReply, CreateThreadReply, UpdateThreadReply } from "@/types/thread";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  threadId: number;
  parentId?: number;
  existingReply?: ThreadReply;
  onSuccess?: () => void;
}

export function ThreadReplyActions({ threadId, parentId, existingReply, onSuccess }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(existingReply?.content || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.username) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const data = {
        content,
        username: user.username,
        threadId,
        parentId: parentId || undefined
      };

      if (existingReply) {
        await ThreadService.updateReply(existingReply.id, { 
          ...data, 
          id: existingReply.id 
        } as UpdateThreadReply);
        toast.success("Resposta atualizada com sucesso!");
      } else {
        await ThreadService.createReply(data as CreateThreadReply);
        toast.success("Resposta criada com sucesso!");
      }
      
      setIsModalOpen(false);
      setContent(""); 
      onSuccess?.();
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar resposta", err);
      toast.error("Ocorreu um erro ao salvar a resposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReply?.id) return;
    
    try {
      setIsSubmitting(true);
      await ThreadService.deleteReply(existingReply.id);
      toast.success("Resposta excluída com sucesso!");
      setIsModalOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (err) {
      console.error("Erro ao excluir resposta", err);
      toast.error("Ocorreu um erro ao excluir a resposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setContent(existingReply?.content || "");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {existingReply ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-indigo-600"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="text-gray-700"
          >
            <CornerUpLeft className="w-4 h-4 mr-2" />
            Responder
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent 
        className="sm:max-w-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {existingReply ? "Editar Resposta" : "Adicionar Resposta"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Escreva sua resposta..."
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            {existingReply && (
              <Button 
                type="button"
                variant="destructive" 
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Excluindo..." : "Excluir Resposta"}
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
                {isSubmitting ? "Salvando..." : "Salvar Resposta"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}