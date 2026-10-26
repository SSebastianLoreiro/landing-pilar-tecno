import { useParams } from "react-router-dom";

const PaginaEditarProducto = () => {
    const { id } = useParams();
    return <>
        <h2>Editar producto</h2>
        <p>Id obtenido: {id}</p>
    </>
}

export default PaginaEditarProducto;