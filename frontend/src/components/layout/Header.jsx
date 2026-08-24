import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";

function Header() {

    const { username, logout } = useAuth();

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

            </Toolbar>

        </AppBar>

    );

}

export default Header;
