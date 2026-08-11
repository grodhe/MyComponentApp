SET search_path = compo;
-- Test data for generic_items and project_generic_items.
--
-- Safe to run more than once: each INSERT is guarded by a NOT EXISTS check,
-- so re-running this script won't create duplicates.
--
-- category_id/location_id/supplier_id are looked up by name against your
-- existing categories/locations/suppliers tables. If a name below doesn't
-- exist in your data, that column is just left NULL -- nothing fails.
-- Adjust the names in the subqueries if you want tighter matches.

-- 10 generic (non-component) items: enclosures, hardware, cable, etc.

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'ABS Enclosure 100x60x25mm', 'Black plastic project box, screw-together',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf B2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-1591XXBK', 'pcs', 14, 2, 'https://example.com/enclosure-100x60x25', 'Fits most single-PCB projects'
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'M3x8 Socket Head Screw', 'Stainless steel, for enclosure/PCB mounting',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-91292A115', 'pcs', 200, 50, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'M3x8 Socket Head Screw');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'M3 Brass Standoff 10mm', 'Male-female, PCB mounting',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-91780A123', 'pcs', 80, 20, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'M3 Brass Standoff 10mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Heat Shrink Tubing 3mm', 'Black, 1m sticks',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-HS3MM', 'm', 25, 5, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Heat Shrink Tubing 3mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Hookup Wire 22AWG Red', 'Stranded, 10m spool',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-WIRE22R', 'm', 40, 10, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Hookup Wire 22AWG Red');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Hookup Wire 22AWG Black', 'Stranded, 10m spool',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C1' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'DigiKey' LIMIT 1),
       'DK-WIRE22B', 'm', 40, 10, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Hookup Wire 22AWG Black');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'USB-C Panel Mount Cable 30cm', 'Male to female, for enclosure passthrough',
       (SELECT id FROM categories WHERE name = 'Cable' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf B3' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'Amazon' LIMIT 1),
       'AMZ-USBC-PM30', 'pcs', 6, 2, 'https://example.com/usbc-panel-mount', NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Cable Tie 100mm', 'Nylon, black, pack of 100',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-7130K12', 'pack', 4, 1, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Cable Tie 100mm');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Thermal Paste 1g', 'For heatsink/regulator mounting',
       (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Shelf C2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'Amazon' LIMIT 1),
       'AMZ-THERM-1G', 'pcs', 3, 1, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Thermal Paste 1g');

INSERT INTO generic_items (name, description, category_id, location_id, supplier_id, part_number, unit, quantity, minimum_quantity, reference_url, notes)
SELECT 'Adhesive Cable Clip', 'Self-adhesive, for internal wire routing',
       (SELECT id FROM categories WHERE name = 'Hardware' LIMIT 1),
       (SELECT id FROM locations WHERE name = 'Bin A2' LIMIT 1),
       (SELECT id FROM suppliers WHERE name = 'McMaster-Carr' LIMIT 1),
       'MC-1919A11', 'pcs', 60, 10, NULL, 'Good for keeping wiring off PCB edges'
WHERE NOT EXISTS (SELECT 1 FROM generic_items WHERE name = 'Adhesive Cable Clip');

-- Link a few of the seeded items to your two earliest projects (by id), so
-- the "Parts" tab has something to show. If you have no projects yet, each
-- of these inserts just matches 0 rows -- nothing fails.

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm'),
       1, 'main enclosure'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'ABS Enclosure 100x60x25mm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw'),
       4, 'lid screws'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'M3x8 Socket Head Screw')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm'),
       4, NULL
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 0)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'M3 Brass Standoff 10mm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm'),
       1, 'front panel port'
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'USB-C Panel Mount Cable 30cm')
  );

INSERT INTO project_generic_items (project_id, generic_item_id, quantity, notes)
SELECT (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm'),
       1, NULL
WHERE (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1) IS NOT NULL
  AND (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM project_generic_items
      WHERE project_id = (SELECT id FROM projects ORDER BY id LIMIT 1 OFFSET 1)
        AND generic_item_id = (SELECT id FROM generic_items WHERE name = 'Cable Tie 100mm')
  );
