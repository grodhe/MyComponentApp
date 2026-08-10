import { createPortal } from "react-dom";
import { Box, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

// Renders a single label sized for a Brother DK-22223 (50mm continuous tape)
// roll, via the Brother QL-700's normal Windows/Mac printer driver.
//
// Rendered via a portal directly onto document.body, as a sibling of the
// app's #root -- NOT nested inside the normal component tree. This matters:
// print CSS hides #root and shows only this element, and because it's a
// sibling rather than a descendant, hiding #root also collapses its layout
// height to zero, so the printed page is exactly this label's size with no
// extra blank pages. (An earlier visibility:hidden/visible version kept
// #root's full height in the document flow even while invisible, which is
// why label printing was producing extra blank pages.)
//
// `lines` is an ordered array of text to print, one per row, next to the QR
// code. The first line is styled as the title (bold, larger); any further
// lines are printed smaller underneath it, in order. Empty/falsy lines are
// skipped automatically.
//
// `qrValue`, if given, prints a QR code on the left of the label encoding
// that URL/text -- e.g. a link back to that drawer's or component's page,
// so scanning the label with a phone opens it directly. Rendered as an SVG
// (not a canvas/img) so it stays crisp at print size and needs no async
// image load, which would otherwise risk racing window.print().
//
// To print a label: render this with the item to print, then call
// window.print(). The user picks "Brother QL-700" from the print dialog
// (do this once and Windows/your browser will usually remember it).
function LabelPrintArea({ lines = [], qrValue = null }) {

    const content = lines.filter(Boolean);

    if (content.length === 0 && !qrValue) {
        return null;
    }

    return createPortal(

        <div id="label-print-area">

            <Box
                sx={{
                    width: "50mm",
                    height: "30mm",
                    boxSizing: "border-box",
                    padding: "2mm 3mm",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "2.5mm"
                }}
            >

                {qrValue && (

                    <Box
                        sx={{
                            width: "22mm",
                            height: "22mm",
                            flexShrink: 0,
                            "& svg": {
                                width: "100%",
                                height: "100%"
                            }
                        }}
                    >
                        <QRCodeSVG
                            value={qrValue}
                            size={128}
                            level="M"
                        />
                    </Box>

                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: 0,
                        flex: 1
                    }}
                >

                    {content.map((line, index) => (

                        <Typography
                            key={index}
                            sx={{
                                fontSize: index === 0 ? "11pt" : "8pt",
                                fontWeight: index === 0 ? "bold" : "normal",
                                lineHeight: 1.15,
                                mt: index === 0 ? 0 : "0.6mm",
                                wordBreak: "break-word"
                            }}
                        >
                            {line}
                        </Typography>

                    ))}

                </Box>

            </Box>

        </div>,

        document.body

    );

}

export default LabelPrintArea;
