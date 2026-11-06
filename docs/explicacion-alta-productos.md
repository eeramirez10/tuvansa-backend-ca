**Cómo funciona el alta actual**

1. Valida los datos recibidos.
2. Comprueba que el código no exista.
3. Si envías una unidad, comprueba que exista en `FUNIDAD`; también valida las cuentas contables no vacías contra `FBENC`.
4. Inserta en `FINV` los campos enviados y los valores automáticos.
5. MySQL genera `ISEQ`, y la API consulta la ficha recién creada para devolverla.

No se necesitan las 305 columnas de `FINV` para crear un producto: la mayoría tiene valores predeterminados en la base.

**Campos obligatorios**

En el endpoint actual, solamente estos dos son obligatorios:

| Campo API | Columna | Regla y propósito |
|---|---|---|
| `code` | `ICOD` | Código comercial del producto. Entre 1 y 13 caracteres; la API comprueba que no exista. |
| `description` | `IDESCR` | Descripción corta. Entre 1 y 60 caracteres. |

Aunque MySQL tiene valores predeterminados vacíos para ambos, la API exige contenido. Además, **la comprobación de código duplicado está en la API; el índice heredado de `ICOD` no es único**.

Para dar de alta un **producto terminado**, también conviene indicar explícitamente su tipo y unidad: si omites el tipo, actualmente la API utiliza materia prima.

**Identificación y clasificación**

| Columna | Para qué sirve | Comportamiento actual |
|---|---|---|
| `ISEQ` | Identificador interno que relaciona el producto con otras tablas. | MySQL lo genera automáticamente. |
| `ICODSAT` | Clave SAT del producto. En nuestro ejemplo: `40171600`. | Está en el SQL actualizado; pendiente de admitir en la API. |
| `ITIPO` | Tipo de artículo: `0` materia prima, `1` terminado, `2` juego, `3` ensamble, `4` servicio. | Opcional; predeterminado `0`. |
| `IFAM` | Clasificación o familia del producto. | Opcional; hasta 16 caracteres en la API. |
| `USEQ` | Identificador de unidad en `FUNIDAD`. Por ejemplo, `3` corresponde a `M` en el producto consultado. | Opcional; predeterminado `1`. |
| `IUM` | Código de unidad almacenado en la ficha. | La API lo obtiene de `FUNIDAD.UCOD`. |
| `IFOTO` | Indicador de que el producto tiene foto. | Opcional; no contiene la imagen. |

**Precios, monedas y costos**

| Columna | Para qué sirve |
|---|---|
| `ILISTA1`, `ILISTA2`, `ILISTA3` | Importes de las tres listas de venta admitidas por el alta actual. |
| `IMONEDA1`, `IMONEDA2`, `IMONEDA3` | Identificador de moneda de cada lista de venta. En la captura de pedidos se utiliza `1` para pesos y `2` para dólares. |
| `ILISTA4` | Costo promedio. |
| `ILISTA5` | Costo último; la validación actual de pedidos lo usa como referencia para productos vendidos en pesos. |
| `ILISTA6` | La validación actual de pedidos lo usa como costo en dólares. El modelo antiguo de la ficha todavía lo denomina “anterior”. |
| `IMONEDA` | Identificador de moneda del bloque de costos de la ficha. |
| `IADVALOREM` | Dato ad valorem asociado al producto; el alta lo almacena sin calcularlo. |

Estos campos son opcionales en la API. Los importes enviados deben ser **mayores o iguales a cero**. Guardar una moneda identifica cómo interpretar un importe; por sí solo no convierte el precio.

**Información de almacén y contabilidad**

| Columna | Para qué sirve |
|---|---|
| `IMINIMO`, `IMAXIMO` | Referencias generales de inventario mínimo y máximo de la ficha. |
| `ILOCALIZ` | Localización del producto; hasta 30 caracteres en la API. |
| `IEAN` | Identificador alternativo. En el ejemplo es `TSC480`; el buscador de pedidos también permite localizar productos mediante este campo. |
| `IUPC` | Otro identificador almacenado en el producto. |
| `ICTA` | Cuenta contable primaria. |
| `ICTADEV` | Cuenta contable secundaria, según el mapeo actual de la ficha. |
| `ICTA3` | Cuenta de costo de ventas. |

Las cuentas son opcionales, pero si envías una con contenido, debe existir en `FBENC`.

Estos datos **no representan una entrada de mercancía**. Las cantidades por almacén se consultan en `FALM`, relacionadas mediante `FALM.ISEQ`, y el almacén mediante `ALMNUM`.

**Valores que completa automáticamente el alta**

| Columna | Valor actual | Motivo |
|---|---|---|
| `IALTA` | `CURDATE()` | Fecha de creación. |
| `IFECHACAMBIO` | `CURDATE()` | Fecha del cambio inicial. |
| `IFECHACAMBIOPR` | `CURDATE()` | Fecha inicial del campo de cambio de precios. |
| `IUM2` | Mismo código de unidad | Inicializa la segunda unidad. |
| `IUM2FACTOR` | `1` | Inicializa una equivalencia de uno a uno. |
| `ICANTCAJA` | `1` | Inicializa la cantidad por caja utilizada por el alta heredada. |
| `ILOTE` | `1` | Valor técnico conservado del alta documentada. |
| `IBODEGA` | `1` | Valor técnico conservado del alta documentada. |
| `IRENGLON` | `'A'` | Valor técnico conservado del alta documentada. |
| `IEDIEMP` | `'BX'` | Valor técnico conservado del alta documentada. |
| `IBAJA` | `'1900-12-31'` | Predeterminado de MySQL que la aplicación interpreta como producto activo. |

El significado funcional exacto de `ILOTE`, `IBODEGA`, `IRENGLON` e `IEDIEMP` todavía no está confirmado en esta versión; por eso se conservan como valores técnicos y no como campos libres de captura.

**Cómo se guarda la descripción extendida en `FINV2`**

| Columna | Función |
|---|---|
| `I2SEQ` | Identificador automático del registro de descripción. |
| `I2KEY` | `ISEQ` del producto al que pertenece. Es la relación que utiliza la consulta. |
| `I2DESCR` | Primer bloque de texto extendido. |
| `I2DESCR2`, `I2DESCR3`, `I2DESCR4` | Bloques adicionales de texto. Cada uno admite hasta 4,800 caracteres en la base revisada. |
| `I2COD` | Código auxiliar del registro. |

Para un producto nuevo, primero se obtiene su **nuevo `ISEQ`** y después se utiliza ese valor en `FINV2.I2KEY`. No se debe copiar el identificador del producto usado como ejemplo