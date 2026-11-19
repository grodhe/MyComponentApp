// Best-effort parsing of the 2D/QR codes printed on supplier bag labels.
// Returns { supplier, supplier_part_number, manufacturer_part_number,
// quantity, url } or null when the text isn't a recognised supplier code.

// LCSC: e.g. {pbn:PICK211019100003,on:SO2110190475,pc:C393099,pm:RLM10JTSMR010,qty:100,...}
// pc = LCSC part number, pm = manufacturer part number.
function parseLcsc(text) {

    const trimmed = text.trim();

    if (!trimmed.startsWith("{") || !/\bpc:/.test(trimmed)) {
        return null;
    }

    const fields = {};

    for (const match of trimmed.matchAll(/(\w+):([^,}]*)/g)) {
        fields[match[1]] = match[2].trim();
    }

    if (!fields.pc && !fields.pm) {
        return null;
    }

    const qty = parseInt(fields.qty, 10);

    return {
        supplier: "LCSC",
        supplier_part_number: fields.pc || "",
        manufacturer_part_number: fields.pm || "",
        quantity: Number.isNaN(qty) ? null : qty,
        url: fields.pc ? `https://www.lcsc.com/product-detail/${encodeURIComponent(fields.pc)}.html` : null
    };

}

// ECIA / ISO 15434 format 06 (Digi-Key and others): "[)>" header, fields
// separated by GS (0x1D) / RS (0x1E) control characters, each prefixed with
// an identifier: 1P = manufacturer part number, 30P = Digi-Key part number,
// P = customer/distributor part number, Q = quantity.
// Some scanners drop the control characters when "typing" the code; without
// them the fields can't be separated, so this returns null in that case.
function parseEcia(text) {

    if (!text.startsWith("[)>")) {
        return null;
    }

    const segments = text.split(/[\x1d\x1e]/).map((s) => s.trim()).filter(Boolean);

    if (segments.length < 3) {
        return null;
    }

    const fields = {};

    for (const segment of segments) {

        const match = segment.match(/^(30P|1P|P|Q|K)(.+)$/);

        if (match && !(match[1] in fields)) {
            fields[match[1]] = match[2];
        }

    }

    const mpn = fields["1P"] || "";
    const spn = fields["30P"] || fields.P || "";

    if (!mpn && !spn) {
        return null;
    }

    const qty = parseInt(fields.Q, 10);
    const isDigiKey = !!fields["30P"];

    return {
        supplier: isDigiKey ? "Digi-Key" : "",
        supplier_part_number: spn,
        manufacturer_part_number: mpn,
        quantity: Number.isNaN(qty) ? null : qty,
        url: isDigiKey
            ? `https://www.digikey.com/en/products/result?keywords=${encodeURIComponent(spn)}`
            : null
    };

}

export function parseSupplierScan(text) {

    return parseLcsc(text) || parseEcia(text);

}
