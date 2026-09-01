const repository = require("../repositories/settingsRepository");

// Defaults used whenever a key hasn't been explicitly set yet (e.g. a
// fresh database before the seed row from migrate_app_settings.sql has
// been applied, or a brand new setting added later that old databases
// won't have a row for). Merged underneath whatever's actually in the
// table, so a missing key never surfaces as undefined to the frontend.
const DEFAULTS = {
    currency_symbol: "kr"
};

// The frontend wants a plain { key: value } object, not an array of rows
// -- much easier to spread into a form and to read from context.
async function getSettings() {

    const rows = await repository.getAll();

    const settings = { ...DEFAULTS };

    for (const row of rows) {
        settings[row.key] = row.value;
    }

    return settings;

}

// `data` is a partial { key: value } object -- only the keys present are
// written, so a settings form can save just the fields it knows about
// without clobbering others. Returns the full updated settings object.
async function updateSettings(data = {}) {

    for (const [key, value] of Object.entries(data)) {

        if (!key || typeof key !== "string") {
            continue;
        }

        await repository.set(key, value === null || value === undefined ? "" : String(value));

    }

    return getSettings();

}

module.exports = {
    getSettings,
    updateSettings
};
