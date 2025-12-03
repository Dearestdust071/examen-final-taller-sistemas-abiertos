import axios from 'axios';
import { Book, BookInput } from '../types/Book';

// IP segun consola del servidor
const API_URL = 'http://192.168.1.159:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<{ data: Book[] }>('/books');
  return response.data.data;
};

export const getBookByISBN = async (isbn: string): Promise<Book | null> => {
  try {
    const response = await api.get<Book>(`/books/search?isbn=${isbn}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createBook = async (book: BookInput): Promise<Book> => {
  const response = await api.post<Book>('/books', book);
  return response.data;
};

export const toggleAvailability = async (id: number): Promise<Book> => {
  const response = await api.patch<Book>(`/books/${id}`);
  return response.data;
};
