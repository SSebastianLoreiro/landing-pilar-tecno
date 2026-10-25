import './App.css'
import BarraNavegacion from './components/BarraNavegacion/BarraNavegacion'

import { Container, Row, Col } from "react-bootstrap"

function App() {

  const cursos = [
    { id: 1, nombre: "React", descripcion: "Desarrollo de interfaces" },
    { id: 2, nombre: "Node.js", descripcion: "Desarrollo de servidores" },
    { id: 3, nombre: "TypeScript", descripcion: "JavaScript con tipado" },
    { id: 4, nombre: "Bootstrap", descripcion: "Diseño de interfaces responsive" }
  ];

  return (
    <>

      <BarraNavegacion />
      <Container className='mt-4'>
        <Row className='g-3'>
          <Col md={6}>
            <h1>Pilar Tecno</h1><p>Bienvenido a nuestra plataforma de aprendizaje</p>
            
          </Col>
          <Col md={6}>
            <h2>Nuestros Cursos</h2>
            <p>Tenemos varios cursos para realizar y completar tus conocimientos en desarrollo full stack</p>
          </Col>
        </Row>
        <Row className='g-3'>
          {cursos.map(curso => (
            <Col md={6} key={curso.id}><article><h3>{curso.nombre}</h3><p>{curso.descripcion}</p></article></Col>
          ))}
        </Row>
      </Container >

    </>
  )
}

export default App
