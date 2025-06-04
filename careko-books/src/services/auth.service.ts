import api from "./api";

export const AuthService = {
  signIn: async (username: string, password: string) => {
    const response = await api.post("/api/v1/auth/signin", {
      username,
      password,
    });
    return response.data;
  },
};