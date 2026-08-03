set search_path = pigges;
BEGIN;

\i seed/01_Manufacturers.sql
\i seed/02_Categories.sql
\i seed/03_Locations.sql
\i seed/04_Suppliers.sql
\i seed/05_Components.sql
\i seed/06_ComponentSuppliers.sql
COMMIT;