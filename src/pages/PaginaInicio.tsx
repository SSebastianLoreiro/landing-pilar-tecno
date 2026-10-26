import { Row, Col } from "react-bootstrap"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import BotonColor from '../components/BotonColor/BotonColor'
import SeccionBienvenida from '../components/SeccionBienvenida/SeccionBienvenida'
import TarjetaCurso from '../components/TarjetaCurso/TarjetaCurso'
const PaginaInicio = () => {
    const { hash, key } = useLocation();
    useEffect(() => {
        if (hash === "#cursos") document.getElementById("cursos")?.scrollIntoView();
    }, [hash, key]);
    const cursos = [
        { id: 1, nombre: "React", descripcion: "Desarrollo de interfaces" },
        { id: 2, nombre: "Node.js", descripcion: "Desarrollo de servidores" },
        { id: 3, nombre: "TypeScript", descripcion: "JavaScript con tipado" },
        { id: 4, nombre: "Bootstrap", descripcion: "Diseño de interfaces responsive" }
    ];
    return <div><Row className='g-3'>
        <Col md={6}>
            <SeccionBienvenida titulo="Pilar Tecno" descripcion='Bienvenido a nuestra plataforma de aprendizaje' />
            <BotonColor />
        </Col>
        <Col md={6}>
            <h2 id="cursos" tabIndex={-1}>Nuestros cursos</h2>
            <p>Tenemos varios cursos para realizar y completar tus conocimientos en desarrollo full stack</p>
        </Col>
    </Row>
        <Row className='g-3'>
            {cursos.map(curso => (
                <Col md={6} key={curso.id}><TarjetaCurso id={curso.id} nombre={curso.nombre} descripcion={curso.descripcion} /></Col>
            ))}
        </Row>
    </div>
}

export default PaginaInicio;
