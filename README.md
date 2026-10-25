# Pilar Tecno

Proyecto universitario desarrollado con React, TypeScript y Vite. Presenta una página de cursos con navegación adaptable, componentes reutilizables y un modal para personalizar el color de un título.

## Tecnologías

- React y TypeScript.
- Vite para desarrollo y compilación.
- React-Bootstrap y Bootstrap para los componentes y el diseño adaptable.

## Instalación y ejecución

Necesitás Node.js y npm, con una versión de Node.js compatible con Vite 8.

```bash
git clone https://github.com/SSebastianLoreiro/landing-pilar-tecno.git
cd landing-pilar-tecno
npm ci
npm run dev
```

Abrí en el navegador la dirección que indique Vite en la terminal.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Verifica TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Permite revisar localmente la compilación de producción. |
| `npm run lint` | Ejecuta el análisis estático con ESLint. |

## Funcionalidades

- Barra de navegación adaptable con menú desplegable en pantallas pequeñas.
- Distribución del contenido con `Container`, `Row` y `Col`.
- Presentación de cursos mediante componentes con propiedades tipadas.
- Estado con `useState` para abrir y cerrar el modal y actualizar el color del título.
- Modal de React-Bootstrap controlado mediante `show` y `onHide`.

## Estructura del proyecto

```text
public/                    Recursos públicos
src/
  assets/                  Imágenes y recursos
  components/
    BarraNavegacion/        Navegación principal
    BotonColor/            Personalización del título mediante un modal
    SeccionBienvenida/     Bienvenida con propiedades tipadas
    TarjetaCurso/          Tarjeta de curso con propiedades tipadas
    CursoItem/             Elemento de lista con acción de eliminación
    Footer/                Ejemplo de búsqueda, eliminación y modal propio
    Header/                Ejemplo de contador y efectos
    Modal/                 Ejemplo de modal propio
    Saludo/                Ejemplo de renderizado condicional
    Temporizador/          Ejemplo de estado y temporizador
  App.tsx                  Composición de la página
  main.tsx                 Punto de entrada e importación de Bootstrap
```

`App.tsx` muestra la barra de navegación, la bienvenida, la personalización de color y las tarjetas de cursos. Los otros componentes se conservan como ejemplos de práctica y no se muestran en la página actual.

## Organización del historial

El proyecto existente se organizó por funcionalidades mediante commits convencionales y ramas:

- `feature/proyecto-inicial`: configuración, dependencias y recursos iniciales.
- `feature/navbar`: barra de navegación adaptable.
- `feature/layout`: distribución del contenido con Bootstrap.
- `feature/componentes-props`: componentes tipados y ejemplos de estado.
- `feature/modal`: personalización de color y ejemplos de modal.

Todas las funcionalidades están integradas en `main`. Los mensajes están escritos en español y conservan prefijos convencionales como `chore`, `feat` y `docs`.

## Archivos excluidos

El archivo `.gitignore` excluye dependencias instaladas, compilaciones, registros, cachés locales y archivos habituales de credenciales, como `.env` y claves privadas. `package-lock.json` se conserva para instalar las dependencias de forma reproducible.
