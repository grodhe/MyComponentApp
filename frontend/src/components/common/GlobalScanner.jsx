import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BarcodeScanDialog from "./BarcodeScanDialog";
import { handleScannedValue } from "../../utils/handleScan";

const MIN_LENGTH = 6;
const MAX_AVG_GAP_MS = 40;   // scanners "type" far faster than people
const MAX_GAP_MS = 100;

// Lets a USB/Bluetooth keyboard-wedge scanner work anywhere in the app,
// not just inside the Scan Barcode dialog: a burst of very fast keystrokes
// ending in Enter is treated as a scan. Ignored while typing in a text
// field, so normal typing (and the Scan dialog's own input) is unaffected.
function GlobalScanner() {

    const navigate = useNavigate();

    const bufferRef = useRef("");
    const timesRef = useRef([]);

    const [fallbackValue, setFallbackValue] = useState(null);

    useEffect(() => {

        function reset() {
            bufferRef.current = "";
            timesRef.current = [];
        }

        async function onKeyDown(event) {

            const target = event.target;

            if (
                target instanceof HTMLElement &&
                (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
            ) {
                reset();
                return;
            }

            if (event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            const now = performance.now();
            const times = timesRef.current;

            if (times.length > 0 && now - times[times.length - 1] > MAX_GAP_MS) {
                reset();
            }

            if (event.key === "Enter") {

                const value = bufferRef.current;
                const gaps = timesRef.current.slice(1).map((t, i) => t - timesRef.current[i]);
                const avgGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : Infinity;

                reset();

                if (value.length >= MIN_LENGTH && avgGap <= MAX_AVG_GAP_MS) {

                    event.preventDefault();

                    try {

                        const outcome = await handleScannedValue(value, navigate);

                        if (outcome === "notFound") {
                            setFallbackValue(value);
                        }

                    } catch (err) {

                        console.error("Scan failed:", err);
                        alert(`Scan failed: ${err.message}`);

                    }

                }

                return;

            }

            if (event.key.length === 1) {
                bufferRef.current += event.key;
                timesRef.current.push(now);
            }

        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);

    }, [navigate]);

    // A plain barcode that matched nothing: reuse the Scan dialog so the
    // usual "Add as Component / Generic Item" choices appear.
    return (
        <BarcodeScanDialog
            open={fallbackValue !== null}
            initialValue={fallbackValue ?? ""}
            onClose={() => setFallbackValue(null)}
        />
    );

}

export default GlobalScanner;
