import { Thread, CreateThread, UpdateThread, ThreadReply, CreateThreadReply, UpdateThreadReply } from "@/types/thread";
import api from "./api";

export const ThreadService = {
  createThread: async (data: CreateThread) => {
    const res = await api.post<Thread>("/api/v1/books/threads", data);
    return res.data;
  },

  searchThreads: async (params: {
    title?: string;
    username?: string;
    bookId?: number;
    pageSize?: number;
    pageNumber?: number;
    orderBy?: string;
    isAscendingOrder?: boolean;
  }) => {
    const res = await api.get<{
      content: Thread[];
      totalPages: number;
      totalElements: number;
    }>("/api/v1/books/threads", { params });
    return res.data.content;
  },

  updateThread: async (id: number, data: UpdateThread) => {
    const res = await api.put<Thread>(`/api/v1/books/threads/${id}`, data);
    return res.data;
  },

  deleteThread: async (id: number) => {
    const res = await api.delete(`/api/v1/books/threads/${id}`);
    return res.data;
  },

  getThreadById: async (id: number) => {
    const res = await api.get<Thread>(`/api/v1/books/threads/${id}`);
    return res.data;
  },

  createReply: async (data: CreateThreadReply) => {
    const res = await api.post<ThreadReply>("/api/v1/books/threads/replies", data);
    return res.data;
  },

  searchReplies: async (params: {
    parentId?: number;
    username?: string;
    threadId?: number;
    bookId?: number;
    pageSize?: number;
    pageNumber?: number;
    orderBy?: string;
    isAscendingOrder?: boolean;
  }) => {
    const res = await api.get<{
      content: ThreadReply[];
      totalPages: number;
      totalElements: number;
    }>("/api/v1/books/threads/replies", { params });
    return res.data.content;
  },

  updateReply: async (id: number, data: UpdateThreadReply) => {
    const res = await api.put<ThreadReply>(`/api/v1/books/threads/replies/${id}`, data);
    return res.data;
  },

  deleteReply: async (id: number) => {
    const res = await api.delete(`/api/v1/books/threads/replies/${id}`);
    return res.data;
  },

  createChildReply: async (parentId: number, data: CreateThreadReply) => {
    const res = await api.post<ThreadReply>(`/api/v1/books/threads/replies/${parentId}/children`, data);
    return res.data;
  },

  getRepliesByThread: async (threadId: number) => {
    const replies = await ThreadService.searchReplies({
      threadId,
      pageSize: 100
    });
    
    const replyMap = new Map<number, ThreadReply>();
    const rootReplies: ThreadReply[] = [];
    
    replies.forEach(reply => {
      replyMap.set(reply.id, reply);
      
      if (!reply.parentId) {
        rootReplies.push(reply);
      }
    });
    
    return rootReplies;
  }
};