import { useFormik } from "formik";
import type { NuevoProducto } from "../types/Producto";
import * as Yup from "yup";
import { crearProducto } from "../services/ProductoService";

const productoSchema = Yup.object({
    nombre: Yup.string()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: Yup.string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    precio: Yup.number()
        .required("El precio es obligatorio")
        .integer("El precio debe ser entero")
        .positive("El precio debe ser mayor que 0"),
    cantidad: Yup.number()
        .required("La cantidad es obligatoria")
        .integer("La cantidad debe ser entera")
        .min(0, "La cantidad no puede ser negativa"),
    categoria: Yup.string()
        .min(5, "La categoria debe tener al menos 5 caracteres")
});

const FormularioProducto = () => {
    const formik = useFormik<NuevoProducto>({
        initialValues: {
            nombre: "",
            descripcion: "",
            precio: 0,
            cantidad: 0,
            categoria: ""
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                await crearProducto(values);
                console.log("submit exitoso");
                resetForm();
            } catch (error) {
                console.error(error);
            }
        },
        validationSchema: productoSchema,

    });
    return <> <h2>Crear Producto</h2>
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="nombre">Nombre</label>

            <input
                id="nombre"
                name="nombre"
                type="text"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.nombre && formik.errors.nombre && (
                <p className="text-danger">{formik.errors.nombre}</p>
            )}
            <label htmlFor="descripcion">Descripcion</label>
            <input
                id="descripcion"
                name="descripcion"
                type="text"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.descripcion && formik.errors.descripcion && (
                <p className="text-danger">{formik.errors.descripcion}</p>
            )}
            <label htmlFor="precio">precio</label>

            <input
                id="precio"
                name="precio"
                type="number"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.precio && formik.errors.precio && (
                <p className="text-danger">{formik.errors.precio}</p>
            )}
            <label htmlFor="cantidad">cantidad</label>

            <input
                id="cantidad"
                name="cantidad"
                type="number"
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.cantidad && formik.errors.cantidad && (
                <p className="text-danger">{formik.errors.cantidad}</p>
            )}
            <label htmlFor="categoria">categoria</label>

            <input
                id="categoria"
                name="categoria"
                type="text"
                value={formik.values.categoria}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.categoria && formik.errors.categoria && (
                <p className="text-danger">{formik.errors.categoria}</p>
            )}
            <button type="submit">Guardar producto</button>
        </form>
    </>
};

export default FormularioProducto;

