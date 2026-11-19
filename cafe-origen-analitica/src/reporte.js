const ventas = require("./datos");
const {
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia,
} = require("./analitica");

// ---------- Formato ----------
const ANCHO = 46;
const pesos = (n) => "$ " + Math.round(n).toLocaleString("es-CO");
const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const fila = (etiqueta, valor) => etiqueta.padEnd(ANCHO - 16) + String(valor).padStart(16);

function titulo(texto) {
    console.log("\n" + "=".repeat(ANCHO));
    console.log(texto.toUpperCase());
    console.log("=".repeat(ANCHO));
}

// ---------- Secciones ----------
function resumenGeneral(datos) {
    titulo("1. Resumen general");
    const mayor = ventaMayor(datos);
    console.log(fila("Total vendido", pesos(totalVendido(datos))));
    console.log(fila("Unidades vendidas", unidadesVendidas(datos).toLocaleString("es-CO")));
    console.log(fila("Ticket promedio", pesos(ticketPromedio(datos))));
    console.log(fila(
        "Venta mayor",
        mayor ? `#${mayor.id} · ${pesos(mayor.cantidad * mayor.precio)}` : "Sin ventas"
    ));
}

function seccionCiudades(datos) {
    titulo("2. Ventas por ciudad");
    const filas = Object.entries(totalPorCiudad(datos)).sort((a, b) => b[1] - a[1]);
    for (const [ciudad, total] of filas) console.log(fila(capitalizar(ciudad), pesos(total)));
}

function seccionProductos(datos) {
    titulo("3. Unidades por producto");
    console.table(
        Object.entries(unidadesPorProducto(datos))
            .sort((a, b) => b[1] - a[1])
            .map(([producto, unidades]) => ({ Producto: producto, Unidades: unidades }))
    );
}

function seccionTop(datos, k) {
    titulo(`4. Top ${k} productos por valor`);
    topProductosPorValor(datos, k).forEach((p, i) => console.log(`${i + 1}. ${p}`));
}

function resumenDia(datos, fecha) {
    const d = ventasDelDia(datos, fecha);
    console.log(`\nDía ${fecha}`);
    if (d.ventasValidas === 0) console.log("  (sin ventas registradas)");
    console.log(fila("  Ventas válidas", d.ventasValidas));
    console.log(fila("  Total", pesos(d.total)));
    console.log(fila("  Unidades", d.unidades));
    console.log(fila("  Ticket promedio", pesos(d.ticketPromedio)));
}

// ---------- Reporte ----------
console.log("CAFÉ ORIGEN · REPORTE DE VENTAS v0.1");
resumenGeneral(ventas);
seccionCiudades(ventas);
seccionProductos(ventas);
seccionTop(ventas, 3);

titulo("Resumen por día");
resumenDia(ventas, "2026-09-05");  // día con ventas
resumenDia(ventas, "2026-09-10");  // día sin ventas