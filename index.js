const express = require("express");
const cors = require("cors");
const { searchItems } = require("./handlers/searchItems");
const { getItemDetails } = require("./handlers/getItemDetails");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Mercado Libre API middleware para test frontend.");
});

app.get("/api/items", searchItems);

app.get("/api/items/:id", getItemDetails);

app.listen(4000, () => {
  console.log("Meli API middleware listening on port 4000");
});
