export interface Book {
  id: number;
  name: string;
  author: string;
  isbn: string;
  releaseDate: string;
  availability: boolean;
}

export type BookInput = Omit<Book, 'id' | 'availability'>;