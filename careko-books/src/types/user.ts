export type UserType = {
  id: number;
  username: string;
  displayName: string;
  email: string;
  description: string;
  role: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  image: ImageType;
  followersCount: number;
  followingCount: number;
  progressesCount: number;
};

export type ImageType = {
  id: number;
  name: string;
  url: string;
  contentType: string;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
};
