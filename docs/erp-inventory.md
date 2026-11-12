# Consulta de inventario ERP

Endpoints internos, exclusivamente SELECT y protegidos con `x-internal-api-key`:

- `GET /api/erp/products/inventory`
- `GET /api/erp/products/inventory/warehouses`

Parametros de inventario: `query` (opcional, hasta 160 caracteres),
`warehouseCode` (opcional, texto de 1-6 caracteres sin controles), `stock` (`all`, `positive`, `zero`,
`negative`), `page` (desde 1), `pageSize` (10, 25, 50, 100; predeterminado 25),
`sortBy` (`ean`, `code`, `description`, `unit`, `warehouseCode`, `stock`) y
`sortDirection` (`asc`, `desc`). Orden predeterminado: codigo, almacen e ISEQ.
Los caracteres `%`, `_` y `!` de la busqueda se tratan literalmente.
La busqueda se normaliza con NFC, trim y mayusculas. SQL compara operandos
convertidos a utf8mb4 y mayusculas para no depender de macroman_bin del ERP.
Solo los codigos numericos se completan a dos digitos (1 -> 01); codigos de
texto como ANOID y | conservan su identidad. No se modifica FALM.

Respuesta: `items`, `page`, `pageSize`, `total`, `totalPages`. Cada item contiene
`id`, `code`, `ean`, `description`, `unit`, `warehouseCode`, `stock`.
El core puede enviar el parametro interno repetible `warehouseCodes` (hasta
128 codigos). El alcance se aplica tanto al conteo como a las filas antes de
paginar, y se intersecta con `warehouseCode` si este se indica. La respuesta
incluye `warehouseCodes` con el alcance aplicado. No se incluyen productos
sin FALM en una consulta restringida.
El catalogo de almacenes devuelve los codigos normalizados presentes en FALM;
los nombres los resuelve el core, sin inferir sucursales por prefijos.

FALM se agrupa por ISEQ y ALMNUM antes de resolver la primera descripcion
I2DESCR no vacia por I2SEQ, con IDESCR como respaldo. No se filtran costos ni
ITIPO. Un producto sin registro de almacen conserva `warehouseCode: null` y
`stock: null`; no representa existencia cero. EAN iguales en diferentes codigos
ERP no se fusionan. No se consultan campos fiscales, contables ni costos.

Pruebas: `node --test test/*.test.cjs`; compilacion: `npm run build`.
Las pruebas SQL usan una fixture relacional aislada en SQLite (Python 3), con
funciones de compatibilidad para las expresiones usadas de MySQL; no conectan
a Proscai. Si Python no existe, las pruebas de esa fixture se marcan omitidas.

No hay migraciones ni nuevas variables. Las dos rutas GET estan permitidas en
staging de solo lectura; ningun metodo de escritura queda habilitado.
