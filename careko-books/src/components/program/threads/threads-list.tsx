"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { useThreads } from "@/hooks/useThreads";
import ThreadItem from "./thread-item";

interface Props {
  bookId: number;
}

export function ThreadList({ bookId }: Props) {
  const {
    threads,
    threadsState,
    loading,
    error,
    toggleThreadReplies,
    toggleReplyChildren,
    handleReplySuccess
  } = useThreads(bookId);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div>
                <Skeleton className="h-4 w-32 mb-2 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-600" />
              </div>
            </div>
            <Skeleton className="h-5 w-3/4 mb-3 bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-16 w-full bg-gray-200 dark:bg-gray-600" />
            <div className="mt-4">
              <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-600" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-medium text-red-600 dark:text-red-400">Erro ao carregar discussões</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
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
      {threads.map(thread => {
        const threadState = threadsState[thread.id] || {
          expanded: false,
          replies: [],
          childrenMap: {}
        };

        return (
          <ThreadItem
            key={thread.id}
            thread={thread}
            threadState={threadState}
            onToggleReplies={() => toggleThreadReplies(thread.id)}
            onReplySuccess={(parentId) => handleReplySuccess(thread.id)}
            onToggleChildReplies={(parentReplyId) => toggleReplyChildren(thread.id, parentReplyId)}
          />
        );
      })}
    </div>
  );
}