import { ImageType } from "./image";

export type UserType = {
  id: number;
  username: string;
  displayName: string;
  roles?: string[];
  email: string;
  description: string; 
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  image: ImageType;
  followersCount: number;
  followingCount: number;
  progressesCount: number;
};

export type ExtendedUserType = UserType & { roles?: string[] };
