type SeccionBienvenidaProps = {
    titulo: string;
    descripcion: string;
}

const SeccionBienvenida = ({ titulo, descripcion }: SeccionBienvenidaProps) => {

    return <>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
    </>
}

export default SeccionBienvenida;