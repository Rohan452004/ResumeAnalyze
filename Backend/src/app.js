const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const aiRoutes = require("./routes/ai.routes");

dotenv.config(); 

const app = express();

const frontendurl = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontendurl, 
    credentials: true, 
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/ai", aiRoutes);

module.exports = app;
