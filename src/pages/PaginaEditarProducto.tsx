import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import FormularioProducto from "../components/FormularioProducto";
import { actualizarProducto, obtenerMensajeError, obtenerProductoPorId } from "../services/ProductoService";
import type { Producto } from "../types/Producto";

const PaginaEditarProducto = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState<{ id?: string; producto?: Producto; error?: string }>({});

    useEffect(() => {
        if (!id) return;
        const controlador = new AbortController();
        obtenerProductoPorId(id, controlador.signal)
            .then(producto => {
                if (!controlador.signal.aborted) setConsulta({ id, producto });
            })
            .catch(causa => {
                if (!controlador.signal.aborted) {
                    setConsulta({ id, error: obtenerMensajeError(causa, "No se pudo cargar el producto. Volvé al listado e intentá nuevamente.") });
                }
            });
        return () => controlador.abort();
    }, [id]);

    if (!id || (consulta.id === id && consulta.error)) {
        return <>
            <h1>Editar producto</h1>
            <Alert variant="danger">{consulta.error || "No se indicó el identificador del producto."}</Alert>
            <Link to="/productos">Volver al listado</Link>
        </>;
    }
    if (consulta.id !== id || !consulta.producto) {
        return <div role="status"><Spinner animation="border" size="sm" aria-hidden="true" /> Cargando producto…</div>;
    }

    const producto = consulta.producto;
    return <FormularioProducto
        key={id}
        modo="editar"
        valoresIniciales={{
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? "",
            precio: producto.precio,
            cantidad: producto.cantidad,
            categoria: producto.categoria ?? "",
        }}
        onGuardar={datos => actualizarProducto(id, datos)}
    />;
};

export default PaginaEditarProducto;