import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./theme/theme";
import "./printLabel.css";

// When this app is deployed under a path prefix (e.g. production serves it
// at https://rodhelind.se/hobbyist/, not the domain root), React Router
// needs to know that prefix -- otherwise it matches routes against the
// FULL browser URL (e.g. "/hobbyist/components/3") against route
// definitions written as "/components/:id", which never matches, and the
// page renders blank (the nav/header still show since they're outside
// routing, which is why a blank content area can look like "the app
// loaded" at a glance).
//
// Reads from VITE_BASE_PATH, matching the same env-per-environment
// pattern already used for VITE_API_URL: set it to "/hobbyist" in
// production and leave it unset (defaults to "/") in development. This
// needs a rebuild to take effect, same as any other VITE_ var -- Vite
// bakes it in at build time.
const basename = import.meta.env.VITE_BASE_PATH || "/";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <BrowserRouter basename={basename}>

            <ThemeProvider theme={theme}>

                <CssBaseline />

                <App />

            </ThemeProvider>

        </BrowserRouter>

    </React.StrictMode>

);
