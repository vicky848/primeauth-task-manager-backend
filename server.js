require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

require("./database/db");

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/tasks", require("./routes/taskRoutes"));

app.listen(PORT, () =>  console.log(`Server running on ${PORT}`));