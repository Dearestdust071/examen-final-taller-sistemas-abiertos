// src/handlers/book.ts
import { Request, Response, NextFunction } from 'express';
import Book from '../models/Libro.mo';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.create(req.body);
  return res.status(201).json(book);
};

export const getAllBooks = async (_req: Request, res: Response, next: NextFunction) => {
  const books = await Book.findAll({ order: [['releaseDate', 'DESC']] });
  return res.json({ data: books });
};

export const getBookByID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);

  if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  return res.json(book);
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);

  if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  await book.update(req.body);
  return res.json(book);
};

export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);

  if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  book.availability = !book.availability;
  await book.save();
  return res.json(book);
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deletedCount = await Book.destroy({ where: { id } });

  if (!deletedCount) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  return res.json({ message: 'Libro eliminado correctamente' });
};
