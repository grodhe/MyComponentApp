import { AppBar, Toolbar, Typography } from "@mui/material";

function Header() {

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

            </Toolbar>

        </AppBar>

    );

}

export default Header;