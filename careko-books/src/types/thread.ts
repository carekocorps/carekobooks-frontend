import { UserType } from "./user";
import { BookType } from "./book";

export type Thread = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
  book: BookType;
  replies?: ThreadReply[];
};

export type CreateThread = {
  title: string;
  description: string;
  username: string;
  bookId: number;
};

export type UpdateThread = Partial<CreateThread> & { id: number };

export type ThreadReply = {
  id: number;
  content: string;
  createdAt?: string;
  updatedAt: string;
  user: UserType;
  parent: Thread;
  replies?: ThreadReply[];
  isContainingChildren: boolean;
};

export type CreateThreadReply = {
  content: string;
  username: string;
  threadId: number;
  parentId?: number;
};

export type UpdateThreadReply = Partial<CreateThreadReply> & { id: number };