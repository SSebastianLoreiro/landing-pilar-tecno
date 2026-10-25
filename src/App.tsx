import './App.css'
import BarraNavegacion from './components/BarraNavegacion/BarraNavegacion'

import SeccionBienvenida from './components/SeccionBienvenida/SeccionBienvenida'
import TarjetaCurso from './components/TarjetaCurso/TarjetaCurso'
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
            <SeccionBienvenida titulo="Pilar Tecno" descripcion='Bienvenido a nuestra plataforma de aprendizaje' />
            
          </Col>
          <Col md={6}>
            <h2>Nuestros Cursos</h2>
            <p>Tenemos varios cursos para realizar y completar tus conocimientos en desarrollo full stack</p>
          </Col>
        </Row>
        <Row className='g-3'>
          {cursos.map(curso => (
            <Col md={6} key={curso.id}><TarjetaCurso id={curso.id} nombre={curso.nombre} descripcion={curso.descripcion} /></Col>
          ))}
        </Row>
      </Container >

    </>
  )
}

export default App
