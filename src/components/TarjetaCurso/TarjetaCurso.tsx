import { Card, Button } from "react-bootstrap"
type TarjetaCursoProps = {
    id: number;
    nombre: string;
    descripcion: string;
}


const TarjetaCurso = ({ id, nombre, descripcion }: TarjetaCursoProps) => {

    return <Card>
        <Card.Body >
            <Card.Text>Curso #{id}</Card.Text>
            <Card.Title>{nombre}</Card.Title>
            <Card.Text>{descripcion}</Card.Text>
            <Button>Ver Cursos</Button>
        </Card.Body>
    </Card>
}

export default TarjetaCurso;