import axios from "axios";
import type { NuevoProducto, Producto } from "../types/Producto"

const BASE_URL = "http://localhost:3000/productos";
export const obtenerProductos = async (): Promise<Producto[]> => {

    const respuesta = await axios.get<Producto[]>(BASE_URL);
    return respuesta.data;
}

export const crearProducto = async (datos: NuevoProducto): Promise<Producto> => {
    const respuesta = await axios.post<Producto>(BASE_URL, datos);
    return respuesta.data;
}


export const actualizarProducto = async (id: string, datos: NuevoProducto): Promise<Producto> => {
    const respuesta = await axios.put<Producto>(`${BASE_URL}/${id}`, datos);
    return respuesta.data;
}
export const obtenerProductoPorId = async (id: string): Promise<Producto> => {
    const respuesta = await axios.get<Producto>(`${BASE_URL}/${id}`);
    return respuesta.data;
}