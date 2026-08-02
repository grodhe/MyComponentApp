import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import ComponentsPage from "./pages/ComponentsPage";
import Manufacturers from "./pages/ManufacturersPage";
import Categories from "./pages/CategoriesPage";
import Locations from "./pages/LocationsPage";
import Suppliers from "./pages/SuppliersPage";
import Projects from "./pages/ProjectsPage";

function App() {

    return (

        <Layout>

            <Routes>

                <Route
                    path="/"
                    element={<ComponentsPage />}
                />

                <Route
                    path="/manufacturersPage"
                    element={<Manufacturers />}
                />

                <Route
                    path="/categoriesPage"
                    element={<Categories />}
                />

                <Route
                    path="/locationsPage"
                    element={<Locations />}
                />

                <Route
                    path="/suppliersPage"
                    element={<Suppliers />}
                />

                <Route
                    path="/projectsPage"
                    element={<Projects />}
                />

            </Routes>

        </Layout>

    );

}

export default App;