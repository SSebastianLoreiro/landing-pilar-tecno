import { Navbar, Nav, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

const BarraNavegacion = () => {
    return <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Pilar Tecno</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-principal"></Navbar.Toggle>
                <Navbar.Collapse id="navbar-principal">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link href="#cursos">Cursos</Nav.Link>
                        <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default BarraNavegacion;