type CursoItemProps = {
    id: number;
    nombre: string;
    onEliminar: (id: number) => void;
};


const CursoItem = ({ id, nombre, onEliminar }: CursoItemProps) => {
    return <li>Curso #{id}: {nombre} <button onClick={() => { onEliminar(id) }}>Eliminar</button></li>;
}

export default CursoItem;