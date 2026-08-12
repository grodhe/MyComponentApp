import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import DashboardPage from "./pages/DashboardPage";
import ComponentsPage from "./pages/ComponentsPage";
import ComponentDetail from "./pages/ComponentDetailPage";
import InventoryTransactions from "./pages/InventoryTransactionsPage";
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
