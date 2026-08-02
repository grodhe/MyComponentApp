import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Components from "./pages/Components";
import Manufacturers from "./pages/Manufacturers";
import Categories from "./pages/Categories";
import Locations from "./pages/Locations";
import Suppliers from "./pages/Suppliers";
import Projects from "./pages/Projects";

function App() {

    return (

        <Layout>

            <Routes>

                <Route
                    path="/"
                    element={<Components />}
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