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

const componentRoutes = require("./routes/components");

app.use("/api/components", componentRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✓ Server listening on port ${PORT}`);
});