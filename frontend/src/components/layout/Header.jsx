import { useState } from "react";

import { AppBar, Toolbar, Typography, Box, Button, IconButton, Stack, Tooltip, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useAuth } from "../../context/AuthContext";
import BarcodeScanDialog from "../common/BarcodeScanDialog";

function Header({ onMenuClick }) {

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const { username, authEnabled, logout } = useAuth();
    const [scanDialogOpen, setScanDialogOpen] = useState(false);

    return (

        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >

            <Toolbar>

                {isMobile && (

                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>

                )}

                <Typography variant="h6" noWrap>

                    {isMobile ? "📦 Hobbyist" : "📦 Hobbyist Inventory"}

                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Tooltip title="Scan Barcode">
                    <IconButton
                        color="inherit"
                        onClick={() => setScanDialogOpen(true)}
                        sx={{ mr: 1 }}
                    >
                        <QrCodeScannerIcon />
                    </IconButton>
                </Tooltip>

                <BarcodeScanDialog
                    open={scanDialogOpen}
                    onClose={() => setScanDialogOpen(false)}
                />

                {authEnabled && (

                    <Stack direction="row" spacing={2} alignItems="center">

                        {username && !isMobile && (

                            <Typography variant="body2">
                                {username}
                            </Typography>

                        )}

                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<LogoutIcon />}
                            onClick={logout}
                            sx={isMobile ? { minWidth: 0, "& .MuiButton-startIcon": { m: 0 } } : undefined}
                        >
                            {isMobile ? "" : "Sign Out"}
                        </Button>

                    </Stack>

                )}

            </Toolbar>

        </AppBar>

    );

}

export default Header;
