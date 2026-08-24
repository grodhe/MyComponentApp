import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";
import ComponentsPage from "./pages/ComponentsPage";
import ComponentDetail from "./pages/ComponentDetailPage";
import InventoryTransactions from "./pages/InventoryTransactionsPage";
import ShoppingList from "./pages/ShoppingListPage";
import GenericItems from "./pages/GenericItemsPage";
import Manufacturers from "./pages/ManufacturersPage";
import Categories from "./pages/CategoriesPage";
import Locations from "./pages/LocationsPage";
import LocationDetail from "./pages/LocationDetailPage";
import Suppliers from "./pages/SuppliersPage";
import Projects from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetailPage";
import Utility from "./pages/UtilityPage";

function App() {

    return (

        <AuthProvider>
            <AppContent />
        </AuthProvider>

    );

}

// Gates the whole app on session status -- checked once on load (see
// AuthContext) and re-checked reactively whenever any API call comes back
// 401. Nothing under Layout/Routes ever renders without a valid session,
// so no individual page needs its own auth check.
function AppContent() {

    const { status } = useAuth();

    if (status === "loading") {

        return (

            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>

        );

    }

    if (status === "unauthenticated") {

        return <LoginPage />;

    }

    return (

        <Layout>

            <Routes>

                <Route
                    path="/"
                    element={<DashboardPage />}
                />

                <Route
                    path="/components"
                    element={<ComponentsPage />}
                />

                <Route
                    path="/components/:id"
                    element={<ComponentDetail />}
                />

                <Route
                    path="/inventory-transactions"
                    element={<InventoryTransactions />}
                />

                <Route
                    path="/shopping-list"
                    element={<ShoppingList />}
                />

                <Route
                    path="/generic-items"
                    element={<GenericItems />}
                />

                <Route
                    path="/manufacturers"
                    element={<Manufacturers />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/locations"
                    element={<Locations />}
                />

                <Route
                    path="/location/:id"
                    element={<LocationDetail />}
                />

                <Route
                    path="/suppliers"
                    element={<Suppliers />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetail />}
                />

                <Route
                    path="/utility"
                    element={<Utility />}
                />

            </Routes>

        </Layout>

    );

}

export default App;
