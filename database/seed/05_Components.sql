------------------------------------------------------------
-- ESP32-C6
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

datasheet_url,
notes
)

SELECT

'ESP32-C6',

'ESP32-C6 Module',

'WiFi 6 / BLE / Thread Module',

m.id,

c.id,

l.id,

'ESP32-C6-WROOM-1-N8',

'Module',

'ESP32-C6-WROOM',

NULL,

18,

5,

'https://www.espressif.com',

'Matter Gateway'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Espressif'
AND c.name='Microcontrollers'
AND l.name='Drawer A1';



------------------------------------------------------------
-- LM2596S
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

datasheet_url,
notes
)

SELECT

'LM2596S',

'Buck Converter',

'Buck Regulator',

m.id,

c.id,

l.id,

'LM2596SX-5.0',

'TO-263',

'TO-263-5',

'5V',

42,

10,

'https://www.ti.com',

'Power Supply'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Texas Instruments'
AND c.name='Power'
AND l.name='Drawer A2';



------------------------------------------------------------
-- 74HC595
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,

quantity,
minimum_quantity
)

SELECT

'74HC595',

'Shift Register',

'8-bit Shift Register',

m.id,

c.id,

l.id,

'74HC595D',

'SOIC-16',

'SOIC-16_3.9x9.9mm',

120,

20

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Nexperia'
AND c.name='Logic'
AND l.name='Drawer B1';



------------------------------------------------------------
-- HX711
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,
component_value,

quantity,
minimum_quantity,

notes
)

SELECT

'HX711',

'Load Cell ADC',

'24-bit ADC for Load Cells',

m.id,

c.id,

l.id,

'HX711',

'SOP-16',

'SOIC-16',

'24-bit',

25,

5,

'BeeScale'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='STMicroelectronics'
AND c.name='Sensors'
AND l.name='Drawer C1';



------------------------------------------------------------
-- BME280
------------------------------------------------------------

INSERT INTO compo.components
(
part_number,
part_name,
description,

manufacturer_id,
category_id,
location_id,

manufacturer_part_number,

package,
footprint,

quantity,
minimum_quantity,

datasheet_url
)

SELECT

'BME280',

'Environmental Sensor',

'Temperature / Humidity / Pressure',

m.id,

c.id,

l.id,

'BME280',

'LGA-8',

'LGA-8',

14,

3,

'https://www.bosch-sensortec.com'

FROM compo.manufacturers m,
     compo.categories c,
     compo.locations l

WHERE

m.name='Bosch Sensortec'
AND c.name='Sensors'
AND l.name='Drawer C1';