import { expect, test } from "@playwright/test";
import type { Producto } from "../src/types/Producto";

test("crear, consultar, editar y eliminar únicamente un producto temporal en Stockify", async ({ page, request }) => {
    test.skip(process.env.STOCKIFY_PRUEBAS_REALES !== "1", "Requiere autorización explícita mediante STOCKIFY_PRUEBAS_REALES=1 y Stockify local disponible.");
    const api = "http://localhost:3000/productos";
    const marca = `Prueba temporal Pilar Tecno ${Date.now()}`;
    const listadoInicial = await request.get(api);
    expect(listadoInicial.ok()).toBe(true);
    const existentes = await listadoInicial.json() as Producto[];
    let idTemporal: string | undefined;
    let eliminado = false;
    try {
        await page.goto("/productos/nuevo");
        await page.getByLabel("Nombre", { exact: true }).fill(marca);
        await page.getByLabel("Descripción (opcional)").fill("Registro temporal creado por las pruebas del entregable");
        await page.getByLabel("Precio", { exact: true }).fill("2500");
        await page.getByLabel("Cantidad", { exact: true }).fill("2");
        await page.getByLabel("Categoría (opcional)").fill("Pruebas");
        const creacion = page.waitForResponse(respuesta => respuesta.url() === api && respuesta.request().method() === "POST");
        await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
        expect((await creacion).ok()).toBe(true);
        const lista = await (await request.get(api)).json() as Producto[];
        idTemporal = lista.find(item => item.nombre === marca)?._id;
        expect(idTemporal).toBeTruthy();
        expect(existentes.some(item => item._id === idTemporal)).toBe(false);
        await expect(page.getByRole("rowheader", { name: marca, exact: true })).toBeVisible();
        await page.getByRole("link", { name: `Editar ${marca}`, exact: true }).click();
        await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(marca);
        await page.getByLabel("Precio", { exact: true }).fill("3500");
        const modificacion = page.waitForResponse(respuesta => respuesta.request().method() === "PUT" && respuesta.url() === `${api}/${idTemporal}`);
        await page.getByRole("button", { name: "Guardar cambios" }).click();
        expect((await modificacion).ok()).toBe(true);
        await expect(page.getByText("Producto actualizado correctamente.")).toBeVisible();
        const obtenido = await request.get(`${api}/${idTemporal}`);
        expect(obtenido.ok()).toBe(true);
        expect((await obtenido.json()).precio).toBe(3500);
        await page.getByRole("button", { name: `Eliminar ${marca}`, exact: true }).click();
        await page.getByRole("button", { name: "Cancelar", exact: true }).click();
        expect((await request.get(`${api}/${idTemporal}`)).ok()).toBe(true);
        await page.getByRole("button", { name: `Eliminar ${marca}`, exact: true }).click();
        const eliminacion = page.waitForResponse(respuesta => respuesta.request().method() === "DELETE" && respuesta.url() === `${api}/${idTemporal}`);
        await page.getByRole("button", { name: "Confirmar eliminación" }).click();
        expect((await eliminacion).ok()).toBe(true);
        eliminado = true;
        await expect(page.getByRole("rowheader", { name: marca, exact: true })).toHaveCount(0);
        const finales = await (await request.get(api)).json() as Producto[];
        expect(finales.some(item => item._id === idTemporal)).toBe(false);
        for (const existente of existentes) {
            expect(finales.find(item => item._id === existente._id)).toEqual(existente);
        }
    } finally {
        if (!eliminado) {
            const respuesta = await request.get(api);
            if (respuesta.ok()) {
                const productos = await respuesta.json() as Producto[];
                const temporal = productos.find(item => item.nombre === marca && !existentes.some(existente => existente._id === item._id));
                if (temporal) {
                    const limpieza = await request.delete(`${api}/${temporal._id}`);
                    expect(limpieza.ok(), `No se pudo limpiar el registro temporal ${temporal._id}`).toBe(true);
                }
            }
        }
    }
});