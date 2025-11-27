import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getBooks, deleteBook, toggleAvail } from '../services/api'
import type { Book } from '../types/Book'

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const nav = useNavigate()

  async function load() {
  try {
    const res = await getBooks()
    setBooks(res) 
  } catch {
    toast.error('Error cargando libros')
  }
}


  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <button
        onClick={() => nav('/books/add')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Agregar libro
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Título</th><th>Autor</th><th>ISBN</th><th>Disp.</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.author}</td>
              <td>{b.isbn}</td>
              <td>
                <input
                  type="checkbox"
                  checked={b.availability}
                  onChange={async () => {
                    await toggleAvail(b.id)
                    load()
                  }}
                />
              </td>
              <td className="space-x-2">
                <button onClick={() => nav(`/books/${b.id}`)}>Ver</button>
                <button onClick={() => nav(`/books/${b.id}/edit`)}>Editar</button>
                <button
                  onClick={async () => {
                    await deleteBook(b.id)
                    toast.success('Eliminado')
                    load()
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
