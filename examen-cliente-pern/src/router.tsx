import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layouts/Layout'
import Home from './Components/Home'
import BookList from './Components/BookList'
import AddBook from './Components/AddBook'
import EditBook from './Components/EditBook'
import ViewBook from './Components/Book'
import ErrorMessage from './Components/ErrorMessage'
import { getBook } from './services/api'
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books">
            <Route index element={<BookList />} />
            <Route path="add" element={<AddBook />} />
            <Route path=":id" element={<ViewBook />} />
            <Route
  path=":id/edit"
  element={<EditBook />}
  loader={async ({ params }) => {
    const { data } = await getBook(Number(params.id))
    return data
  }}
/>

          </Route>
          <Route path="*" element={<ErrorMessage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
