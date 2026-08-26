const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const requireAuth = require("./middleware/requireAuth");
const authRoutes = require("./routes/authRoutes");
const fs = require("fs");
const config = require("./config/app");
const inventoryLookupRoutes = require("./routes/inventoryLookupRoutes");

fs.mkdirSync(config.uploads.componentsDir, { recursive: true });
fs.mkdirSync(config.uploads.genericItemsDir, { recursive: true });
const app = express();

// `origin: true` reflects whatever origin made the request instead of a
// fixed one -- needed alongside `credentials: true` so the session cookie
// actually gets sent/accepted, whether the frontend and backend end up on
// the same origin (prod, behind the reverse proxy) or different ports
// (local dev).
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Component API is running"
    });
});

// Login/logout have to be public (you don't have a session yet when
// logging in). Everything else registered after the requireAuth line
// below needs a valid session cookie.
app.use("/api/auth", authRoutes);
app.use("/api", requireAuth);

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

const componentTransactionsRoutes = require("./routes/componentTransactionsRoutes");
const inventoryTransactionsRoutes = require("./routes/inventoryTransactionsRoutes");
const shoppingListRoutes = require("./routes/shoppingListRoutes");


app.use("/api/inventory-lookup", inventoryLookupRoutes);
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

app.use("/api/components/:componentId/transactions", componentTransactionsRoutes);
app.use("/api/inventory-transactions", inventoryTransactionsRoutes);
app.use("/api/shopping-list", shoppingListRoutes);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✓ Server listening on port ${PORT}`);
});
