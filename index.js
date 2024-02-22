const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/items", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.status(400).send({ error: "Missing query parameter" });

  const url = `https://api.mercadolibre.com/sites/MLA/search?q=${q}&limit=4`;

  const response = await axios.get(url);
  // handle data
  res.send(response.data);
});

app.get("/api/items/:id", async (req, res) => {
  const p = req.params.id;

  if (!p) return res.status(400).send({ error: "Missing query parameter" });

  const url = `https://api.mercadolibre.com/items/${p}`;

  const response = await axios.get(url);
  
  res.send(response.data);
});

app.get("/api/items/:id/description", async (req, res) => {
  const p = req.params.id;

  if (!p) return res.status(400).send({ error: "Missing parameter" });

  const url = `https://api.mercadolibre.com/items/${p}/description`;

  const response = await axios.get(url);

  // handle data
  res.send(response.data);
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});

