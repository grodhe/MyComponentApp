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
                    path="/suppliers"
                    element={<Suppliers />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

            </Routes>

        </Layout>

    );

}

export default App;
