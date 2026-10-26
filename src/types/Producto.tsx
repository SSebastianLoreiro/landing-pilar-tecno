export type Producto = {
    _id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    cantidad: number;
    categoria?: string;
    fechaIngreso?: string;
};

export type NuevoProducto = Omit<Producto, "_id" | "fechaIngreso">;