const ventas = require("./datos.js");
const a = require("./analitica");

function comparar(nombre, conCiclo, conMetodos) {
    console.log(
        `${nombre}: ${conCiclo === conMetodos ? "OK" : "DIFERENTE"}`,
        `(ciclo=${conCiclo}, métodos=${conMetodos})`
    );
}

// ---------- Ciclo vs. métodos ----------
const casos = {
    "completo": ventas,
    "un elemento": [ventas[0]],
    "vacío": [],
};

for (const [nombre, datos] of Object.entries(casos)) {
    console.log(`\n--- ${nombre} ---`);
    comparar("totalVendido", a.totalVendido(datos), a.totalVendidoM(datos));
    comparar("unidadesVendidas", a.unidadesVendidas(datos), a.unidadesVendidasM(datos));
    comparar("ventasPorCiudad", a.ventasPorCiudad(datos, "Medellín"), a.ventasPorCiudadM(datos, "Medellín"));
}

// ---------- El arreglo original debe conservar su orden ----------
const idsAntes = ventas.map((v) => v.id).join(",");
a.topProductosPorValor(ventas, 3);
a.totalPorCiudad(ventas);
a.unidadesPorProducto(ventas);
const idsDespues = ventas.map((v) => v.id).join(",");
console.log("\nOrden original intacto:", idsAntes === idsDespues ? "OK" : "DIFERENTE");

// ---------- Depuración: errores reportados por la gerente ----------
const { valorVenta } = a;

console.log("\n=== Error 1: ciudad duplicada ===");
const ingenuo = ventas.reduce((g, v) => {
    g[v.ciudad] = (g[v.ciudad] || 0) + valorVenta(v); // sin trim ni toLowerCase
    return g;
}, {});
console.log("Versión ingenua:", Object.keys(ingenuo));
console.log("Mi versión:     ", Object.keys(a.totalPorCiudad(ventas)));
console.log("Cantidad de ciudades:", Object.keys(a.totalPorCiudad(ventas)).length === 4 ? "OK" : "DIFERENTE");

console.log("\n=== Error 2: NaN en día sin ventas ===");
const delDia = ventas.filter((v) => v.fecha === "2026-09-10"); // []
console.log("Ingenua (total / length):", a.totalVendido(delDia) / delDia.length); // 0/0 -> NaN
console.log("Mi ticketPromedio:       ", a.ticketPromedio(delDia));              // 0
console.log("ventasDelDia:", a.ventasDelDia(ventas, "2026-09-10"));