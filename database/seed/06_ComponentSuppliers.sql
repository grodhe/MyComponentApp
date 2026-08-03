------------------------------------------------------------
-- Component Suppliers
------------------------------------------------------------

INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency,
minimum_order_quantity,
order_multiple,
lead_time_days,
preferred_supplier
)

SELECT

c.id,
s.id,

'ESP32-C6-WROOM-1-N8',

'https://www.mouser.com',

4.85,

'USD',

1,

1,

14,

TRUE

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='ESP32-C6'
AND s.name='Mouser';



INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency
)

SELECT

c.id,
s.id,

'C5295814',

'https://www.lcsc.com',

3.42,

'USD'

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='ESP32-C6'
AND s.name='LCSC';



INSERT INTO compo.component_suppliers
(
component_id,
supplier_id,
supplier_part_number,
supplier_url,
unit_price,
currency,
preferred_supplier
)

SELECT

c.id,
s.id,

'74HC595D',

'https://www.mouser.com',

0.42,

'USD',

TRUE

FROM compo.components c,
     compo.suppliers s

WHERE

c.part_number='74HC595'
AND s.name='Mouser';