import { useState, useEffect, useCallback } from "react";
import { ThreadService } from "@/services/threads.service";
import { Thread, ThreadReply } from "@/types/thread";
import { toast } from "sonner";

export function useThreads(bookId: number) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threadsState, setThreadsState] = useState<
    Record<number, {
      expanded: boolean;
      replies: ThreadReply[];
      childrenMap: Record<number, {
        replies: ThreadReply[];
        hasChildren: boolean;
      }>;
    }>
  >({});

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const threadData = await ThreadService.searchThreads({
        bookId,
        pageSize: 10
      });
      
      setThreads(threadData);
      
      const initialState: typeof threadsState = {};
      threadData.forEach(thread => {
        initialState[thread.id] = {
          expanded: false,
          replies: [],
          childrenMap: {}
        };
      });
      setThreadsState(initialState);
    } catch (err) {
      console.error("Erro ao buscar threads", err);
      setError("Não foi possível carregar as discussões");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const toggleThreadReplies = useCallback(async (threadId: number) => {
    const currentState = threadsState[threadId];
    const isExpanded = currentState?.expanded;
    
    if (isExpanded) {
      setThreadsState(prev => ({
        ...prev,
        [threadId]: {
          ...prev[threadId],
          expanded: false
        }
      }));
    } else {
      try {
        const replies = await ThreadService.getFirstLevelReplies(threadId);
        
        setThreadsState(prev => ({
          ...prev,
          [threadId]: {
            ...prev[threadId],
            expanded: true,
            replies
          }
        }));
      } catch (err) {
        console.error("Erro ao carregar respostas", err);
        toast.error("Falha ao carregar respostas");
      }
    }
  }, [threadsState]);

  const toggleReplyChildren = useCallback(async (threadId: number, parentReplyId: number) => {
    const currentThreadState = threadsState[threadId];
    const currentChildrenState = currentThreadState?.childrenMap[parentReplyId];
    const isExpanded = currentChildrenState?.replies.length > 0;
    
    if (isExpanded) {
      setThreadsState(prev => ({
        ...prev,
        [threadId]: {
          ...prev[threadId],
          childrenMap: {
            ...prev[threadId].childrenMap,
            [parentReplyId]: {
              ...prev[threadId].childrenMap[parentReplyId],
              replies: []
            }
          }
        }
      }));
    } else {
      try {
        const children = await ThreadService.getFirstLevelReplies(threadId);
        const hasMore = await ThreadService.hasChildReplies(parentReplyId);
        
        setThreadsState(prev => ({
          ...prev,
          [threadId]: {
            ...prev[threadId],
            childrenMap: {
              ...prev[threadId].childrenMap,
              [parentReplyId]: {
                replies: children,
                hasChildren: hasMore
              }
            }
          }
        }));
      } catch (err) {
        console.error("Erro ao carregar respostas filhas", err);
        toast.error("Falha ao carregar respostas");
      }
    }
  }, [threadsState]);

  const handleReplySuccess = useCallback((threadId: number, newReply: ThreadReply, parentId?: number) => {
  setThreadsState(prev => {
    const currentThread = prev[threadId] || {
      expanded: true,
      replies: [],
      childrenMap: {}
    };
    
    if (!parentId) {
      return {
        ...prev,
        [threadId]: {
          ...currentThread,
          replies: [...currentThread.replies, newReply]
        }
      };
    }
    const currentChildrenMap = currentThread.childrenMap[parentId] || {
      replies: [],
      hasChildren: true
    };

    return {
      ...prev,
      [threadId]: {
        ...currentThread,
        childrenMap: {
          ...currentThread.childrenMap,
          [parentId]: {
            ...currentChildrenMap,
            replies: [...currentChildrenMap.replies, newReply]
          }
        }
      }
    };
  });
}, []);

  return {
    threads,
    threadsState,
    loading,
    error,
    toggleThreadReplies,
    toggleReplyChildren,
    handleReplySuccess,
    refetch: fetchThreads
  };
}