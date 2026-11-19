import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Stack,
    CircularProgress
} from "@mui/material";

import { handleScannedValue } from "../../utils/handleScan";

// Works with any USB/Bluetooth "keyboard wedge" barcode scanner -- those
// just type the scanned code into whatever's focused and hit Enter, so
// this is really just a focused text input on a form; no camera, no
// WebUSB/WebHID, no scanner-specific code needed at all.
//
// A scanned value is handled two different ways:
//  - If it looks like one of our own printed label URLs (see
//    LabelPrintArea -- those encode PUBLIC_APP_BASE_URL + a path), jump
//    straight there via the router.
//  - Otherwise it's treated as an inventory barcode: looked up against
//    components, then generic items. A match navigates to that record; no
//    match offers to open the Add dialog for either kind, prefilled with
//    the scanned code.
// Search links for a code that isn't in the inventory yet. Electrokit and
// Elfa go through a Google "site:" search since their own search URLs
// aren't stable to rely on.
const SUPPLIER_SEARCHES = [
    { label: "Electrokit", url: (q) => `https://www.google.com/search?q=${encodeURIComponent(`site:electrokit.com ${q}`)}` },
    { label: "Elfa", url: (q) => `https://www.google.com/search?q=${encodeURIComponent(`site:elfa.se ${q}`)}` },
    { label: "LCSC", url: (q) => `https://www.lcsc.com/search?q=${encodeURIComponent(q)}` },
    { label: "Mouser", url: (q) => `https://www.mouser.com/c/?q=${encodeURIComponent(q)}` },
    { label: "Digi-Key", url: (q) => `https://www.digikey.com/en/products/result?keywords=${encodeURIComponent(q)}` },
    { label: "Google", url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` }
];

function BarcodeScanDialog({ open, onClose, initialValue = "" }) {

    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [value, setValue] = useState("");
    const [status, setStatus] = useState("idle"); // idle | searching | notFound | error
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        if (!open)
            return;

        // initialValue is set when the always-on scanner already looked a
        // code up and found nothing -- go straight to the "add it" choices.
        setValue(initialValue);
        setStatus(initialValue ? "notFound" : "idle");
        setErrorMessage("");

        // Slight delay so focus lands after the dialog's open animation,
        // otherwise some browsers drop it.
        const timer = setTimeout(() => inputRef.current?.focus(), 50);

        return () => clearTimeout(timer);

    }, [open, initialValue]);

    async function handleSubmit(event) {

        event.preventDefault();

        const scanned = value.trim();

        if (!scanned)
            return;

        setStatus("searching");
        setErrorMessage("");

        try {

            // Handles our own label URLs, supplier bag labels (LCSC,
            // Digi-Key) and plain inventory barcodes -- see utils/handleScan.
            const outcome = await handleScannedValue(scanned, navigate);

            if (outcome === "notFound") {

                setStatus("notFound");
                return;

            }

            onClose();

        } catch (err) {

            console.error("Barcode lookup failed:", err);
            setStatus("error");
            setErrorMessage(err.message);

        }

    }

    function handleAddAs(type) {

        const scanned = value.trim();

        if (type === "component") {
            navigate(`/components?addBarcode=${encodeURIComponent(scanned)}`);
        } else {
            navigate(`/generic-items?addBarcode=${encodeURIComponent(scanned)}`);
        }

        onClose();

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                Scan Barcode
            </DialogTitle>

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Stack spacing={2}>

                        <Typography variant="body2" color="text.secondary">
                            Scan with a barcode scanner, or type a code and press Enter.
                        </Typography>

                        <TextField
                            inputRef={inputRef}
                            autoFocus
                            fullWidth
                            label="Barcode"
                            value={value}
                            onChange={(event) => {
                                setValue(event.target.value);
                                setStatus("idle");
                            }}
                            disabled={status === "searching"}
                        />

                        {status === "searching" && (

                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={16} />
                                <Typography variant="body2">
                                    Looking up...
                                </Typography>
                            </Stack>

                        )}

                        {status === "notFound" && (

                            <Stack spacing={1}>

                                <Typography variant="body2" color="text.secondary">
                                    No component or generic item found for "{value.trim()}".
                                </Typography>

                                <Typography variant="body2">
                                    Look it up at a supplier (opens a new tab):
                                </Typography>

                                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">

                                    {SUPPLIER_SEARCHES.map((s) => (

                                        <Button
                                            key={s.label}
                                            size="small"
                                            variant="text"
                                            onClick={() => window.open(s.url(value.trim()), "_blank", "noopener")}
                                        >
                                            {s.label}
                                        </Button>

                                    ))}

                                </Stack>

                                <Stack direction="row" spacing={1}>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleAddAs("component")}
                                    >
                                        Add as Component
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleAddAs("genericItem")}
                                    >
                                        Add as Generic Item
                                    </Button>

                                </Stack>

                            </Stack>

                        )}

                        {status === "error" && (

                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>

                        )}

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!value.trim() || status === "searching"}
                    >
                        Find
                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

export default BarcodeScanDialog;
