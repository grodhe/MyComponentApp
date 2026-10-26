-- Favorites flag for components. Idempotent.
ALTER TABLE components ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT FALSE;
