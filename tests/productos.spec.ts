import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { NuevoProducto, Producto } from "../src/types/Producto";

const producto: Producto = {
    _id: "producto-prueba", nombre: "Teclado de prueba", descripcion: "Descripción de prueba",
    precio: 1000, cantidad: 3, categoria: "Accesorios",
};

async function simularApi(page: Page, iniciales: Producto[] = [producto]) {
    let productos = iniciales.map(item => ({ ...item }));
    const operaciones: { metodo: string; datos?: NuevoProducto }[] = [];
    await page.route("http://localhost:3000/productos**", async route => {
        const solicitud = route.request();
        const metodo = solicitud.method();
        const id = new URL(solicitud.url()).pathname.split("/")[2];
        if (metodo === "OPTIONS") return route.fulfill({ status: 204 });
        operaciones.push({ metodo, datos: metodo === "POST" || metodo === "PUT" ? solicitud.postDataJSON() : undefined });
        if (metodo === "GET") {
            const encontrado = productos.find(item => item._id === id);
            return route.fulfill({ status: id && !encontrado ? 404 : 200, json: id ? encontrado ?? {} : productos });
        }
        if (metodo === "POST") {
            const nuevo = { ...solicitud.postDataJSON(), _id: "producto-nuevo" };
            productos.push(nuevo);
            return route.fulfill({ status: 201, json: nuevo });
        }
        if (metodo === "PUT") {
            const actualizado = { ...solicitud.postDataJSON(), _id: id };
            productos = productos.map(item => item._id === id ? actualizado : item);
            return route.fulfill({ json: actualizado });
        }
        if (metodo === "DELETE") {
            productos = productos.filter(item => item._id !== id);
            return route.fulfill({ status: 204 });
        }
        return route.abort();
    });
    return operaciones;
}

test("mostrar productos y acciones del listado", async ({ page }) => {
    await simularApi(page);
    await page.goto("/productos");
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nuevo producto", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: `Editar ${producto.nombre}` })).toBeVisible();
});

test("bloquear campos inválidos y permitir opcionales vacíos", async ({ page }) => {
    const operaciones = await simularApi(page, []);
    await page.goto("/productos/nuevo");
    await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
    await expect(page.getByText("El nombre es obligatorio")).toBeVisible();
    await expect(page.getByText("El precio debe ser mayor que 0")).toBeVisible();
    await page.getByLabel("Nombre", { exact: true }).fill("   ");
    await page.getByLabel("Precio", { exact: true }).fill("100");
    await page.getByLabel("Cantidad", { exact: true }).fill("-1");
    await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
    await expect(page.getByText("La cantidad no puede ser negativa")).toBeVisible();
    expect(operaciones.some(item => item.metodo === "POST")).toBe(false);
    await page.getByLabel("Nombre", { exact: true }).fill("  Mouse de prueba  ");
    await page.getByLabel("Cantidad", { exact: true }).fill("0");
    await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
    await expect(page).toHaveURL("/productos");
    await expect(page.getByText("Producto creado correctamente.")).toBeVisible();
    expect(operaciones.find(item => item.metodo === "POST")?.datos).toEqual({ nombre: "Mouse de prueba", precio: 100, cantidad: 0 });
});

test("validar mínimos de texto y números enteros", async ({ page }) => {
    await simularApi(page);
    await page.goto("/productos/nuevo");
    await page.getByLabel("Nombre", { exact: true }).fill("ab");
    await page.getByLabel("Descripción (opcional)").fill("abc");
    await page.getByLabel("Categoría (opcional)").fill("abc");
    await page.getByLabel("Precio", { exact: true }).fill("1.5");
    await page.getByLabel("Cantidad", { exact: true }).fill("1.5");
    await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
    await expect(page.getByText("El nombre debe tener al menos 3 caracteres")).toBeVisible();
    await expect(page.getByText("La descripción debe tener al menos 5 caracteres")).toBeVisible();
    await expect(page.getByText("La categoría debe tener al menos 5 caracteres")).toBeVisible();
    await expect(page.getByText("El precio debe ser entero")).toBeVisible();
    await expect(page.getByText("La cantidad debe ser entera")).toBeVisible();
});

test("precargar y editar un producto sin enviar campos internos", async ({ page }) => {
    const operaciones = await simularApi(page);
    await page.goto("/productos/producto-prueba/editar");
    await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(producto.nombre);
    await expect(page.getByLabel("Precio", { exact: true })).toHaveValue("1000");
    await page.getByLabel("Nombre", { exact: true }).fill("Teclado actualizado");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(page).toHaveURL("/productos");
    await expect(page.getByText("Producto actualizado correctamente.")).toBeVisible();
    await expect(page.getByRole("rowheader", { name: "Teclado actualizado" })).toBeVisible();
    expect(operaciones.find(item => item.metodo === "PUT")?.datos).not.toHaveProperty("_id");
});

test("conservar el formulario y mostrar errores al fallar el guardado", async ({ page }) => {
    await simularApi(page);
    await page.route("http://localhost:3000/productos/producto-prueba", async (route, request) => {
        if (request.method() === "PUT") return route.fulfill({ status: 500, json: {} });
        await route.fallback();
    });
    await page.goto("/productos/producto-prueba/editar");
    await page.getByLabel("Nombre", { exact: true }).fill("Producto que no se guardó");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(page.getByRole("alert")).toContainText("No se pudo guardar el producto");
    await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Producto que no se guardó");
    await expect(page.getByRole("button", { name: "Guardar cambios" })).toBeEnabled();
});

test("cancelar la eliminación sin enviar DELETE", async ({ page }) => {
    const operaciones = await simularApi(page);
    await page.goto("/productos");
    await page.getByRole("button", { name: `Eliminar ${producto.nombre}`, exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText(producto.nombre);
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    expect(operaciones.some(item => item.metodo === "DELETE")).toBe(false);
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
});

test("confirmar eliminación y actualizar el listado sin recargar", async ({ page }) => {
    const operaciones = await simularApi(page);
    await page.goto("/productos");
    await page.getByRole("button", { name: `Eliminar ${producto.nombre}`, exact: true }).click();
    await page.getByRole("button", { name: "Confirmar eliminación" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText("Todavía no hay productos.", { exact: false })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "se eliminó correctamente" })).toBeVisible();
    expect(operaciones.filter(item => item.metodo === "DELETE")).toHaveLength(1);
});

test("mantener el producto y permitir reintentar si falla DELETE", async ({ page }) => {
    await simularApi(page);
    let falla = true;
    await page.route("http://localhost:3000/productos/producto-prueba", async (route, request) => {
        if (request.method() === "DELETE" && falla) return route.fulfill({ status: 500, json: {} });
        await route.fallback();
    });
    await page.goto("/productos");
    await page.getByRole("button", { name: `Eliminar ${producto.nombre}`, exact: true }).click();
    await page.getByRole("button", { name: "Confirmar eliminación" }).click();
    await expect(page.getByRole("dialog").getByRole("alert")).toContainText("No se pudo eliminar");
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
    falla = false;
    await page.getByRole("button", { name: "Confirmar eliminación" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("mostrar carga y bloquear botones durante una eliminación", async ({ page }) => {
    await simularApi(page);
    let liberar: (() => void) | undefined;
    const espera = new Promise<void>(resolve => { liberar = resolve; });
    await page.route("http://localhost:3000/productos/producto-prueba", async (route, request) => {
        if (request.method() === "DELETE") await espera;
        await route.fallback();
    });
    await page.goto("/productos");
    await page.getByRole("button", { name: `Eliminar ${producto.nombre}`, exact: true }).click();
    await page.getByRole("button", { name: "Confirmar eliminación" }).click();
    await expect(page.getByRole("button", { name: "Eliminando…" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Cancelar", exact: true })).toBeDisabled();
    liberar?.();
    await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("informar desconexión y recuperar el listado al reintentar", async ({ page }) => {
    await simularApi(page);
    let falla = true;
    await page.route("http://localhost:3000/productos", async route => {
        if (falla) return route.abort();
        await route.fallback();
    });
    await page.goto("/productos");
    await expect(page.getByRole("alert")).toContainText("No se pudo conectar con Stockify");
    falla = false;
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
});

test("mostrar producto inexistente y permitir volver al listado", async ({ page }) => {
    await simularApi(page, []);
    await page.goto("/productos/inexistente/editar");
    await expect(page.getByRole("alert")).toContainText("El producto no existe o ya fue eliminado");
    await page.getByRole("link", { name: "Volver al listado" }).click();
    await expect(page).toHaveURL("/productos");
});

test("navegar a Cursos desde productos y usar el menú móvil", async ({ page }) => {
    await simularApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/productos");
    await page.getByRole("button", { name: "Abrir o cerrar navegación" }).click();
    await page.getByRole("link", { name: "Cursos", exact: true }).click();
    await expect(page).toHaveURL("/#cursos");
    await expect(page.getByRole("heading", { name: "Nuestros cursos" })).toBeInViewport();
    await expect(page.getByRole("button", { name: "Abrir o cerrar navegación" })).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("mostrar una página de error para rutas inexistentes", async ({ page }) => {
    await page.goto("/direccion-inexistente");
    await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page.getByRole("heading", { name: "Pilar Tecno", exact: true })).toBeVisible();
});

test("mostrar el estado de carga antes de recibir productos", async ({ page }) => {
    await simularApi(page);
    let liberar: (() => void) | undefined;
    const espera = new Promise<void>(resolve => { liberar = resolve; });
    await page.route("http://localhost:3000/productos", async route => {
        await espera;
        await route.fallback();
    });
    await page.goto("/productos");
    await expect(page.getByRole("status")).toContainText("Cargando productos");
    liberar?.();
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
});

test("bloquear el formulario y evitar envíos duplicados mientras guarda", async ({ page }) => {
    const operaciones = await simularApi(page);
    let liberar: (() => void) | undefined;
    const espera = new Promise<void>(resolve => { liberar = resolve; });
    await page.route("http://localhost:3000/productos/producto-prueba", async (route, request) => {
        if (request.method() === "PUT") await espera;
        await route.fallback();
    });
    await page.goto("/productos/producto-prueba/editar");
    await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(producto.nombre);
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(page.getByRole("button", { name: "Guardando…" })).toBeDisabled();
    await expect(page.getByLabel("Nombre", { exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Volver al listado" })).toBeDisabled();
    liberar?.();
    await expect(page).toHaveURL("/productos");
    expect(operaciones.filter(item => item.metodo === "PUT")).toHaveLength(1);
});

test("mantener el listado y el formulario adaptables en una pantalla móvil", async ({ page }) => {
    await simularApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/productos");
    await expect(page.getByRole("rowheader", { name: producto.nombre })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath("listado-movil.png"), fullPage: true });
    await page.getByRole("link", { name: "Nuevo producto", exact: true }).click();
    await expect(page.getByLabel("Nombre", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath("formulario-movil.png"), fullPage: true });
});
