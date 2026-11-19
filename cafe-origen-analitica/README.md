# Café Origen · Motor de analítica v0.1

Motor de analítica en JavaScript (Node.js) para las ventas de Café Origen.
Calcula indicadores de negocio y los presenta en un reporte por consola,
sin necesidad de abrir el código.

## Cómo ejecutarlo

Requisito: tener Node.js instalado.

```bash
node src/reporte.js     # reporte completo para la gerencia
node src/verificar.js   # compara ciclos vs. métodos (todo debe decir OK) y reproduce los errores reportados
node src/analitica.js   # pruebas de las funciones (completo, un elemento, vacío)
node src/explorar.js    # exploración de los datos
```

## Qué preguntas responde

- ¿Cuánto hemos vendido en total y cuántas unidades?
- ¿Cuál es el ticket promedio?
- ¿Cuál fue la venta de mayor valor?
- ¿Cuánto vendimos en cada ciudad?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuáles son los 3 productos que más dinero generan?
- ¿Cómo le fue a un día específico (incluso si no hubo ventas)?

## Estructura

```
src/datos.js       datos de ventas
src/analitica.js   funciones de cálculo (puras)
src/explorar.js    exploración de los datos
src/verificar.js   verificación ciclo vs. métodos y errores reportados
src/reporte.js     reporte por consola
bitacora.md        diccionario de datos, casos borde, pseudocódigo, trazas y depuración
```

## Decisiones de casos borde

- Arreglo vacío: totales en 0; `ventaMayor` devuelve `null`; ticket promedio 0.
- Las ciudades se normalizan con `trim()` y `toLowerCase()`.
- Una venta con cantidad 0 no cuenta como válida para el ticket promedio.
- Un día sin ventas devuelve todo en 0, nunca `NaN` ni error.