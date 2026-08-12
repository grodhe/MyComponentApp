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

const genericItemsRoutes = require("./routes/genericItemsRoutes");

const projectsRoutes = require("./routes/projectsRoutes");

const projectStatusRoutes = require("./routes/projectStatusRoutes");

const projectComponentsRoutes = require("./routes/projectComponentsRoutes");

const projectDocumentsRoutes = require("./routes/projectDocumentsRoutes");

const projectRepositoriesRoutes = require("./routes/projectRepositoriesRoutes");

const projectTasksRoutes = require("./routes/projectTasksRoutes");

const projectGenericItemsRoutes = require("./routes/projectGenericItemsRoutes");



app.use("/api/components", componentRoutes);

app.use("/api/manufacturers", manufacturersRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/locations", locationsRoutes);

app.use("/api/suppliers", suppliersRoutes);

app.use("/api/generic-items", genericItemsRoutes);

app.use("/api/projects", projectsRoutes);

app.use("/api/project-statuses", projectStatusRoutes);

// nested project sub-resources
app.use("/api/projects/:projectId/components", projectComponentsRoutes);

app.use("/api/projects/:projectId/documents", projectDocumentsRoutes);

app.use("/api/projects/:projectId/repositories", projectRepositoriesRoutes);

app.use("/api/projects/:projectId/tasks", projectTasksRoutes);

app.use("/api/projects/:projectId/generic-items", projectGenericItemsRoutes);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✓ Server listening on port ${PORT}`);
});
