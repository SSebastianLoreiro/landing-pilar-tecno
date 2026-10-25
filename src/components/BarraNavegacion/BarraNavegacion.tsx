import { Navbar, Nav, Container } from "react-bootstrap"

const BarraNavegacion = () => {
    return <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Pilar Tecno</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-principal"></Navbar.Toggle>
                <Navbar.Collapse id="navbar-principal">
                    <Nav className="ms-auto">
                        <Nav.Link href="#inicio">Inicio</Nav.Link>
                        <Nav.Link href="#cursos">Cursos</Nav.Link>
                        <Nav.Link href="#contacto">Contacto</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default BarraNavegacion;