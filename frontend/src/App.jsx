import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import ComponentsPage from "./pages/ComponentsPage";
import GenericItems from "./pages/GenericItemsPage";
import Manufacturers from "./pages/ManufacturersPage";
import Categories from "./pages/CategoriesPage";
import Locations from "./pages/LocationsPage";
import Suppliers from "./pages/SuppliersPage";
import Projects from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetailPage";

function App() {

    return (

        <Layout>

            <Routes>

                <Route
                    path="/"
                    element={<ComponentsPage />}
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

            </Routes>

        </Layout>

    );

}

export default App;
