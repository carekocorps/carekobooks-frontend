import { Thread, CreateThread, UpdateThread, ThreadReply, CreateThreadReply, UpdateThreadReply } from "@/types/thread";
import api from "./api";

export const ThreadService = {
  createThread: async (data: CreateThread) => {
    const res = await api.post<Thread>("/v1/books/threads", data);
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
    }>("/v1/books/threads", { params });
    return res.data.content;
  },

  updateThread: async (id: number, data: UpdateThread) => {
    const res = await api.put<Thread>(`/v1/books/threads/${id}`, data);
    return res.data;
  },

  deleteThread: async (id: number) => {
    const res = await api.delete(`/v1/books/threads/${id}`);
    return res.data;
  },

  getThreadById: async (id: number) => {
    const res = await api.get<Thread>(`/v1/books/threads/${id}`);
    return res.data;
  },

  createReply: async (data: CreateThreadReply) => {
    const res = await api.post<ThreadReply>("/v1/books/threads/replies", data);
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
    }>("/v1/books/threads/replies", { params });
    return res.data.content;
  },

  updateReply: async (id: number, data: UpdateThreadReply) => {
    const res = await api.put<ThreadReply>(`/v1/books/threads/replies/${id}`, data);
    return res.data;
  },

  deleteReply: async (id: number) => {
    const res = await api.delete(`/v1/books/threads/replies/${id}`);
    return res.data;
  },

  createChildReply: async (parentId: number, data: CreateThreadReply) => {
    const res = await api.post<ThreadReply>(`/v1/books/threads/replies/${parentId}/children`, data);
    return res.data;
  },

  getFirstLevelReplies: async ( parentId?: number) => {
    const res = await api.get<{
      content: ThreadReply[];
      totalPages: number;
      totalElements: number;
    }>("/v1/books/threads/replies", {
      params: {
        parentId,
        pageSize: 100,
        sort: "createdAt,asc"
      }
    });
    return res.data.content;
  },

  hasChildReplies: async (replyId: number) => {
    try {
      const res = await api.get<{
        totalElements: number;
      }>("/v1/books/threads/replies", {
        params: {
          parentId: replyId,
          pageSize: 0
        }
      });
      return res.data.totalElements > 0;
    } catch {
      return false;
    }
  }
};