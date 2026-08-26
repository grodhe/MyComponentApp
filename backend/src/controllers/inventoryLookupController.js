// Backs the barcode-scan "quick find" feature -- given a scanned code,
// checks components first, then generic items, and reports back which
// kind of record (if any) matched. Kept as its own small controller
// rather than folded into componentsControllers/genericItemsControllers
// since it genuinely spans both entity types.

const componentsRepository = require("../repositories/componentsRepository");
const genericItemsRepository = require("../repositories/genericItemsRepository");

async function lookupByBarcode(req, res) {

    try {

        const barcode = (req.query.barcode || "").trim();

        if (!barcode) {

            return res.status(400).json({
                error: "A barcode query parameter is required."
            });

        }

        const component = await componentsRepository.findByBarcode(barcode);

        if (component) {

            return res.json({
                type: "component",
                id: component.id,
                displayName: `${component.part_number}${component.part_name ? ` - ${component.part_name}` : ""}`
            });

        }

        const genericItem = await genericItemsRepository.findByBarcode(barcode);

        if (genericItem) {

            return res.json({
                type: "genericItem",
                id: genericItem.id,
                displayName: genericItem.name
            });

        }

        res.status(404).json({
            error: `No component or generic item found for barcode "${barcode}".`
        });

    } catch (err) {

        console.error("Barcode lookup failed:", err);

        res.status(500).json({
            error: "Barcode lookup failed."
        });

    }

}

module.exports = {
    lookupByBarcode
};
