// Equivale a trim(): quita espacios al inicio y al final
SubProceso r <- recortar(t)
    Definir izq, der, largo Como Entero;
    Definir r Como Texto;
    largo <- Longitud(t);
    Si largo = 0 Entonces
        r <- "";
    Sino
        izq <- 1;
        Mientras izq < largo Y Subcadena(t, izq, izq) = " " Hacer
            izq <- izq + 1;
        FinMientras
        der <- largo;
        Mientras der > izq Y Subcadena(t, der, der) = " " Hacer
            der <- der - 1;
        FinMientras
        Si izq = der Y Subcadena(t, izq, izq) = " " Entonces
            r <- "";
        Sino
            r <- Subcadena(t, izq, der);
        FinSi
    FinSi
FinSubProceso

// Acumulador. n = 0 -> 0
SubProceso total <- totalVendido(cantidad, precio, n)
    Definir total Como Real;
    Definir i Como Entero;
    total <- 0;
    i <- 1;
    Mientras i <= n Hacer
        total <- total + cantidad[i] * precio[i];
        i <- i + 1;
    FinMientras
FinSubProceso

// Acumulador. n = 0 -> 0
SubProceso unidades <- unidadesVendidas(cantidad, n)
    Definir unidades Como Real;
    Definir i Como Entero;
    unidades <- 0;
    i <- 1;
    Mientras i <= n Hacer
        unidades <- unidades + cantidad[i];
        i <- i + 1;
    FinMientras
FinSubProceso

// Máximo. Devuelve la POSICIÓN de la venta mayor. n = 0 -> 0 (no existe)
SubProceso mayor <- indiceVentaMayor(cantidad, precio, n)
    Definir mayor, i Como Entero;
    Si n = 0 Entonces
        mayor <- 0;
    Sino
        mayor <- 1;
        i <- 2;
        Mientras i <= n Hacer
            Si cantidad[i] * precio[i] > cantidad[mayor] * precio[mayor] Entonces
                mayor <- i;
            FinSi
            i <- i + 1;
        FinMientras
    FinSi
FinSubProceso

// Acumulador + contador (solo cantidad > 0). Sin ventas válidas -> 0
SubProceso tk <- ticketPromedio(cantidad, precio, n)
    Definir tk, total, validas Como Real;
    Definir i Como Entero;
    total <- 0;
    validas <- 0;
    i <- 1;
    Mientras i <= n Hacer
        Si cantidad[i] > 0 Entonces
            total <- total + cantidad[i] * precio[i];
            validas <- validas + 1;
        FinSi
        i <- i + 1;
    FinMientras
    Si validas = 0 Entonces
        tk <- 0;
    Sino
        tk <- total / validas;
    FinSi
FinSubProceso

Algoritmo ReporteCafeOrigen
    Definir n, i, j, k, pos, nCiudades, nProd, idx Como Entero;
    Definir idv, cantidad, precio, totCiudad, valProd, auxN Como Real;
    Definir producto, ciudad, nomCiudad, nomProd, clave, auxT Como Texto;
	
    n <- 12;
    Dimension idv[12], producto[12], ciudad[12], cantidad[12], precio[12];
    Dimension nomCiudad[12], totCiudad[12];
    Dimension nomProd[12], valProd[12];
	
    // Datos (ventas 5 y 6 con espacio al final, a propósito)
    idv[1] <- 1;   producto[1] <- "Origen Huila 500 g";   ciudad[1] <- "Medellín";   cantidad[1] <- 2;  precio[1] <- 42000;
    idv[2] <- 2;   producto[2] <- "Origen Nariño 250 g";  ciudad[2] <- "Bogotá";     cantidad[2] <- 1;  precio[2] <- 26000;
    idv[3] <- 3;   producto[3] <- "Prensa francesa";      ciudad[3] <- "Cali";       cantidad[3] <- 1;  precio[3] <- 95000;
    idv[4] <- 4;   producto[4] <- "Origen Huila 500 g";   ciudad[4] <- "Medellín";   cantidad[4] <- 1;  precio[4] <- 42000;
    idv[5] <- 5;   producto[5] <- "Origen Sierra 500 g";  ciudad[5] <- "medellín ";  cantidad[5] <- 3;  precio[5] <- 45000;
    idv[6] <- 6;   producto[6] <- "Origen Nariño 250 g";  ciudad[6] <- "Bogotá ";    cantidad[6] <- 2;  precio[6] <- 26000;
    idv[7] <- 7;   producto[7] <- "Molino manual";        ciudad[7] <- "Bogotá";     cantidad[7] <- 1;  precio[7] <- 120000;
    idv[8] <- 8;   producto[8] <- "Origen Huila 500 g";   ciudad[8] <- "Cali";       cantidad[8] <- 0;  precio[8] <- 42000;
    idv[9] <- 9;   producto[9] <- "Origen Sierra 500 g";  ciudad[9] <- "Cali";       cantidad[9] <- 2;  precio[9] <- 45000;
    idv[10] <- 10; producto[10] <- "Origen Huila 500 g";  ciudad[10] <- "Pereira";   cantidad[10] <- 4; precio[10] <- 42000;
    idv[11] <- 11; producto[11] <- "Prensa francesa";     ciudad[11] <- "Medellín";  cantidad[11] <- 1; precio[11] <- 95000;
    idv[12] <- 12; producto[12] <- "Origen Nariño 250 g"; ciudad[12] <- "Bogotá";    cantidad[12] <- 3; precio[12] <- 26000;
	
    Escribir "CAFE ORIGEN - REPORTE v0.1 (PSeInt)";
	
    // ---- 1. Indicadores ----
    Escribir "";
    Escribir "1. INDICADORES";
    Escribir "Total vendido:     $ ", totalVendido(cantidad, precio, n);
    Escribir "Unidades vendidas: ", unidadesVendidas(cantidad, n);
    Escribir "Ticket promedio:   $ ", Redon(ticketPromedio(cantidad, precio, n));
    idx <- indiceVentaMayor(cantidad, precio, n);
    Si idx = 0 Entonces
        Escribir "Venta mayor:      Sin ventas";
    Sino
        Escribir "Venta mayor:      #", idv[idx], " por $ ", cantidad[idx] * precio[idx];
    FinSi
	
    // ---- 2. Totales por ciudad (claves normalizadas) ----
    nCiudades <- 0;
    i <- 1;
    Mientras i <= n Hacer
        clave <- Minusculas(recortar(ciudad[i]));
        pos <- 0;
        j <- 1;
        Mientras j <= nCiudades Hacer
            Si nomCiudad[j] = clave Entonces
                pos <- j;
            FinSi
            j <- j + 1;
        FinMientras
        Si pos = 0 Entonces
            nCiudades <- nCiudades + 1;
            pos <- nCiudades;
            nomCiudad[pos] <- clave;
            totCiudad[pos] <- 0;
        FinSi
        totCiudad[pos] <- totCiudad[pos] + cantidad[i] * precio[i];
        i <- i + 1;
    FinMientras
	
    Escribir "";
    Escribir "2. TOTAL POR CIUDAD (", nCiudades, " ciudades)";
    i <- 1;
    Mientras i <= nCiudades Hacer
        Escribir nomCiudad[i], ": $ ", totCiudad[i];
        i <- i + 1;
    FinMientras
	
    // ---- 3. Ranking de productos por valor (top 3) ----
    nProd <- 0;
    i <- 1;
    Mientras i <= n Hacer
        clave <- recortar(producto[i]);
        pos <- 0;
        j <- 1;
        Mientras j <= nProd Hacer
            Si nomProd[j] = clave Entonces
                pos <- j;
            FinSi
            j <- j + 1;
        FinMientras
        Si pos = 0 Entonces
            nProd <- nProd + 1;
            pos <- nProd;
            nomProd[pos] <- clave;
            valProd[pos] <- 0;
        FinSi
        valProd[pos] <- valProd[pos] + cantidad[i] * precio[i];
        i <- i + 1;
    FinMientras
	
    // Burbuja descendente sobre los arreglos de productos
    i <- 1;
    Mientras i < nProd Hacer
        j <- 1;
        Mientras j <= nProd - i Hacer
            Si valProd[j] < valProd[j + 1] Entonces
                auxN <- valProd[j];
                valProd[j] <- valProd[j + 1];
                valProd[j + 1] <- auxN;
                auxT <- nomProd[j];
                nomProd[j] <- nomProd[j + 1];
                nomProd[j + 1] <- auxT;
            FinSi
            j <- j + 1;
        FinMientras
        i <- i + 1;
    FinMientras
	
    k <- 3;
    Si k > nProd Entonces
        k <- nProd;
    FinSi
    Escribir "";
    Escribir "3. TOP ", k, " PRODUCTOS POR VALOR";
    i <- 1;
    Mientras i <= k Hacer
        Escribir i, ". ", nomProd[i], " ($ ", valProd[i], ")";
        i <- i + 1;
    FinMientras
	
    // ---- Casos borde: n = 0 y n = 1 ----
    Escribir "";
    Escribir "CASOS BORDE (n = 0)";
    Escribir "totalVendido:     ", totalVendido(cantidad, precio, 0);
    Escribir "unidadesVendidas: ", unidadesVendidas(cantidad, 0);
    Escribir "indiceVentaMayor: ", indiceVentaMayor(cantidad, precio, 0), "  (0 = no existe)";
    Escribir "ticketPromedio:   ", ticketPromedio(cantidad, precio, 0);
	
    Escribir "";
    Escribir "CASOS BORDE (n = 1)";
    Escribir "totalVendido:     ", totalVendido(cantidad, precio, 1);
    Escribir "indiceVentaMayor: ", indiceVentaMayor(cantidad, precio, 1);
    Escribir "ticketPromedio:   ", ticketPromedio(cantidad, precio, 1);
FinAlgoritmo