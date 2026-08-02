import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "./components/layout/Header";
import Navigation from ".components/layout/Navigation";

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