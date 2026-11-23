import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    // Page titles (variant h4) are a bit smaller on phones.
    typography: {
        h4: {
            fontSize: "2.125rem",
            "@media (max-width:899.95px)": {
                fontSize: "1.6rem"
            }
        }
    },

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

        // Nothing is allowed to make the page wider than the screen -- when
        // something does (a long unbroken string, a wide table), phones end
        // up zoomed out or cut off at the edge, and pinch-zoom feels off.
        MuiCssBaseline: {

            styleOverrides: {

                "html, body": {
                    maxWidth: "100%",
                    overflowX: "hidden"
                },

                // MUI sizes text, buttons and inputs in rem, so lowering the
                // base size on phones shrinks all of it at once (16px -> 13px).
                html: {
                    "@media (max-width:899.95px)": {
                        fontSize: "81.25%"
                    }
                },

                body: {
                    overflowWrap: "break-word"
                }

            }

        },

        // Form dialogs (sm/md/lg width) open full screen on phones, so fields
        // and the Save/Cancel buttons aren't squeezed into a small floating
        // box. Small confirm/scan dialogs (xs width) are left as they are.
        MuiDialog: {

            styleOverrides: {

                paper: ({ theme }) => ({

                    [theme.breakpoints.down("sm")]: {

                        "&.MuiDialog-paperWidthSm, &.MuiDialog-paperWidthMd, &.MuiDialog-paperWidthLg": {
                            margin: 0,
                            width: "100%",
                            maxWidth: "100%",
                            height: "100%",
                            maxHeight: "none",
                            borderRadius: 0
                        }

                    }

                })

            }

        },

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