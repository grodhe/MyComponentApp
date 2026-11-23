import {

    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemText,
    useMediaQuery

} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 180;

const menu = [

    {
        text: "Dashboard",
        path: "/"
    },

    {
        text: "Components",
        path: "/components"
    },

    {
        text: "Manufacturers",
        path: "/manufacturers"
    },

    {
        text: "Categories",
        path: "/categories"
    },

    {
        text: "Locations",
        path: "/locations"
    },

    {
        text: "Suppliers",
        path: "/suppliers"
    },

    {
        text: "Inventory Transactions",
        path: "/inventory-transactions"
    },

    {
        text: "Shopping List",
        path: "/shopping-list"
    },

    {
        text: "Generic Items",
        path: "/generic-items"
    },

    {
        text: "Projects",
        path: "/projects"
    },

    {
        text: "Utility",
        path: "/utility"
    }

];

function Navigation({ mobileOpen = false, onMobileClose }) {

    const location = useLocation();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    return (

        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={onMobileClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: isMobile ? 0 : drawerWidth,
                flexShrink: 0,
               "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  top: 0
                }
            }}
        >

            <Toolbar />

            <List>

                {menu.map(item => (

                    <ListItemButton

                        key={item.path}

                        component={Link}

                        to={item.path}

                        selected={location.pathname === item.path}

                        onClick={isMobile ? onMobileClose : undefined}

                    >

                        <ListItemText primary={item.text} />

                    </ListItemButton>

                ))}

            </List>

        </Drawer>

    );

}

export default Navigation;
