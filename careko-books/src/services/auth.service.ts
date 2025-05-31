import api from "./api";

export const AuthService = {
  signIn: async (username: string, password: string) => {
    return api.post("/api/v1/auth/signin", {
      username,
      password,
    }, {
      withCredentials: true, 
    });
  },
};