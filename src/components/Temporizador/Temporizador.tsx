import { useState, useEffect } from "react";
const Temporizador = () => {
    const [segundo, setSegundos] = useState(0);
    const [activo, setActivo] = useState(true);
    const handleClick = () => {
        setSegundos(segundo + 1);
    };
    const detenerTemporizador = () => {
        setActivo(false);
    }
    const iniciarTemporizador = () => {
        setActivo(true);
    }
    const reiniciarTemporizador = () => {
        setSegundos(0);
    }
    useEffect(() => {
        if (activo == true) {
            let intervalo = setInterval(() => {
                setSegundos(anterior => anterior + 1)
            }, 1000)
            return () => {
                clearInterval(intervalo);
            }
        }
    }, [activo]);

    return <>
        <p>tiempo transcurrido</p>
        <h2>{segundo}</h2>
        <button onClick={handleClick}>Simular segundos</button>
        <button onClick={iniciarTemporizador}>Iniciar</button>
        <button onClick={detenerTemporizador}>Detener</button>
        <button onClick={reiniciarTemporizador}>Reiniciar</button>
    </>
}

export default Temporizador;