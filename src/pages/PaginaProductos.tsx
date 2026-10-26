import { Row, Col } from "react-bootstrap"
import ListaProductos from "../components/ListaProductos";

const PaginaProductos = () => {
    return <><Row className='g-3'>
        <Col xs={12}>
            <ListaProductos />
        </Col>
    </Row></>
}

export default PaginaProductos;