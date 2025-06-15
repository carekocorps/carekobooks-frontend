import { UserType } from "./user";

export type Thread = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
  bookId: number;
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
  createdAt: string;
  updatedAt: string;
  user: UserType;
  threadId: number;
  parentId?: number;
};

export type CreateThreadReply = {
  content: string;
  username: string;
  threadId: number;
  parentId?: number;
};

export type UpdateThreadReply = Partial<CreateThreadReply> & { id: number };