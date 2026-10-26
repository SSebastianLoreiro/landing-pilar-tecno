# Pilar Tecno — Segundo entregable de React

Aplicación universitaria desarrollada con React, TypeScript y Vite. Conserva la página de cursos del primer entregable e incorpora la gestión de productos de **Stockify**, una API existente con Node.js, Express, MongoDB y Mongoose.

Todo el contenido de la interfaz y la documentación se mantiene en español de Argentina.

## Funcionalidades

- Página de inicio con cursos y personalización del color de un título.
- Barra de navegación adaptable, con acceso a los cursos desde cualquier página.
- Listado de productos reales en una tabla adaptable.
- Creación y edición con un mismo formulario reutilizable.
- Carga del producto seleccionado por su identificador.
- Eliminación mediante un modal que muestra el nombre y permite cancelar.
- Actualización del listado después de eliminar, sin recargar la página.
- Mensajes de éxito, validaciones, errores de conexión y errores del servidor.
- Indicadores de carga y botones deshabilitados durante el guardado o la eliminación.
- Mensajes para inventario vacío, producto inexistente y rutas no encontradas.

## Tecnologías y requisitos

- React, TypeScript y Vite.
- React-Bootstrap y Bootstrap para la interfaz.
- React Router para la navegación.
- Axios para las peticiones HTTP.
- Formik y Yup para los formularios y sus validaciones.
- Playwright como herramienta de desarrollo para las pruebas de navegador.

Necesitás Node.js **20.19 o superior dentro de la versión 20**, o **22.12 o superior**, según los requisitos de Vite 8, y npm. Para esta entrega se utilizó Node.js 24.

La API Stockify se ejecuta por separado. Este repositorio no contiene otro servidor ni reemplaza el backend existente.

## Instalación

```bash
git clone https://github.com/SSebastianLoreiro/landing-pilar-tecno.git
cd landing-pilar-tecno
npm ci
```

## Configuración de Stockify

1. Iniciá tu proyecto Stockify con el comando definido en su propio `package.json`.
2. Verificá que MongoDB esté disponible y que la API responda en `http://localhost:3000/productos`.
3. Permití mediante CORS el origen donde ejecutes este frontend. Vite utiliza normalmente `http://localhost:5173`; las pruebas usan `http://127.0.0.1:4174`.

Para consultar la API desde PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/productos
```

Las credenciales de MongoDB pertenecen a la configuración privada del backend. No deben incluirse en React ni en este repositorio.

## Variables de entorno

La aplicación funciona por defecto con `http://localhost:3000/productos`. Si necesitás cambiarlo, copiá el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Configurá la URL completa de la colección de productos:

```dotenv
VITE_API_URL=http://localhost:3000/productos
```

Reiniciá Vite después de modificar esta variable. Las variables con prefijo `VITE_` son públicas y quedan disponibles en el navegador: **no deben contener contraseñas, claves ni credenciales**.

El archivo `.env` está excluido de Git; `.env.example` contiene únicamente una dirección de ejemplo.

## Ejecución

```bash
npm run dev
```

Abrí la dirección que indique Vite en la terminal. Mantené Stockify y MongoDB en ejecución para utilizar los productos reales.

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Verifica los tipos de la aplicación, configuración y pruebas; genera la versión de producción en `dist/`. |
| `npm run preview` | Permite revisar la compilación de producción en un servidor local. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm test` | Ejecuta las pruebas de interfaz con respuestas de API simuladas, sin modificar Stockify. |
| `npm run test:api` | Ejecuta la prueba real solo si se habilita expresamente mediante la variable indicada más abajo. |

## Uso y rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Página inicial del primer entregable. |
| `/#cursos` | Sección de cursos. |
| `/productos` | Inventario y acciones de edición y eliminación. |
| `/productos/nuevo` | Formulario para crear un producto. |
| `/productos/:id/editar` | Formulario precargado para editar el producto seleccionado. |

Para crear, seleccioná **Nuevo producto**, completá el formulario y elegí **Guardar producto**. Para modificar, seleccioná **Editar** y luego **Guardar cambios**. Al guardar correctamente, la aplicación vuelve al listado con un mensaje de éxito.

Para eliminar, seleccioná **Eliminar**, revisá el nombre del producto y elegí **Confirmar eliminación**. **Cancelar** cierra el modal sin enviar DELETE. Una eliminación confirmada no se puede deshacer.

Para alojar la aplicación en un servidor estático, configurá el servidor para devolver `index.html` ante rutas de React Router. Publicar el código en GitHub no despliega automáticamente el frontend ni la API.

## Modelo y validaciones

Se conservan los tipos existentes `Producto` y `NuevoProducto` en `src/types/Producto.tsx`.

| Campo | Regla del formulario |
| --- | --- |
| `nombre` | Obligatorio, con al menos 3 caracteres después de quitar espacios en los extremos. |
| `descripcion` | Opcional; si se completa, debe tener al menos 5 caracteres. |
| `precio` | Obligatorio, numérico, entero y mayor que cero. |
| `cantidad` | Obligatoria, numérica, entera y no negativa. |
| `categoria` | Opcional; si se completa, debe tener al menos 5 caracteres. |

Se conserva la validación existente de precio entero. Los campos opcionales vacíos se omiten al enviar. `_id` y `fechaIngreso` son administrados por el backend y no se envían desde el formulario.

Formik administra los valores, los campos visitados y el estado de envío. El formulario admite valores iniciales y utiliza `enableReinitialize`. Yup valida tanto la creación como la edición.

## Comunicación con la API

| Método | Endpoint | Función |
| --- | --- | --- |
| GET | `/productos` | `obtenerProductos()` |
| GET | `/productos/:id` | `obtenerProductoPorId(id)` |
| POST | `/productos` | `crearProducto(datos)` |
| PUT | `/productos/:id` | `actualizarProducto(id, datos)` |
| DELETE | `/productos/:id` | `eliminarProducto(id)` |

Las peticiones utilizan Axios, un tiempo máximo de espera de 10 segundos y mensajes de error en español. Las consultas de páginas se cancelan cuando el componente se desmonta o cambia el identificador, para evitar mostrar respuestas anteriores.

El contrato esperado es un arreglo de productos para el listado y un producto para las consultas individuales, creación y actualización. La eliminación admite una respuesta sin contenido.

## Estructura

```text
src/
  assets/                       Recursos de la página inicial
  components/
    BarraNavegacion/             Navegación principal
    BotonColor/                  Modal del primer entregable
    FormularioProducto.tsx      Formulario reutilizable de creación y edición
    ListaProductos.tsx          Inventario y confirmación de eliminación
    SeccionBienvenida/          Bienvenida con propiedades tipadas
    TarjetaCurso/               Cursos con propiedades tipadas
  pages/
    PaginaInicio.tsx            Página inicial y cursos
    PaginaProductos.tsx         Página del inventario
    PaginaCrearProducto.tsx     Alta de productos
    PaginaEditarProducto.tsx    Consulta y edición por identificador
  services/ProductoService.tsx  Peticiones a Stockify y mensajes de error
  types/Producto.tsx            Tipos Producto y NuevoProducto
  validations/productoSchema.ts Validaciones compartidas con Yup
  App.tsx                      Definición de rutas
  main.tsx                     Punto de entrada, Bootstrap y BrowserRouter
tests/
  productos.spec.ts            Pruebas de interfaz con API simulada
  stockify-real.spec.ts         Recorrido con un producto temporal real
playwright.config.ts           Configuración del navegador y servidor de pruebas
```

Los componentes auxiliares de práctica del primer entregable se conservan. No se reconstruyó la aplicación desde cero.

## Pruebas automatizadas

Para utilizar Chromium:

```bash
npx playwright install chromium
npm test
```

Si ya tenés Microsoft Edge instalado en Windows, podés usarlo sin descargar Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm test
```

Las pruebas de interfaz simulan la API y verifican listado, creación, edición, validaciones, estados pendientes, errores, cancelación, eliminación, navegación y adaptación a pantallas pequeñas.

### Prueba con la API real

Esta prueba crea un producto temporal, comprueba GET, POST, PUT y DELETE desde el navegador, y verifica que los productos que existían antes permanezcan sin cambios. No elimina registros preexistentes.

Por defecto se omite. Ejecutala únicamente contra tu Stockify local de pruebas, con MongoDB disponible:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
$env:STOCKIFY_PRUEBAS_REALES = "1"
npm run test:api
Remove-Item Env:STOCKIFY_PRUEBAS_REALES
```

El servidor de pruebas utiliza `http://127.0.0.1:4174`, debe tener ese puerto libre y se conecta a la API local `http://localhost:3000/productos`. El valor de `VITE_API_URL` se fija en la configuración de pruebas para evitar usar accidentalmente otra API.

Los resultados, capturas y trazas se guardan en `test-results/`, que está excluido de Git. Para verificar el segundo entregable consultá también [el informe de verificación](docs/segundo-entregable.md).

## Git y seguridad

El historial del primer entregable se conserva. Las incorporaciones del segundo se organizan en ramas de funcionalidad y se integran en `main` mediante commits de fusión. Los mensajes nuevos se redactan en español y mantienen los prefijos convencionales `feat`, `fix`, `test`, `docs` y `merge`.

No se versionan `node_modules/`, `dist/`, `.env`, credenciales, cachés ni resultados de pruebas. `package-lock.json` se conserva para instalar las dependencias de forma reproducible.