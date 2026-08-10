-- Drawer A1, A2, A3, Drawer B1 -> Cabinet 1 (id 16)
UPDATE compo.locations
SET parent_id = 16
WHERE id IN (1, 2, 3, 4);

-- Drawer C1, C2, Shelf 1, Shelf 2, Shelf3, Shelf4 -> Cabinet2 (id 15)
UPDATE compo.locations
SET parent_id = 15
WHERE id IN (6, 7, 8, 9, 11, 14);

SELECT id, name, parent_id FROM compo.locations ORDER BY id;