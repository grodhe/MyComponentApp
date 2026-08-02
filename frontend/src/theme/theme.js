import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#2e7d32",
        },

        background: {
            default: "#f5f5f5",
        },

    },

    components: {

        MuiAppBar: {

            styleOverrides: {

                root: {

                    boxShadow: "none",

                }

            }

        }

    }

});

export default theme;