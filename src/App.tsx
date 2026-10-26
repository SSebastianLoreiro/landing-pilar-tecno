import './App.css'
import BarraNavegacion from './components/BarraNavegacion/BarraNavegacion'

import { Container } from "react-bootstrap"
import { Routes, Route, Link } from 'react-router-dom'
import PaginaInicio from './pages/PaginaInicio'
import PaginaProductos from './pages/PaginaProductos'
import PaginaCrearProducto from './pages/PaginaCrearProducto'
import PaginaEditarProducto from './pages/PaginaEditarProducto'

function App() {
  return (
    <>

      <BarraNavegacion />
      <Container className='mt-4'>
        <Routes>
          <Route path='/' element={<PaginaInicio />} />
          <Route path='/productos' element={<PaginaProductos />} />
          <Route path='/productos/nuevo' element={<PaginaCrearProducto />} />
          <Route path='/productos/:id/editar' element={<PaginaEditarProducto />} />
          <Route path='*' element={<><h1>Página no encontrada</h1><p>La dirección que ingresaste no existe.</p><Link to='/'>Volver al inicio</Link></>} />
        </Routes>
      </Container >

    </>
  )
}

export default App
