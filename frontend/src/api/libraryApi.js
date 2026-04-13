import axiosClient from "./axiosClient";

export const loginAccount = (payload) => axiosClient.post("/auth/login", payload);
export const registerUser = (payload) => axiosClient.post("/auth/register", payload);

export const fetchDashboardStats = () => axiosClient.get("/dashboard/stats");
export const getPublicBooks = () => axiosClient.get("/books/public");
export const getMyProfile = () => axiosClient.get("/users/me");
export const getMyIssues = () => axiosClient.get("/users/issues");
export const issueBookAsUser = (bookId) => axiosClient.post(`/users/issues/${bookId}`);
export const returnBookAsUser = (issueId) => axiosClient.post(`/users/issues/${issueId}/return`);

export const addBook = (payload) => axiosClient.post("/books/add", payload);
export const getAllBooks = () => axiosClient.get("/books/all");
export const updateBook = (id, payload) => axiosClient.put(`/books/update/${id}`, payload);
export const deleteBook = (id) => axiosClient.delete(`/books/delete/${id}`);

export const addStudent = (payload) => axiosClient.post("/students/add", payload);
export const getAllStudents = () => axiosClient.get("/students/all");
export const updateStudent = (id, payload) => axiosClient.put(`/students/update/${id}`, payload);
export const deleteStudent = (id) => axiosClient.delete(`/students/delete/${id}`);

export const issueBook = (payload) => axiosClient.post("/issues/issue", payload);
export const returnBook = (payload) => axiosClient.post("/issues/return", payload);
export const getAllIssues = () => axiosClient.get("/issues/all");
