import { Navbar, Nav, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

const BarraNavegacion = () => {
    return <>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect aria-label="Navegación principal">
            <Container>
                <Navbar.Brand as={Link} to="/">Pilar Tecno</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-principal" label="Abrir o cerrar navegación"></Navbar.Toggle>
                <Navbar.Collapse id="navbar-principal">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" eventKey="inicio">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/#cursos" eventKey="cursos">Cursos</Nav.Link>
                        <Nav.Link as={Link} to="/productos" eventKey="productos">Productos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default BarraNavegacion;
