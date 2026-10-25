import { useEffect, useState } from "react";

const Header = () => {
    const [contador, setContador] = useState(0);
    useEffect(() => {
        console.log("El componente Header se montó")
    }, []);
    useEffect(() => {
        console.log("El valor del contador es: ", contador);
    }, [contador]);
    useEffect(() => {
        document.title = `Clics: ${contador}`
    }, [contador]);
    const handleClick = () => {
        setContador(contador + 1);
    }
    return <>
        <h1>Clase 7 de React!</h1>
        <button onClick={handleClick}>Contador: {contador}</button>
    </>
}


export default Header;