"use client";

import { useState, useEffect } from "react";
import { ThreadService } from "@/services/threads.service";
import { Thread, ThreadReply } from "@/types/thread";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThreadReplyActions } from "../threads-replies/threads-replies-actions";
import { Button } from "@/components/ui/button";

interface Props {
  bookId: number;
}

export function ThreadList({ bookId }: Props) {
  const { user } = useCurrentUser();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [replies, setReplies] = useState<Record<number, ThreadReply[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        setError(null);
        const threadData = await ThreadService.searchThreads({
          bookId,
          pageSize: 10
        });
        
        setThreads(threadData);
        
        const repliesData: Record<number, ThreadReply[]> = {};
        for (const thread of threadData) {
          try {
            const threadReplies = await ThreadService.getRepliesByThread(thread.id);
            repliesData[thread.id] = threadReplies;
          } catch (err) {
            console.error(`Erro ao buscar replies para thread ${thread.id}`, err);
            repliesData[thread.id] = [];
          }
        }
        
        setReplies(repliesData);
      } catch (err) {
        console.error("Erro ao buscar threads", err);
        setError("Não foi possível carregar as discussões");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [bookId]);

  const handleReplySuccess = (threadId: number) => {
    ThreadService.getRepliesByThread(threadId)
      .then(newReplies => {
        setReplies(prev => ({
          ...prev,
          [threadId]: newReplies
        }));
      })
      .catch(err => {
        console.error(`Erro ao atualizar replies para thread ${threadId}`, err);
      });
  };

  const renderReplies = (repliesList: ThreadReply[], depth = 0) => {
    return repliesList.map(reply => {
      const username = reply.user?.username || "Usuário desconhecido";
      const displayName = reply.user?.displayName || username;
      const content = reply.content || "Sem conteúdo";
      const createdAt = reply.createdAt ? new Date(reply.createdAt) : new Date();
      const marginLeft = depth * 24; 

      return (
        <div key={reply.id} className="mt-4">
          <div 
            className={`border-l-2 ${depth > 0 ? 'border-indigo-200' : 'border-transparent'} pl-4 py-2`}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.user?.image?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h5 className="text-sm font-medium">{displayName}</h5>
                <p className="text-xs text-gray-500">
                  {format(createdAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 whitespace-pre-line">{content}</p>
            
            <div className="mt-2 flex justify-end">
              {user?.username === reply.user?.username && (
                <ThreadReplyActions 
                  threadId={reply.threadId} 
                  existingReply={reply} 
                  onSuccess={() => handleReplySuccess(reply.threadId)} 
                />
              )}
              {user?.username !== reply.user?.username && (
                <ThreadReplyActions 
                  threadId={reply.threadId} 
                  parentId={reply.id} 
                  onSuccess={() => handleReplySuccess(reply.threadId)} 
                />
              )}
            </div>
          </div>
    
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-16 w-full" />
            <div className="mt-4">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <h3 className="text-xl font-medium text-red-600">Erro ao carregar discussões</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {threads.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-600">Nenhuma discussão encontrada</h3>
          <p className="text-gray-500 mt-2">Seja o primeiro a iniciar uma discussão sobre este livro!</p>
        </div>
      ) : (
        threads.map(thread => {
          const username = thread.user?.username || "Usuário desconhecido";
          const displayName = thread.user?.displayName || username;
          const title = thread.title || "Sem título";
          const description = thread.description || "Sem descrição";
          const createdAt = thread.createdAt ? new Date(thread.createdAt) : new Date();
          
          return (
            <div key={thread.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={thread.user?.image?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`} />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{displayName}</h4>
                    <p className="text-sm text-gray-500">
                      {format(createdAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
                
                <div className="mt-4 flex justify-end">
                  <ThreadReplyActions 
                    threadId={thread.id} 
                    onSuccess={() => handleReplySuccess(thread.id)} 
                  />
                </div>
              </div>
              
              {replies[thread.id]?.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  <h4 className="font-medium text-gray-700 mb-4">Respostas</h4>
                  <div className="space-y-4">
                    {renderReplies(replies[thread.id])}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}