import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Layout from './Layouts/Layout'
import { Toaster } from 'react-hot-toast';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Layout></Layout>
       <Toaster position="top-right" />
    </>
  )
}

export default App
