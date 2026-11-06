-- Read-only reference for defining the product import/export profile.
-- Pass the ERP ICOD as a bound parameter. Do not use this SELECT to infer
-- that every non-empty field is required for a new product.

SELECT
    p.*,
    u.UCOD   AS unidad_codigo,
    u.UDESCR AS unidad_descripcion,

    d.I2SEQ    AS descripcion_id,
    d.I2KEY    AS descripcion_producto_id,
    d.I2COD    AS descripcion_codigo,
    d.I2DESCR  AS descripcion_extendida_1,
    d.I2DESCR2 AS descripcion_extendida_2,
    d.I2DESCR3 AS descripcion_extendida_3,
    d.I2DESCR4 AS descripcion_extendida_4

FROM finv p
LEFT JOIN funidad u
    ON u.USEQ = p.USEQ
LEFT JOIN finv2 d
    ON d.I2KEY = p.ISEQ

WHERE p.ICOD = ?

ORDER BY p.ISEQ, d.I2SEQ;
