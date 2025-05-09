import api from "./api";

export const BookService = {
    getBooks: async () => {
        return api.get("/api/v1/books");
    },
}