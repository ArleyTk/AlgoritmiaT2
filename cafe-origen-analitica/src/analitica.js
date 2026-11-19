const valorVenta = (venta) => venta.cantidad * venta.precio;

// ---------- Versión con ciclos ----------

// Acumulador. Vacío -> 0
function totalVendido(ventas) {
    let total = 0;
    for (const v of ventas) total += valorVenta(v);
    return total;
}

// Acumulador. Vacío -> 0
function unidadesVendidas(ventas) {
    let unidades = 0;
    for (const v of ventas) unidades += v.cantidad;
    return unidades;
}

// Máximo. Devuelve el registro completo. Vacío -> null
function ventaMayor(ventas) {
    if (ventas.length === 0) return null;
    let mayor = ventas[0];
    for (const v of ventas) {
        if (valorVenta(v) > valorVenta(mayor)) mayor = v;
    }
    return mayor;
}

// Acumulador + contador (solo cantidad > 0). Sin ventas válidas -> 0
function ticketPromedio(ventas) {
    let total = 0;
    let validas = 0;
    for (const v of ventas) {
        if (v.cantidad > 0) {
            total += valorVenta(v);
            validas++;
        }
    }
    return validas === 0 ? 0 : total / validas;
}

// Acumulador condicionado. Ignora mayúsculas y espacios. Vacío -> 0
function ventasPorCiudad(ventas, ciudad) {
    const buscada = ciudad.trim().toLowerCase();
    let total = 0;
    for (const v of ventas) {
        if (v.ciudad.trim().toLowerCase() === buscada) total += valorVenta(v);
    }
    return total;
}

// ---------- Versión con métodos de arreglo ----------

// Vacío -> 0 (gracias al valor inicial del reduce)
const totalVendidoM = (ventas) =>
    ventas.reduce((acc, v) => acc + valorVenta(v), 0);

const unidadesVendidasM = (ventas) =>
    ventas.map((v) => v.cantidad).reduce((acc, c) => acc + c, 0);

const ventasPorCiudadM = (ventas, ciudad) => {
    const buscada = ciudad.trim().toLowerCase();
    return ventas
        .filter((v) => v.ciudad.trim().toLowerCase() === buscada)
        .map(valorVenta)
        .reduce((acc, valor) => acc + valor, 0);
};

// ---------- Agrupaciones y rankings ----------

// { medellín: 356000, bogotá: 276000, cali: 185000, pereira: 168000 }
function totalPorCiudad(ventas) {
    return ventas.reduce((grupos, v) => {
        const clave = v.ciudad.trim().toLowerCase();
        grupos[clave] = (grupos[clave] || 0) + valorVenta(v);
        return grupos;
    }, {});
}

// { "Origen Huila 500 g": 7, ... }
function unidadesPorProducto(ventas) {
    return ventas.reduce((grupos, v) => {
        const clave = v.producto.trim();
        grupos[clave] = (grupos[clave] || 0) + v.cantidad;
        return grupos;
    }, {});
}

// Los k productos con más dinero generado, de mayor a menor (solo nombres)
// [] -> [] | k = 0 -> [] | k mayor que los productos -> devuelve todos
function topProductosPorValor(ventas, k) {
    const totales = ventas.reduce((grupos, v) => {
        const clave = v.producto.trim();
        grupos[clave] = (grupos[clave] || 0) + valorVenta(v);
        return grupos;
    }, {});

    // Spread: copia explícita para que sort nunca toque un arreglo ajeno
    return [...Object.entries(totales)]
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(([producto]) => producto);
}

// ---------- Resumen por día ----------

// Sin ventas -> todo en 0 (nunca NaN ni error)
function ventasDelDia(ventas, fecha) {
    const delDia = ventas.filter((v) => v.fecha === fecha);
    return {
        fecha,
        ventasValidas: delDia.filter((v) => v.cantidad > 0).length,
        total: totalVendido(delDia),
        unidades: unidadesVendidas(delDia),
        ticketPromedio: ticketPromedio(delDia), // devuelve 0 si no hay válidas
    };
}

module.exports = {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia,
};

// ---------- Pruebas (solo al ejecutar este archivo directamente) ----------

if (require.main === module) {
    const ventas = require("./datos"); // dentro del bloque: sin variables globales

    const casos = { "completo": ventas, "un elemento": [ventas[0]], "vacío": [] };
    for (const [nombre, datos] of Object.entries(casos)) {
        console.log(`\n--- ${nombre} ---`);
        console.log("totalVendido:    ", totalVendido(datos));
        console.log("unidadesVendidas:", unidadesVendidas(datos));
        console.log("ventaMayor:      ", ventaMayor(datos));
        console.log("ticketPromedio:  ", ticketPromedio(datos));
        console.log("ventasPorCiudad: ", ventasPorCiudad(datos, "Medellín"));
    }

    console.log("\n--- Agrupaciones y ranking ---");
    console.log(totalPorCiudad(ventas));
    console.log(unidadesPorProducto(ventas));
    console.log(topProductosPorValor(ventas, 3));
    console.log("primer id:", ventas[0].id); // debe seguir siendo 1
}