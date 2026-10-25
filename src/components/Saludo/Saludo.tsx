const Saludo = () => {
    const esDeNoche = new Date().getHours() >= 20;
    const hayCursos = true;

    return <>
        {esDeNoche ? (<p>Buenas noches</p>) : (<p>Buenos dias</p>)}
        {hayCursos && <p>Hay cursos disponibles!</p>}
    </>
}

export default Saludo;