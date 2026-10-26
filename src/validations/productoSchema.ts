import * as Yup from "yup";

export const productoSchema = Yup.object({
    nombre: Yup.string().trim()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: Yup.string().trim().transform(valor => valor === "" ? undefined : valor)
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    precio: Yup.number()
        .typeError("El precio debe ser un número")
        .required("El precio es obligatorio")
        .integer("El precio debe ser entero")
        .positive("El precio debe ser mayor que 0"),
    cantidad: Yup.number()
        .typeError("La cantidad debe ser un número")
        .required("La cantidad es obligatoria")
        .integer("La cantidad debe ser entera")
        .min(0, "La cantidad no puede ser negativa"),
    categoria: Yup.string().trim().transform(valor => valor === "" ? undefined : valor)
        .min(5, "La categoría debe tener al menos 5 caracteres"),
});
