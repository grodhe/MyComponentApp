const API_URL = import.meta.env.VITE_API_URL;

// Backs the barcode-scan "quick find" dialog -- checks components then
// generic items for a matching barcode. Bypasses api.js's request()
// helper (which throws a plain Error with no status code attached) and
// talks to fetch() directly instead, since a 404 here is an expected,
// normal result (e.g. scanning something not in inventory yet) that the
// caller needs to tell apart from a real failure, not just another error
// message -- same reasoning as the photo endpoints.
export async function lookupInventoryByBarcode(barcode) {

    const response = await fetch(
        `${API_URL}/inventory-lookup?barcode=${encodeURIComponent(barcode)}`,
        { credentials: "include" }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {

        const raw = await response.text();

        let message = raw;

        try {
            message = JSON.parse(raw).error || raw;
        } catch {
            // not JSON, use raw text as-is
        }

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent("hobbyist:unauthorized"));
        }

        throw new Error(message || response.statusText);

    }

    return await response.json();

}
