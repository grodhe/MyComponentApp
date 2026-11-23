import { useState } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "./Header";
import Navigation from "./Navigation";
import GlobalScanner from "../common/GlobalScanner";

function Layout({ children }) {

    // Only used on narrow screens, where the side menu becomes a slide-out.
    const [menuOpen, setMenuOpen] = useState(false);

    return (

        <Box sx={{ display: "flex", maxWidth: "100%", overflowX: "clip" }}>

            <Header onMenuClick={() => setMenuOpen(true)} />

            <Navigation
                mobileOpen={menuOpen}
                onMobileClose={() => setMenuOpen(false)}
            />

            <GlobalScanner />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    maxWidth: "100%",
                    bgcolor: "background.default",
                    p: { xs: 1.5, md: 3 }
                }}
            >
                <Toolbar />

                {children}

            </Box>

        </Box>

    );

}

export default Layout;
