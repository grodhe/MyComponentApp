------------------------------------------------------------
-- Manufacturers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_manufacturers_name
ON compo.manufacturers(name);

------------------------------------------------------------
-- Categories
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_categories_name
ON compo.categories(name);

------------------------------------------------------------
-- Locations
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_locations_name
ON compo.locations(name);

------------------------------------------------------------
-- Suppliers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_suppliers_name
ON compo.suppliers(name);

CREATE INDEX IF NOT EXISTS idx_suppliers_country
ON compo.suppliers(country);

------------------------------------------------------------
-- Components
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_components_part_number
ON compo.components(part_number);

CREATE INDEX IF NOT EXISTS idx_components_part_name
ON compo.components(part_name);

CREATE INDEX IF NOT EXISTS idx_components_manufacturer
ON compo.components(manufacturer_id);

CREATE INDEX IF NOT EXISTS idx_components_category
ON compo.components(category_id);

CREATE INDEX IF NOT EXISTS idx_components_location
ON compo.components(location_id);

CREATE INDEX IF NOT EXISTS idx_components_package
ON compo.components(package);

CREATE INDEX IF NOT EXISTS idx_components_value
ON compo.components(component_value);

------------------------------------------------------------
-- Component Suppliers
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_component_suppliers_component
ON compo.component_suppliers(component_id);

CREATE INDEX IF NOT EXISTS idx_component_suppliers_supplier
ON compo.component_suppliers(supplier_id);

CREATE INDEX IF NOT EXISTS idx_component_suppliers_preferred
ON compo.component_suppliers(preferred_supplier);