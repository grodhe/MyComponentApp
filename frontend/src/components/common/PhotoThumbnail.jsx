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
function PhotoThumbnail({ src, alt = "", size = 32 }) {

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
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
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
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
