// Minimal RFC4180-style CSV encode/decode. Hand-rolled instead of pulling
// in a dependency, since the only place this is used (component
// import/export) has a known, bounded set of columns and this is small
// enough to fully unit-test on its own.
//
// Handles: quoted fields, embedded commas/quotes/newlines inside quoted
// fields, "" as an escaped quote, \r\n / \n / lone \r line endings, and a
// leading UTF-8 BOM (Excel adds one when it saves a CSV).

function parseCsv(text) {

    if (typeof text !== "string") {
        return { headers: [], records: [] };
    }

    // Strip a leading UTF-8 BOM if present (common when a CSV was
    // saved/re-saved by Excel).
    if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
    }

    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    const len = text.length;
    let i = 0;

    function pushField() {
        row.push(field);
        field = "";
    }

    function pushRow() {
        pushField();
        rows.push(row);
        row = [];
    }

    while (i < len) {

        const char = text[i];

        if (inQuotes) {

            if (char === "\"") {

                if (text[i + 1] === "\"") {
                    field += "\"";
                    i += 2;
                    continue;
                }

                inQuotes = false;
                i += 1;
                continue;

            }

            field += char;
            i += 1;
            continue;

        }

        if (char === "\"") {

            inQuotes = true;
            i += 1;
            continue;

        }

        if (char === ",") {

            pushField();
            i += 1;
            continue;

        }

        if (char === "\r") {

            pushRow();
            i += (text[i + 1] === "\n") ? 2 : 1;
            continue;

        }

        if (char === "\n") {

            pushRow();
            i += 1;
            continue;

        }

        field += char;
        i += 1;

    }

    // Flush a trailing field/row if the text didn't end with a newline.
    if (field.length > 0 || row.length > 0) {
        pushRow();
    }

    // Drop a trailing fully-blank line (e.g. a file that ends with \n\n).
    while (
        rows.length > 0 &&
        rows[rows.length - 1].length === 1 &&
        rows[rows.length - 1][0] === ""
    ) {
        rows.pop();
    }

    if (rows.length === 0) {
        return { headers: [], records: [] };
    }

    const headers = rows[0].map((h) => h.trim());
    const records = [];

    for (let r = 1; r < rows.length; r++) {

        const rawRow = rows[r];

        // Skip blank lines between data rows.
        if (rawRow.length === 1 && rawRow[0] === "") {
            continue;
        }

        const record = {};

        headers.forEach((header, idx) => {
            record[header] = rawRow[idx] !== undefined ? rawRow[idx] : "";
        });

        records.push(record);

    }

    return { headers, records };

}

function escapeField(value) {

    const str = value === null || value === undefined ? "" : String(value);

    if (/[",\n\r]/.test(str)) {
        return "\"" + str.replace(/"/g, "\"\"") + "\"";
    }

    return str;

}

function toCsv(records, columns) {

    const lines = [];

    lines.push(columns.map(escapeField).join(","));

    for (const record of records) {
        lines.push(columns.map((col) => escapeField(record[col])).join(","));
    }

    return lines.join("\r\n") + "\r\n";

}

module.exports = {
    parseCsv,
    toCsv
};
