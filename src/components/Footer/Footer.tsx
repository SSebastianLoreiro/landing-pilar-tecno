import { useState } from "react";
import CursoItem from "../CursoItem/CursoItem";
import Modal from "../Modal/Modal";

const Footer = () => {

    const [tareas, setTareas] = useState([{ id: 1, nombre: "Estudiar React" },
    { id: 2, nombre: "Estudiar Node.js" },
    { id: 3, nombre: "Practicar TypeScript" },
    { id: 4, nombre: "Hacer Ejercicios" },
    { id: 5, nombre: "Subir proyecto a GitHub" }]);
    const [buscador, setBuscador] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuscador(event.target.value);
    }
    const tareasFiltradas = tareas.filter(tarea => tarea.nombre.toLowerCase().includes(buscador.toLowerCase()));
    const handleEliminar = (id: number) => {
        setTareas(tareas.filter(tarea => tarea.id !== id));
    }

    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = () => {
        setMostrarModal(true);
    }
    const cerrarModal = () => {
        setMostrarModal(false);
    }
    return <>
        <h3>Footer</h3>

        <p>Estas buscando: {buscador}</p>
        <input type="text" value={buscador} onChange={handleChange} />
        <p>cursos:</p>
        <ul>
            {tareasFiltradas.map(tarea => (
                <CursoItem key={tarea.id} id={tarea.id} nombre={tarea.nombre} onEliminar={handleEliminar} />
            ))}
        </ul>

        <button onClick={abrirModal}>Abrir modal</button>
        <Modal show={mostrarModal} onHide={cerrarModal} />
    </>
}

export default Footer;