import {

    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemText

} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 180;

const menu = [

    {
        text: "Components",
        path: "/"
    },

    {
        text: "Generic Items",
        path: "/generic-items"
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
        text: "Projects",
        path: "/projects"
    }

];

function Navigation() {

    const location = useLocation();

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
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

                    >

                        <ListItemText primary={item.text} />

                    </ListItemButton>

                ))}

            </List>

        </Drawer>

    );

}

export default Navigation;