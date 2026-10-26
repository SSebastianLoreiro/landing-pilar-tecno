import { useState } from "react";
import { useFormik } from "formik";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import type { NuevoProducto } from "../types/Producto";
import { crearProducto, obtenerMensajeError } from "../services/ProductoService";
import { productoSchema } from "../validations/productoSchema";

type FormularioProductoProps = {
    valoresIniciales?: NuevoProducto;
    onGuardar?: (datos: NuevoProducto) => Promise<unknown>;
    modo?: "crear" | "editar";
};

const productoVacio: NuevoProducto = {
    nombre: "", descripcion: "", precio: 0, cantidad: 0, categoria: "",
};

const FormularioProducto = ({ valoresIniciales, onGuardar = crearProducto, modo = "crear" }: FormularioProductoProps) => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const formik = useFormik<NuevoProducto>({
        initialValues: valoresIniciales ?? productoVacio,
        enableReinitialize: true,
        validationSchema: productoSchema,
        onSubmit: async (valores) => {
            setError("");
            try {
                const datos = await productoSchema.validate(valores, { stripUnknown: true });
                await onGuardar(datos);
                navigate("/productos", {
                    replace: true,
                    state: { mensaje: modo === "editar" ? "Producto actualizado correctamente." : "Producto creado correctamente." },
                });
            } catch (causa) {
                setError(obtenerMensajeError(causa, "No se pudo guardar el producto. Intentá nuevamente."));
            }
        },
    });

    const campos: { nombre: keyof NuevoProducto; etiqueta: string; tipo: "text" | "number"; obligatorio?: boolean }[] = [
        { nombre: "nombre", etiqueta: "Nombre", tipo: "text", obligatorio: true },
        { nombre: "descripcion", etiqueta: "Descripción (opcional)", tipo: "text" },
        { nombre: "precio", etiqueta: "Precio", tipo: "number", obligatorio: true },
        { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number", obligatorio: true },
        { nombre: "categoria", etiqueta: "Categoría (opcional)", tipo: "text" },
    ];

    return <section className="mx-auto mb-5" style={{ maxWidth: 760 }} aria-labelledby="titulo-formulario">
        <h1 id="titulo-formulario">{modo === "editar" ? "Editar producto" : "Nuevo producto"}</h1>
        <p>Completá los campos obligatorios: nombre, precio y cantidad.</p>
        {error && <Alert variant="danger" role="alert">{error}</Alert>}
        <Form noValidate onSubmit={formik.handleSubmit} aria-busy={formik.isSubmitting}>
            <fieldset disabled={formik.isSubmitting}>
                <Row className="g-3">
                    {campos.map(({ nombre, etiqueta, tipo, obligatorio }) => {
                        const invalido = Boolean(formik.touched[nombre] && formik.errors[nombre]);
                        return <Col xs={12} md={tipo === "number" ? 6 : 12} key={nombre}>
                            <Form.Group controlId={nombre}>
                                <Form.Label>{etiqueta}</Form.Label>
                                <Form.Control
                                    name={nombre}
                                    type={tipo}
                                    value={formik.values[nombre] ?? ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required={obligatorio}
                                    min={tipo === "number" ? (nombre === "precio" ? 1 : 0) : undefined}
                                    step={tipo === "number" ? 1 : undefined}
                                    isInvalid={invalido}
                                    aria-invalid={invalido}
                                    aria-describedby={invalido ? `${nombre}-error` : undefined}
                                />
                                <Form.Control.Feedback type="invalid" id={`${nombre}-error`}>
                                    {formik.errors[nombre]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>;
                    })}
                </Row>
                <div className="d-flex flex-wrap gap-2 mt-4">
                    <Button type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <Spinner size="sm" aria-hidden="true" className="me-2" />}
                        {formik.isSubmitting ? "Guardando…" : modo === "editar" ? "Guardar cambios" : "Guardar producto"}
                    </Button>
                    <Button type="button" variant="outline-secondary" onClick={() => navigate("/productos")}>
                        Volver al listado
                    </Button>
                </div>
            </fieldset>
        </Form>
        {error && <Link className="d-inline-block mt-3" to="/productos">Volver al listado sin guardar</Link>}
    </section>;
};

export default FormularioProducto;