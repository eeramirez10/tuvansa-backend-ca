# Nomenclatura EAN: contraste del catalogo de Mexico

Analisis realizado el 26 de octubre de 2026 mediante SELECT de solo lectura.
Cohorte: FINV.ICOD LIKE '01%' y FINV.ITIPO = 1. Es la sucursal de alta
segun el prefijo del codigo, no una restriccion por existencias en FALM.
No se filtraron costos ni stock. No se modificaron productos.

## Calidad y limites de la evidencia

- 13,820 productos; 13,224 EAN distintos; 27 productos sin EAN.
- 532 EAN aparecen en mas de un registro (569 registros adicionales).
  La repeticion de IEAN esta permitida: el mismo EAN puede pertenecer a
  productos con ICOD distinto, incluso en sucursales diferentes. El prefijo
  de ICOD identifica la sucursal (01 Mexico, 02 Monterrey, etc.). No se
  impone unicidad por EAN ni por la combinacion EAN/sucursal.
- 49 productos carecen de descripcion extendida.
- 2,151 tienen contenido en otros bloques de FINV2. Hay texto repetido y
  notas operativas: no deben concatenarse sin revisar para inferir atributos.
- 1,079 grupos de descripcion principal normalizada tienen distintos EAN.
  La descripcion principal es I2DESCR, con IDESCR como respaldo.
- Los codigos son identificadores internos denominados EAN; no se presupone
  que cumplan el estandar EAN/GTIN.

## Patrones observados

| Familia | Estructura base | Ejemplo real |
| --- | --- | --- |
| Tuberia | TSC/TCC + diametro + cedula + atributos | TSC440RA |
| Brida | BWN/BSO/BSW/BC/BR + diametro + clase + cara + barreno/material | BWN4600CRB40AI304 |
| Niple | NISC/NICC + diametro + X + longitud + cedula + atributos | NICC1/2X240 |
| Valvula de bola | VB y variantes, segun figura/fabricante | VB2150AB |
| Valvula de compuerta | Principalmente VCO | VCO1/2125BR |
| Valvula check | Principalmente VCH | VCH4F716 |
| Valvula de mariposa | Principalmente VMA | VMA8PVC |
| Valvula de globo | Principalmente VGL | VGL3150ABT5 |

La comprobacion heuristica de la parte base dio 676 coincidencias de 710
registros de tuberia con costura/diametro/cedula inequivocos, 832 de 845
bridas con prefijo/diametro/clase inequivocos y 397 de 426 niples con
costura/diametro/longitud/cedula inequivocos. Estas cifras NO miden exactitud
de IA ni de generacion del codigo completo. Incluyen atributos leidos del
texto y comparacion con partes del EAN existente.

En tuberia se observan RA (ranurado), R (roscado), GL (galvanizado liso),
GR (galvanizado roscado), GRA (galvanizado ranurado), AI304 y AI316.
Las medidas mixtas se concatenan: 1 1/2 pulgadas se representa como 11/2
en el EAN. En la descripcion nueva se exige una medida explicita con
espacio, guion, fraccion Unicode o decimal; una fraccion impropia compacta
como 11/2 no se interpreta automaticamente como 1 1/2.

En bridas: CR = cara realzada; CP = cara plana; RTJ se mantiene como tal.
B40/B80/BXS/BXXS aparecen para barrenos no estandar. El barreno estandar
se encuentra sin segmento B en el patron revisado de brida con cuello.

## Excepciones que no deben aprenderse como reglas universales

- La entrevista inicial usa VC para compuerta; en Mexico predomina VCO.
  Su ejemplo VCB2150F717E no se adopta como generador universal.
- RAROJA, RJARA, RJA y ROJA coexisten para tuberia roja. La propuesta usa
  ROJA despues de los extremos (RA + ROJA si es ranurada), con aviso de
  revision; la entrevista propone otra homologacion, pendiente de acordar.
- TM, FT, CH, DIS, NC y otras variantes historicas no se agregan por defecto.
- E se documenta para importacion, pero la descripcion a menudo no permite
  confirmarla. INOCAPAS tiene valores 0, 1 y 2 y no demuestra por si solo
  una correspondencia con el sufijo E. El origen requiere confirmacion.
- Un mismo simbolo cambia de significado segun posicion y familia: BR puede
  aparecer como brida roscada o como segmento de bronce.
- ICOD 01200191 y 01212275 comparten BWN3150CRAI304, pero sus descripciones
  indican 3 y 2 pulgadas respectivamente. Es evidencia a revisar, no una
  regla que el generador deba reproducir.
- ICOD 01400500 / VB2150AB describe bola de acero al carbon bridada 2 pulgadas
  clase 150. No confirma paso completo, ASME B16.5 ni una figura particular.

## Uso en la sugerencia

La IA extrae atributos con evidencia literal. El core interpreta medidas,
cedulas y clases, aplica reglas de tuberia/bridas y consulta referencias
acotadas de Mexico mediante el backend ERP. No se envian costos, precios,
cuentas contables ni datos de clientes a la IA.

Las referencias se comparan por atributos de su descripcion, conservando
codigo ERP y EAN por separado. Se descartan contradicciones explicitas y
se muestran los campos no confirmados. No se asume equivalencia por parecido.

Una propuesta completa muestra los registros con el mismo EAN como
informacion, junto a su codigo y sucursal. Estas coincidencias no impiden
usarla; cada producto ERP se identifica por ICOD. Se mantiene la revision
explicita del usuario para incorporarla a la ficha. Las valvulas conservan
un desglose parcial y referencias mientras se validan sus variantes.
No se generan archivos de importacion ni altas SQL en esta fase.
