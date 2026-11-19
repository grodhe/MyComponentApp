import { PUBLIC_APP_BASE_URL } from "../config";
import { lookupInventoryByBarcode, lookupInventoryBySupplierPart } from "../services/inventoryLookupService";
import { parseSupplierScan } from "./supplierScan";

// Shared by the Scan Barcode dialog and the always-on scanner listener.
// Returns "navigated" when it took the user somewhere, or "notFound" when
// the code is a plain barcode that matched nothing (the caller decides what
// to offer). Throws on real lookup failures.
export async function handleScannedValue(scanned, navigate) {

    // Our own printed label URLs.
    if (scanned.startsWith(PUBLIC_APP_BASE_URL)) {

        navigate(scanned.slice(PUBLIC_APP_BASE_URL.length) || "/");
        return "navigated";

    }

    // A code already saved in a component's/generic item's Barcode field
    // always wins -- including supplier label codes saved as-is when the
    // part was first added -- so rescanning a known part opens it instead
    // of offering to add it again.
    const known = await lookupInventoryByBarcode(scanned);

    if (known) {

        if (known.type === "component") {
            navigate(`/components/${known.id}`);
        } else {
            navigate(`/generic-items?open=${known.id}`);
        }

        return "navigated";

    }

    // Supplier bag labels (LCSC, Digi-Key...).
    const supplier = parseSupplierScan(scanned);

    if (supplier) {

        const existing = await lookupInventoryBySupplierPart({
            spn: supplier.supplier_part_number,
            mpn: supplier.manufacturer_part_number
        });

        if (existing) {

            navigate(`/components/${existing.id}`);
            return "navigated";

        }

        // New part: open the supplier's product page next to the app so
        // details can be copied, and open Add Component prefilled.
        if (supplier.url) {
            window.open(supplier.url, "_blank", "noopener");
        }

        const params = new URLSearchParams();

        if (supplier.supplier_part_number) params.set("addSpn", supplier.supplier_part_number);
        if (supplier.manufacturer_part_number) params.set("addMpn", supplier.manufacturer_part_number);
        if (supplier.quantity) params.set("addQty", String(supplier.quantity));

        // Saved in the new component's Barcode field so rescanning the same
        // label later finds it instead of offering to add it again.
        params.set("addRaw", scanned);

        navigate(`/components?${params.toString()}`);
        return "navigated";

    }

    // Many supplier labels (e.g. Electrokit) carry a QR that is simply a
    // link to the product page: open it in a new tab so details can be
    // copied, and open Add Component with the code saved as its barcode.
    if (/^https?:\/\//i.test(scanned)) {

        window.open(scanned, "_blank", "noopener");

        navigate(`/components?addBarcode=${encodeURIComponent(scanned)}`);
        return "navigated";

    }

    return "notFound";

}
