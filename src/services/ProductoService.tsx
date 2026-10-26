import axios from "axios";
import type { NuevoProducto, Producto } from "../types/Producto";

const BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:3000/productos").replace(/\/+$/, "");
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const obtenerProductos = async (signal?: AbortSignal): Promise<Producto[]> => {
    const respuesta = await api.get<Producto[]>("", { signal });
    return respuesta.data;
};

export const crearProducto = async (datos: NuevoProducto): Promise<Producto> => {
    const respuesta = await api.post<Producto>("", datos);
    return respuesta.data;
};

export const actualizarProducto = async (id: string, datos: NuevoProducto): Promise<Producto> => {
    const respuesta = await api.put<Producto>(`/${encodeURIComponent(id)}`, datos);
    return respuesta.data;
};

export const obtenerProductoPorId = async (id: string, signal?: AbortSignal): Promise<Producto> => {
    const respuesta = await api.get<Producto>(`/${encodeURIComponent(id)}`, { signal });
    return respuesta.data;
};

export const obtenerMensajeError = (error: unknown, mensaje: string): string => {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "No se pudo conectar con Stockify. Verificá que la API esté disponible e intentá nuevamente.";
        }
        if (error.response.status === 404) return "El producto no existe o ya fue eliminado.";
        if (error.response.status === 400 || error.response.status === 422) {
            return "El servidor rechazó los datos. Revisá los campos e intentá nuevamente.";
        }
        if (error.response.status === 401 || error.response.status === 403) {
            return "No tenés permiso para realizar esta operación.";
        }
    }
    return mensaje;
};