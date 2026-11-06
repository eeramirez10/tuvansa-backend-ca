# Diccionario de nomenclaturas EAN — TUVANSA

## 1. Objetivo
Documentar las reglas de construcción de códigos EAN utilizadas en el ERP de TUVANSA, identificar inconsistencias y preparar un mapeo para estandarizar y depurar el catálogo.

> Nota: Estos códigos son identificadores internos denominados «EAN» en el ERP. No se ha confirmado que cumplan el estándar internacional EAN/GTIN.

## 2. Flujo de alta en el ERP
1. Inventarios → Crear nuevo.
2. Revisar el seguimiento o consecutivo del código.
3. Seleccionar la clasificación.
4. Capturar la descripción del producto.
5. Seleccionar unidad (pieza, tramo, metros, etc.).
6. Seleccionar PT.
7. Seleccionar moneda: 1 = MXN; 2 = USD.
8. Generar el EAN conforme a la familia y atributos del producto.

**No incluir la moneda en el EAN.** La unidad comercial se registra en su propio campo y no debe duplicarse con claves como TM.

## 3. Reglas para válvulas
Estructura confirmada para el ejemplo:
`[TIPO][MATERIAL][MEDIDA][PRESIÓN][FIGURA][IMPORTACIÓN]`

| Código | Significado |
| --- | --- |
| VB | Válvula de bola |
| VC | Válvula de compuerta |
| B | Bronce (en el ejemplo de compuerta) |
| BR | Bronce (mencionado en otro ejemplo; requiere homologación con B) |
| 150, 300 | Presión en libras, según aplique |
| F717 | Figura 717 |
| E | Importación; siempre al final |

Ejemplo validado:
- Válvula de compuerta de bronce de 2 pulgadas, 150 libras, figura 717, importada → `VCB2150F717E`.

**Pendiente:** confirmar un único código para bronce (`B` o `BR`) y documentar otras familias de válvulas, materiales, figuras y presiones.

## 4. Reglas para tubería
Estructura general:
`[TIPO][MEDIDA][CÉDULA][ATRIBUTOS][IMPORTACIÓN]`

| Código | Significado |
| --- | --- |
| TSC | Tubo sin costura: T = tubo, SC = sin costura |
| TCC | Tubo con costura: T = tubo, CC = con costura |
| GL | Galvanizado (mencionado en la conversación; confirmar clave definitiva) |
| R | Roscado |
| GR | Galvanizado y roscado |
| RA | Ranurado |
| RJA | Rojo/roja, también llamado vermellón en registros actuales |
| AI304 | Acero inoxidable 304 |
| AI316 | Acero inoxidable 316 |
| E | Importación, siempre al final |

Reglas adicionales:
- El orden confirmado para tubería roja ranurada es `RA` seguido de `RJA`.
- No combinar `RA` con inoxidable según la práctica del catálogo explicada.
- Se mantienen `TSC` y `TCC` también para inoxidable, según tenga o no costura.
- La unidad comercial (tramos, metros, piezas) no debe añadirse al EAN nuevo.
- El formato exacto de fracciones y separadores debe validarse antes de automatizar.

### Ejemplos
| Descripción | EAN |
| --- | --- |
| Sin costura, ½ pulgada, cédula 160 | `TSC½160` |
| Con costura, ½ pulgada, cédula 160 | `TCC½160` |
| Sin costura, ½ pulgada, cédula 160, roscada | `TSC½160R` |
| Sin costura, ½ pulgada, cédula 160, galvanizada y roscada | `TSC½160GR` |
| Sin costura, ½ pulgada, cédula 160, ranurada | `TSC½160RA` |
| Sin costura, ½ pulgada, cédula 160, inoxidable 316 | `TSC½160AI316` |
| Con costura, 10 pulgadas, cédula 20, roja y ranurada | `TCC1020RARJA` |
| Caso anterior, importado | `TCC1020RARJAE` |

## 5. Inconsistencias detectadas
| Hallazgo | Acción propuesta |
| --- | --- |
| `TM` en EAN existentes | No usarlo en códigos nuevos; la unidad ya está registrada. Mantenerlo como dato histórico hasta la migración. |
| `FT` en descripciones | Revisar su significado y eliminarlo cuando duplique la unidad. |
| `roja`, `rojo`, `vermellón`, `RJ`, `RJA` | Homologar a `RJA` cuando indiquen el mismo atributo. |
| Abreviaturas distintas para una misma característica | Crear catálogo único de códigos y sinónimos. |
| Letra `H` en algunos productos de Monterrey | Investigar su significado; no asumir que indica China. |
| Procedencia insuficientemente detallada | Evaluar un catálogo de país de origen separado de nacional/importación. |

## 6. Procedencia
- El ERP distingue entre **nacional** e **importación**.
- Si es importado, añadir `E` al final del EAN.
- Se propuso evaluar un campo adicional de **país de origen** (por ejemplo, China), sin inventar códigos de país dentro del EAN.
- La letra `H` observada en algunos códigos sigue sin significado confirmado.

## 7. Plan de trabajo
1. Levantar nomenclaturas actuales por familia de productos.
2. Identificar reglas confirmadas, excepciones y dudas.
3. Validar el diccionario con personal que conoce el catálogo, incluida Lucy.
4. Definir la nomenclatura definitiva y los campos que no deben duplicarse.
5. Construir un mapeo de códigos actuales → códigos normalizados.
6. Detectar duplicados y posibles colisiones antes de modificar registros.
7. Probar la transformación con muestras y revisar resultados.
8. Ejecutar una limpieza controlada con respaldo y trazabilidad.

## 8. Familias pendientes
- Más tipos de válvulas, materiales, figuras y presiones.
- Conexiones.
- Bridas.
- Accesorios y otras familias del inventario.

## 9. Ejemplo de interpretación
**Entrada:** Tubería de acero al carbón con costura de 10 pulgadas, cédula 20, roja, ranurada, de importación.

**Desglose:**
- TCC = tubo con costura.
- 10 = medida en pulgadas.
- 20 = cédula.
- RA = ranurada.
- RJA = roja.
- E = importación.

**EAN resultante:** `TCC1020RARJAE`

## 10. Principio rector
Primero documentar el funcionamiento actual del ERP; después validar y aprobar las reglas definitivas; finalmente automatizar la generación de EAN y la limpieza del catálogo. No modificar códigos dudosos sin confirmación.
