const ventas = require("./datos");

console.log("Total de registros:", ventas.length);
console.log("Primer registro:", ventas[0]);
console.log("Campos:", Object.keys(ventas[0]));

// Valores distintos por campo categórico (sin normalizar, para detectar datos sucios)
for (const campo of ["ciudad", "producto", "fecha"]) {
    const distintos = [...new Set(ventas.map((v) => v[campo]))];
    console.log(`\n${campo} (${distintos.length} valores distintos):`);
    console.log(distintos.map((d) => JSON.stringify(d)));
}

// Ventas con cantidad 0
const sinCantidad = ventas.filter((v) => v.cantidad === 0);
console.log("\nVentas con cantidad 0:", sinCantidad.map((v) => v.id));