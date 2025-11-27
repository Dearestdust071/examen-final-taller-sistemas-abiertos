import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { createBook, updateBook, getBook } from '../services/api'
import type { Book } from '../types/Book'

interface Props {
  mode: 'add' | 'edit'
}

export default function BookForm({ mode }: Props) {
  const { id } = useParams()
  const nav = useNavigate()
  const [existing, setExisting] = useState<Book | null>(null)

  useEffect(() => {
    if (mode === 'edit' && id) {
      getBook(Number(id))
        .then(res => setExisting(res.data))
        .catch(() => toast.error('No se pudo cargar el libro'))
    }
  }, [mode, id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get('name') as string,
      author: formData.get('author') as string,
      releaseDate: formData.get('releaseDate') as string,
      availability: formData.get('availability') === 'on',
      isbn: formData.get('isbn') as string
    }

    try {
      if (mode === 'add') {
        await createBook(payload)
        toast.success('Libro creado')
      } else if (existing) {
        await updateBook(existing.id, payload)
        toast.success('Libro actualizado')
      }
      nav('/books')
    } catch {
      toast.error('Error al guardar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <label>
        Nombre
        <input
          name="name"
          defaultValue={existing?.name}
          required
          className="block w-full"
        />
      </label>
      <label>
        Autor
        <input
          name="author"
          defaultValue={existing?.author}
          required
          className="block w-full"
        />
      </label>
      <label>
        Fecha de publicación
        <input
          name="releaseDate"
          type="date"
          defaultValue={existing?.releaseDate}
          required
          className="block w-full"
        />
      </label>
      <label>
        ISBN
        <input
          name="isbn"
          defaultValue={existing?.isbn}
          required
          className="block w-full"
        />
      </label>
      <label className="flex items-center">
        <input
          name="availability"
          type="checkbox"
          defaultChecked={existing?.availability}
          className="mr-2"
        />
        Disponible
      </label>
      <button type="submit" className="btn-primary">
        {mode === 'add' ? 'Crear libro' : 'Actualizar libro'}
      </button>
    </form>
  )
}
