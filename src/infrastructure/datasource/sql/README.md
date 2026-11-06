# Perfil de producto para futura exportacion a Proscai

`finv-product-export-profile.reference.sql` es el `SELECT` de solo lectura proporcionado para inspeccionar un producto por `ICOD`. No se conecta a ninguna ruta ni ejecuta altas. La sentencia `INSERT` que se habia conservado como referencia se retiro: el objetivo es generar un archivo de importacion, no escribir en MySQL desde este backend.

El documento [`docs/explicacion-alta-productos.md`](../../../../docs/explicacion-alta-productos.md) describe una API de alta y sus campos, pero **esa API no esta en este checkout**: `src/presentation/products/routes.ts` expone busquedas y disponibilidad, no un endpoint para crear productos. El documento aclara la semantica de los campos; no especifica el formato de archivo aceptado por el importador de Proscai.

## Evidencia revisada

El `SELECT` para `ICOD=01300938` devolvio una fila con 305 columnas `FINV`: 52 vacias, 170 en cero, 46 numericas no nulas, 22 de texto y 15 fechas. Esos conteos describen **un producto existente**, no la obligatoriedad de campos. Su unidad se resuelve por `p.USEQ=3` a `FUNIDAD.UCOD=M` (`METRO`). `FINV.IDESCR` esta limitada a 60 caracteres y `FINV2.I2DESCR` contiene la descripcion completa.

Se contrastaron ademas siete codigos de tuberia, bridas, valvulas, plasticos y tornilleria. Algunos productos validos tienen `IFAM`, `IUPC`, `IUM2`, `ILISTA1`, `ILISTA4/5` o `IMINIMO/IMAXIMO` vacios o en cero. Dos productos de la muestra no tienen filas `FALM`; su existencia en `FINV` no depende necesariamente de un almacen. Los siete tienen `ICOD`, `IEAN`, `ICODSAT`, `IFAMB`, `IUM`/`USEQ` y una fila `FINV2` con descripcion extendida. La muestra no demuestra que todos estos campos sean obligatorios para importar; si son los primeros candidatos para el archivo.

Segun el documento de alta, la API descrita exige solo `code` (`ICOD`, 1-13 caracteres) y `description` (`IDESCR`, 1-60 caracteres). Para un producto terminado hay que establecer `ITIPO=1` explicitamente, porque el valor predeterminado descrito es `0` (materia prima). La unidad se valida contra `FUNIDAD`; las cuentas contables no vacias, contra `FBENC`. `ICODSAT` figura como pendiente de admitir en esa API. La descripcion extendida requiere un registro `FINV2` ligado al nuevo `ISEQ`.

| Grupo | Campos relevantes | Criterio para la ficha de exportacion |
| --- | --- | --- |
| Identidad | `ICOD`, `IEAN`, `ICODPRV` | Separar codigo ERP, clave comercial y codigo del proveedor. `IEAN` no es unico en el catalogo. |
| Descripcion | `IDESCR`, `FINV2.I2DESCR` | Preparar descripcion corta de hasta 60 caracteres y una extendida revisada. |
| Clasificacion | `ICODSAT`, `IFAMB`, `IFAM` | `IFAMB` es la familia visible; `IFAM` es una clasificacion distinta y a veces vacia. No derivar `ICODSAT` solo de la familia. |
| Unidad | `IUM`, `USEQ`, `FUNIDAD.UCOD/UDESCR`, `IUM2` | Elegir unidad del catalogo `FUNIDAD`; `IUM2` solo si aplica. |
| Moneda y costo | `IMONEDA1`, `IMONEDA`, `ILISTA4`, `ILISTA5` | Guardar moneda y costo cotizado como datos de compras. No tratar el costo de proveedor como costo promedio historico de ERP. |
| Contabilidad | `ICTA`, `ICTADEV`, `ICTA3` | Reglas de sucursal/tipo de producto a confirmar con ERP; no pedir al vendedor. |
| Configuracion ERP | `ITIPO`, `IFOTO`, `ILOTE`, `ICANTCAJA`, `IBODEGA`, `IRENGLON`, `IEDIEMP` | Defaults o campos condicionales del formato de importacion, no requisitos de captura comercial por defecto. |
| Operacion e historial | `ISEQ`, existencias, pedidos, ventas, compras y fechas de movimiento | No exportar valores historicos de un producto existente como si fueran datos de alta. |

## Pendiente para generar el archivo

Falta la especificacion del **formato de importacion que Proscai acepta** (TXT/CSV/Excel, columnas, orden, codificacion y valores obligatorios), y las reglas oficiales de asignacion de `ICOD`, `IEAN`, `ICODSAT`, `IFAMB` y cuentas. El `SELECT` identifica campos del catalogo, pero no demuestra el contrato del importador. La ficha de la requisicion puede prepararse antes; el archivo debe generarse solo con campos confirmados y datos revisados por Compras.
