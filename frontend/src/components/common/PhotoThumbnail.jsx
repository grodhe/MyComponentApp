import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

// Small square thumbnail used anywhere a component/generic item shows up
// in a compact list (the Components/Generic Items tables, the Locations
// tree) -- falls back to a placeholder icon if there's no photo (a 404
// from the photo endpoint) or the image otherwise fails to load.
//
// Uses "cover" (crops to fill the square) rather than "contain" -- at
// icon size that reads better than letterboxing, unlike the full-size
// display on the Component Detail page which intentionally shows the
// whole, uncropped photo.
function PhotoThumbnail({ src, alt = "", size = 32, fit = "cover", frame = true }) {

    const [failed, setFailed] = useState(false);

    // Re-arm whenever the src changes (different row, or a cache-busted
    // URL after a re-upload) so a previous failure doesn't stick.
    useEffect(() => {

        setFailed(false);

    }, [src]);

    return (

        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: 0.5,
                overflow: "hidden",
                bgcolor: frame ? "grey.100" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: frame ? "1px solid" : 0,
                borderColor: "divider",
                flexShrink: 0
            }}
        >

            {!failed ? (

                <Box
                    component="img"
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    sx={{ width: "100%", height: "100%", objectFit: fit }}
                />

            ) : (

                <ImageNotSupportedIcon
                    color="disabled"
                    sx={{ fontSize: size * 0.6 }}
                />

            )}

        </Box>

    );

}

export default PhotoThumbnail;
