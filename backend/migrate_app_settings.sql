-- General-purpose app-wide settings, as plain key/value text pairs --
-- meant to hold small config values that shouldn't be hard-coded in the
-- frontend (starting with the currency label shown next to prices), and
-- to grow to hold future settings later without needing a new migration
-- each time. Idempotent -- safe to run against a database that's already
-- been migrated.

CREATE TABLE IF NOT EXISTS app_settings (
    key   TEXT PRIMARY KEY,
    value TEXT
);

INSERT INTO app_settings (key, value)
VALUES ('currency_symbol', 'kr')
ON CONFLICT (key) DO NOTHING;
