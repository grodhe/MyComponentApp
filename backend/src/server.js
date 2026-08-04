const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Component API is running"
    });
});

const componentRoutes = require("./routes/componentsRoutes");

const manufacturersRoutes = require("./routes/manufacturersRoutes");

const categoriesRoutes = require("./routes/categoriesRoutes");

const locationsRoutes = require("./routes/locationsRoutes");

const suppliersRoutes = require("./routes/suppliersRoutes");


app.use("/api/components", componentRoutes);

app.use("/api/manufacturers", manufacturersRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/locations", locationsRoutes);

app.use("/api/suppliers", suppliersRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✓ Server listening on port ${PORT}`);
});