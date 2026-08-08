import { createPortal } from "react-dom";
import { Box, Typography } from "@mui/material";

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
// To print a label: render this with the item to print, then call
// window.print(). The user picks "Brother QL-700" from the print dialog
// (do this once and Windows/your browser will usually remember it).
function LabelPrintArea({ title, subtitle }) {

    if (!title) {
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
                    flexDirection: "column",
                    justifyContent: "center"
                }}
            >

                <Typography
                    sx={{
                        fontSize: "14pt",
                        fontWeight: "bold",
                        lineHeight: 1.15,
                        wordBreak: "break-word"
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (

                    <Typography
                        sx={{
                            fontSize: "9pt",
                            lineHeight: 1.2,
                            mt: "1mm",
                            wordBreak: "break-word"
                        }}
                    >
                        {subtitle}
                    </Typography>

                )}

            </Box>

        </div>,

        document.body

    );

}

export default LabelPrintArea;
