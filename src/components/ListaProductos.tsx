import { useState, useEffect } from "react";
import type { Producto } from "../types/Producto";
import { obtenerProductos } from "../services/ProductoService";

const ListaProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const cargarProductos = async () => {
        setProductos(await obtenerProductos());
    }
    useEffect(() => {
        cargarProductos();
    }, []);
    return <div>
        <h2>Productos de Stockify</h2>
        {productos.map(producto => (
            <div key={producto._id}>
                <h3>{producto.nombre}</h3>
                <p>Precio: ${producto.precio}</p>
                <p>Stock: {producto.cantidad}</p>
            </div>
        ))}
    </div>
}

export default ListaProductos;

