import { useEffect, useState } from "react";
import { Alert, Button, Modal, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import type { Producto } from "../types/Producto";
import { eliminarProducto, obtenerMensajeError, obtenerProductos } from "../services/ProductoService";

const formatoPrecio = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

const ListaProductos = () => {
    const location = useLocation();
    const estadoNavegacion = location.state as { mensaje?: unknown } | null;
    const [mensaje, setMensaje] = useState(typeof estadoNavegacion?.mensaje === "string" ? estadoNavegacion.mensaje : "");
    const [consulta, setConsulta] = useState<{ productos: Producto[]; cargando: boolean; error: string }>({
        productos: [], cargando: true, error: "",
    });
    const [intento, setIntento] = useState(0);
    const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminacion, setErrorEliminacion] = useState("");

    useEffect(() => {
        const controlador = new AbortController();
        obtenerProductos(controlador.signal)
            .then(productos => {
                if (!controlador.signal.aborted) setConsulta({ productos, cargando: false, error: "" });
            })
            .catch(causa => {
                if (!controlador.signal.aborted) {
                    setConsulta({ productos: [], cargando: false, error: obtenerMensajeError(causa, "No se pudieron cargar los productos. Intentá nuevamente.") });
                }
            });
        return () => controlador.abort();
    }, [intento]);

    const reintentar = () => {
        setConsulta({ productos: [], cargando: true, error: "" });
        setIntento(anterior => anterior + 1);
    };

    const cerrarModal = () => {
        if (!eliminando) {
            setSeleccionado(null);
            setErrorEliminacion("");
        }
    };

    const confirmarEliminacion = async () => {
        if (!seleccionado || eliminando) return;
        setEliminando(true);
        setErrorEliminacion("");
        try {
            await eliminarProducto(seleccionado._id);
            setConsulta(anterior => ({
                ...anterior,
                productos: anterior.productos.filter(producto => producto._id !== seleccionado._id),
            }));
            setMensaje(`El producto «${seleccionado.nombre}» se eliminó correctamente.`);
            setSeleccionado(null);
        } catch (causa) {
            setErrorEliminacion(obtenerMensajeError(causa, "No se pudo eliminar el producto. Intentá nuevamente."));
        } finally {
            setEliminando(false);
        }
    };

    return <section className="mb-5" aria-labelledby="titulo-productos">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <h1 id="titulo-productos" className="mb-0">Productos de Stockify</h1>
            <Link className="btn btn-primary" to="/productos/nuevo">Nuevo producto</Link>
        </div>
        {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje("")} closeLabel="Cerrar mensaje">{mensaje}</Alert>}
        {consulta.cargando ? <div role="status"><Spinner animation="border" size="sm" aria-hidden="true" /> Cargando productos…</div>
            : consulta.error ? <Alert variant="danger">
                <p>{consulta.error}</p>
                <Button variant="outline-danger" onClick={reintentar}>Reintentar</Button>
            </Alert>
            : consulta.productos.length === 0 ? <Alert variant="info">Todavía no hay productos. Seleccioná «Nuevo producto» para agregar el primero.</Alert>
            : <Table responsive striped bordered hover className="align-middle">
                <caption>Inventario de productos registrados en Stockify.</caption>
                <thead>
                    <tr><th scope="col">Nombre</th><th scope="col">Descripción</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Categoría</th><th scope="col">Acciones</th></tr>
                </thead>
                <tbody>
                    {consulta.productos.map(producto => <tr key={producto._id}>
                        <th scope="row">{producto.nombre}</th>
                        <td>{producto.descripcion || "Sin descripción"}</td>
                        <td className="text-nowrap">{formatoPrecio.format(producto.precio)}</td>
                        <td>{producto.cantidad}</td>
                        <td>{producto.categoria || "Sin categoría"}</td>
                        <td>
                            <div className="d-flex gap-2">
                                <Link className="btn btn-outline-primary btn-sm" to={`/productos/${encodeURIComponent(producto._id)}/editar`} aria-label={`Editar ${producto.nombre}`}>Editar</Link>
                                <Button variant="outline-danger" size="sm" disabled={eliminando} aria-label={`Eliminar ${producto.nombre}`} onClick={() => {
                                    setSeleccionado(producto);
                                    setErrorEliminacion("");
                                }}>Eliminar</Button>
                            </div>
                        </td>
                    </tr>)}
                </tbody>
            </Table>}
        <Modal show={seleccionado !== null} onHide={cerrarModal} backdrop={eliminando ? "static" : true} keyboard={!eliminando} aria-labelledby="titulo-eliminar" centered>
            <Modal.Header closeButton={!eliminando} closeLabel="Cerrar confirmación">
                <Modal.Title id="titulo-eliminar">Eliminar producto</Modal.Title>
            </Modal.Header>
            <Modal.Body aria-busy={eliminando}>
                <p>¿Querés eliminar el producto <strong>{seleccionado?.nombre}</strong>?</p>
                <p className="mb-0">Esta acción no se puede deshacer.</p>
                {errorEliminacion && <Alert variant="danger" className="mt-3" role="alert">{errorEliminacion}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" disabled={eliminando} onClick={cerrarModal}>Cancelar</Button>
                <Button variant="danger" disabled={eliminando} onClick={confirmarEliminacion}>
                    {eliminando && <Spinner size="sm" aria-hidden="true" className="me-2" />}
                    {eliminando ? "Eliminando…" : "Confirmar eliminación"}
                </Button>
            </Modal.Footer>
        </Modal>
    </section>;
};

export default ListaProductos;