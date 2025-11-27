import React from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { deleteBook } from '../services/api';
import { toast } from 'react-hot-toast';

export default function BookDetail() {
  const book = useLoaderData() as Book;
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este libro?')) return;
    try {
      await deleteBook(book.id);
      toast.success('Libro eliminado');
      navigate('/');
    } catch {
      toast.error('Error al eliminar el libro');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4 border rounded">
      <h1 className="text-2xl font-bold">{book.name}</h1>
      <p>
        <strong>Autor:</strong> {book.author}
      </p>
      <p>
        <strong>Fecha de publicación:</strong> {book.releaseDate}
      </p>
      <p>
        <strong>Disponible:</strong> {book.availability ? 'Sí' : 'No'}
      </p>

      <div className="flex space-x-3 mt-4">
        <Link to={`/edit/${book.id}`} className="btn-secondary">
          Editar
        </Link>
        <button onClick={handleDelete} className="btn-danger">
          Eliminar
        </button>
        <Link to="/" className="btn-light">
          Volver
        </Link>
      </div>
    </div>
  );
}
