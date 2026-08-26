import { useState } from "react";

import { AppBar, Toolbar, Typography, Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useAuth } from "../../context/AuthContext";
import BarcodeScanDialog from "../common/BarcodeScanDialog";

function Header() {

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

                <Typography variant="h6">

                    📦 Hobbyist Inventory

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

                        {username && (

                            <Typography variant="body2">
                                {username}
                            </Typography>

                        )}

                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<LogoutIcon />}
                            onClick={logout}
                        >
                            Sign Out
                        </Button>

                    </Stack>

                )}

            </Toolbar>

        </AppBar>

    );

}

export default Header;
