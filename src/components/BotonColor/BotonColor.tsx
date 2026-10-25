import React, { useState } from "react"
import { Button, Modal } from "react-bootstrap"

const BotonColor = () => {
    const [mostrarModal, setMostrarModal] = useState(false);

    const setModalTrue = () => {
        setMostrarModal(true);
    }
    const setModalFalse = () => {
        setMostrarModal(false);
    }

    const [colorTitulo, setColorTitulo] = useState("#1B2A4A");

    const cambiarColorTitulo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColorTitulo(event.target.value);
    }


    return <>

        <h2 style={{ color: colorTitulo }}>Titulo para modificar</h2>
        <Button onClick={setModalTrue}>Personalizar</Button>
        <Modal show={mostrarModal} onHide={setModalFalse}>
            <Modal.Header>
                <Modal.Title>Elegí un Color</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Seleccioná tu color favorito</p>
                <input type="color" value={colorTitulo} onChange={cambiarColorTitulo} />
            </Modal.Body>
            <Modal.Footer><Button onClick={setModalFalse}>Cerrar</Button></Modal.Footer>
        </Modal>
    </>
}

export default BotonColor;