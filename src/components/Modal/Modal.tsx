type ModalProps = {
    show: boolean;
    onHide: () => void;
}

const Modal = ({ show, onHide }: ModalProps) => {
    if (!show) {
        return null;
    }
    return <>
        <div><h3>Modal</h3><p>Mensaje del modal</p><button onClick={onHide}>Cerrar Modal</button></div>
    </>
}

export default Modal;