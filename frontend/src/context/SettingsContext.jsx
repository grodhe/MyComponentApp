import { createContext, useContext, useEffect, useState } from "react";

import { getSettings as fetchSettings, updateSettings as saveSettings } from "../services/settingsService";

const SettingsContext = createContext(null);

// Sensible fallback so components can read settings.currency_symbol etc.
// immediately on first render, before the initial fetch below resolves --
// mirrors the backend's own DEFAULTS in settingsServices.js.
const DEFAULTS = {
    currency_symbol: "kr"
};

// Loaded once, mirroring AuthContext's pattern -- this is only ever
// mounted inside the authenticated part of the app (see App.jsx), so
// there's always a valid session by the time this fetches.
export function SettingsProvider({ children }) {

    const [settings, setSettings] = useState(DEFAULTS);

    async function load() {

        try {

            const data = await fetchSettings();
            setSettings(data);

        } catch (err) {

            console.error("Failed to load settings:", err);

        }

    }

    useEffect(() => {

        load();

    }, []);

    // Saves a partial update and refreshes local state from the backend's
    // response, so every consumer of useSettings() re-renders with the new
    // value immediately -- no separate reload needed after a save.
    async function updateSettings(data) {

        const updated = await saveSettings(data);
        setSettings(updated);

        return updated;

    }

    return (

        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>

    );

}

export function useSettings() {

    return useContext(SettingsContext);

}
