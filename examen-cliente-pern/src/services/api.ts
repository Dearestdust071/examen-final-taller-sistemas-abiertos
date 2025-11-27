import axios from 'axios'
import type { Book, BookInput } from '../types/Book'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
})

export async function getBooks(): Promise<Book[]> {
  const res = await axios.get('http://localhost:4000/api/books')
  return res.data.data 
}

export const getBook       = (id: number) => api.get<Book>(`/books/${id}`)
export const createBook    = (data: BookInput) => api.post<Book>('/books', data)
export const updateBook    = (id: number, data: BookInput) => api.put<Book>(`/books/${id}`, data)
export const toggleAvail   = (id: number) => api.patch<Book>(`/books/${id}`)
export const deleteBook    = (id: number) => api.delete(`/books/${id}`)
