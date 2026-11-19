# Bitácora · Café Origen analítica v0.1

## 1. Archivos del proyecto

| Archivo | Función |
|---|---|
| `src/datos.js` | Muestra de 12 ventas (incluye datos sucios a propósito) |
| `src/analitica.js` | Funciones puras: indicadores con ciclos, versiones con métodos, agrupaciones, ranking y `ventasDelDia` |
| `src/explorar.js` | Exploración inicial de los datos |
| `src/verificar.js` | Compara ciclo vs. métodos y reproduce los errores reportados |
| `src/reporte.js` | Reporte por consola para la gerente |
| `README.md` | Qué es, cómo ejecutarlo y qué preguntas responde |
| `bitacora.md` | Este documento |

## 2. Diccionario de datos

| Campo | Tipo | Descripción | Observaciones |
|---|---|---|---|
| id | número | Identificador de la venta | 1 a 12, único |
| fecha | texto | Fecha de la venta (AAAA-MM-DD) | del 2026-09-01 al 2026-09-06 |
| cliente | texto | Código del cliente | C01 a C08; C01 compra varias veces |
| producto | texto | Producto vendido | 5 productos distintos |
| ciudad | texto | Ciudad de la venta | Datos sucios: `"medellín "` y `"Bogotá "` (espacios y mayúsculas) |
| cantidad | número | Unidades vendidas | La venta 8 tiene cantidad 0 (no válida) |
| precio | número | Precio unitario en pesos COP | |

Valor de una venta = `cantidad × precio`.

**Hallazgos de la exploración (`explorar.js`)**
- 12 registros y 7 campos por registro.
- Ciudades escritas sin normalizar: `Medellín`, `medellín `, `Bogotá`, `Bogotá `, `Cali`, `Pereira` (6 valores crudos, 4 ciudades reales).
- Una venta con cantidad 0 (id 8).
- No hay ventas el 2026-09-10 (sirve como día sin ventas).

## 3. Decisiones sobre los datos de prueba

En `datos.js` la venta 5 tiene `"medellín "` y la venta 6 tiene `"Bogotá "` (con espacio al final). Así el `trim()` se ejercita con datos sucios y el Error 1 se puede reproducir con la versión ingenua.

## 4. Casos borde

| Función | Arreglo vacío `[]` | Justificación |
|---|---|---|
| `totalVendido` / `totalVendidoM` | `0` | Valor inicial del acumulador |
| `unidadesVendidas` / `unidadesVendidasM` | `0` | Valor inicial del acumulador |
| `ventaMayor` | `null` | No existe un registro que devolver |
| `ticketPromedio` | `0` | Evita `0/0 = NaN` |
| `ventasPorCiudad` / `ventasPorCiudadM` | `0` | No hubo ventas en esa ciudad |
| `totalPorCiudad` | `{}` | Sin ventas no hay grupos |
| `unidadesPorProducto` | `{}` | Sin ventas no hay grupos |
| `topProductosPorValor` | `[]` | Sin productos no hay ranking; con `k = 0` también `[]`; si `k` excede los productos, devuelve todos |
| `ventasDelDia` | todo en `0` | Un día sin ventas muestra ceros, no error |

- Con un solo elemento, `ventaMayor` devuelve ese mismo registro.
- Una venta con `cantidad = 0` no cuenta como válida para `ticketPromedio`.
- `ordenar` se hace sobre una copia (`[...Object.entries(...)]`), así que `ventas` conserva su orden.

## 5. Pseudocódigo

**totalVendido** (acumulador)
```
total ← 0
para cada venta en ventas:
    total ← total + valorVenta(venta)
devolver total
```

**unidadesVendidas** (acumulador)
```
unidades ← 0
para cada venta en ventas:
    unidades ← unidades + venta.cantidad
devolver unidades
```

**ventaMayor** (máximo)
```
si ventas está vacío: devolver null
mayor ← ventas[0]
para cada venta en ventas:
    si valorVenta(venta) > valorVenta(mayor): mayor ← venta
devolver mayor
```

**ticketPromedio** (acumulador + contador)
```
total ← 0; validas ← 0
para cada venta en ventas:
    si venta.cantidad > 0:
        total ← total + valorVenta(venta)
        validas ← validas + 1
si validas = 0: devolver 0
devolver total / validas
```

**ventasPorCiudad** (acumulador condicionado)
```
buscada ← normalizar(ciudad)      // trim + toLowerCase
total ← 0
para cada venta en ventas:
    si normalizar(venta.ciudad) = buscada:
        total ← total + valorVenta(venta)
devolver total
```

**totalPorCiudad** (agrupar + acumular)
```
grupos ← {}
para cada venta en ventas:
    clave ← trim + minúsculas de venta.ciudad
    grupos[clave] ← (grupos[clave] o 0) + valorVenta(venta)
devolver grupos
```

**unidadesPorProducto**
```
grupos ← {}
para cada venta en ventas:
    clave ← trim de venta.producto
    grupos[clave] ← (grupos[clave] o 0) + venta.cantidad
devolver grupos
```

**topProductosPorValor**
```
totales ← agrupar valorVenta por producto
pares ← copia de las entradas [producto, total]
ordenar pares de mayor a menor total
quedarme con los primeros k
devolver solo los nombres
```

**ventasDelDia**
```
delDia ← ventas cuya fecha = fecha
devolver { fecha, ventasValidas, total, unidades, ticketPromedio }
// sin ventas: todo en 0
```

## 6. Trazas manuales

**Traza A: `ventasPorCiudad(ventas, "Medellín")`**, `buscada = "medellín"`

| id | ciudad normalizada | ¿coincide? | valorVenta | total |
|---|---|---|---|---|
| (inicio) | | | | 0 |
| 1 | medellín | sí | 84.000 | 84.000 |
| 2 | bogotá | no | | 84.000 |
| 3 | cali | no | | 84.000 |
| 4 | medellín | sí | 42.000 | 126.000 |
| 5 | medellín (venía como `"medellín "`) | sí | 135.000 | 261.000 |
| 6 a 10 | bogotá, bogotá, cali, cali, pereira | no | | 261.000 |
| 11 | medellín | sí | 95.000 | 356.000 |
| 12 | bogotá | no | | 356.000 |

Resultado manual: **356.000**. Coincide con el programa.

**Traza B: `ticketPromedio(ventas)`**

| id | cantidad > 0 | valorVenta | total | validas |
|---|---|---|---|---|
| (inicio) | | | 0 | 0 |
| 1 | sí | 84.000 | 84.000 | 1 |
| 2 | sí | 26.000 | 110.000 | 2 |
| 3 | sí | 95.000 | 205.000 | 3 |
| 4 | sí | 42.000 | 247.000 | 4 |
| 5 | sí | 135.000 | 382.000 | 5 |
| 6 | sí | 52.000 | 434.000 | 6 |
| 7 | sí | 120.000 | 554.000 | 7 |
| 8 | **no** | (se omite) | 554.000 | 7 |
| 9 | sí | 90.000 | 644.000 | 8 |
| 10 | sí | 168.000 | 812.000 | 9 |
| 11 | sí | 95.000 | 907.000 | 10 |
| 12 | sí | 78.000 | 985.000 | 11 |

Resultado manual: 985.000 / 11 ≈ **89.545,45**. Coincide con el programa.

**Resultados manuales adicionales (agrupaciones)**

| Ciudad | Ventas incluidas | Total |
|---|---|---|
| medellín | 1, 4, 5, 11 | 356.000 |
| bogotá | 2, 6, 7, 12 | 276.000 |
| cali | 3, 8 (valor 0), 9 | 185.000 |
| pereira | 10 | 168.000 |

Suma: 985.000, igual a `totalVendido`.

| Producto | Unidades | Valor generado |
|---|---|---|
| Origen Huila 500 g | 7 | 294.000 |
| Origen Sierra 500 g | 5 | 225.000 |
| Prensa francesa | 2 | 190.000 |
| Origen Nariño 250 g | 6 | 156.000 |
| Molino manual | 1 | 120.000 |

El top 3 por valor es Huila, Sierra y Prensa francesa.

## 7. Preguntas sobre colecciones por función

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
|---|---|---|---|---|---|
| `totalVendidoM` | cada venta | nada | nada | suma de `valorVenta` | no agrupa |
| `unidadesVendidasM` | cada venta | nada | venta → cantidad (`map`) | suma de cantidades | no agrupa |
| `ventasPorCiudadM` | cada venta | las de la ciudad buscada (`filter`) | venta → valor (`map`) | suma de valores | no agrupa |
| `totalPorCiudad` | cada venta | nada | ciudad → clave normalizada | total por clave | objeto con clave = ciudad normalizada |
| `unidadesPorProducto` | cada venta | nada | producto → clave con `trim` | unidades por clave | objeto con clave = producto |
| `topProductosPorValor` | cada venta, luego cada par `[producto, total]` | nada | pares → solo nombres (`map`) | valor por producto | objeto por producto, ordenado con `sort` y cortado con `slice` |
| `ventasDelDia` | cada venta | las de la fecha (`filter`) | nada | total, unidades y ventas válidas del día | no agrupa |

## 8. Registro de depuración

### Error 1: "Bogotá aparecía dos veces"
- **Síntoma:** el reporte mostraba dos filas para Bogotá, con totales parciales distintos.
- **Entrada que lo produce:** ventas con `ciudad: "Bogotá"` y `ciudad: "Bogotá "` (espacio al final). También ocurre con `"medellín "` frente a `"Medellín"`.
- **Hipótesis:** el agrupador usa el texto tal cual como clave del objeto; para JavaScript, `"Bogotá"` y `"Bogotá "` son claves distintas.
- **Prueba realizada:** agrupé con `g[v.ciudad]` y mostré `Object.keys(...)`: aparecieron 6 claves (`Medellín`, `Bogotá`, `Cali`, `medellín `, `Bogotá `, `Pereira`). Luego agrupé con `v.ciudad.trim().toLowerCase()` y quedaron 4 claves.
- **Causa:** clave sin normalizar (espacios y mayúsculas distintos = grupos distintos).
- **Corrección:** `totalPorCiudad` y `ventasPorCiudad` normalizan con `trim()` y `toLowerCase()` antes de usar el nombre como clave o compararlo. Verificado: `Object.keys(totalPorCiudad(ventas)).length === 4`.

### Error 2: "El ticket promedio daba NaN en un día sin ventas"
- **Síntoma:** al filtrar un día sin ventas, el