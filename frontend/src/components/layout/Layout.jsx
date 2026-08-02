import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "./Header";
import Navigation from "./Navigation";

const drawerWidth = 240;

function Layout({ children }) {

    return (

        <Box sx={{ display: "flex" }}>

            <Header />

            <Navigation />
             <Box
               component="main"
               sx={{
               flexGrow: 1,
               bgcolor: "background.default",
               p: 3
               }}
              >
                <Toolbar />

                {children}

            </Box>

        </Box>

    );

}

export default Layout;