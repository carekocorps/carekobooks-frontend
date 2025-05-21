import api from "./api";

export const BookService = {
    getBooks: async (page = 1, size = 10, title = '') => {
        return api.get("/api/v1/books", {
            params: {
                title,
                pageNumber: page -1,
                pageSize: size
            },
        });
    },
}