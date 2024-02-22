const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Mercado Libre API para test frontend.");
});

app.get("/api/items", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).send({ error: "Missing query parameter" });
  }

  try {
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${q}&limit=4`;
    const response = await axios.get(url);

    let categoryCounts = {};
    response.data.results.forEach(item => {
      const categoryId = item.category_id;
      if (categoryId in categoryCounts) {
        categoryCounts[categoryId]++;
      } else {
        categoryCounts[categoryId] = 1;
      }
    });

    let mostCommonCategoryId = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

    let categoryPath = response.data.filters.find(filter => filter.id === "category")?.values.find(value => value.id === mostCommonCategoryId)?.path_from_root.map(category => category.name) || [];

    const transformedData = {
      author: {
        name: "Matias",
        lastname: "Vazquez de la Colina",
      },
      categories: categoryPath,
      items: response.data.results.map(item => ({
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: Math.floor(item.price),
          decimals: +((item.price % 1).toFixed(2).substring(2)),
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
      }))
    };

    res.json(transformedData);
  } catch (error) {
    console.error("An error occurred while retrieving search results:", error);
    res.status(500).send('Error retrieving data from Mercado Libre');
  }
});

app.get("/api/items/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
    const itemDescriptionUrl = `https://api.mercadolibre.com/items/${itemId}/description`;

    const [itemResponse, itemDescriptionResponse] = await Promise.all([
      axios.get(itemUrl),
      axios.get(itemDescriptionUrl)
    ]);

    const itemData = itemResponse.data;
    const descriptionData = itemDescriptionResponse.data;

    const formattedResponse = {
      author: {
        name: "Matias",
        lastname: "Vazquez de la Colina",
      },
      item: {
        id: itemData.id,
        title: itemData.title,
        price: {
          currency: itemData.currency_id,
          amount: Math.floor(itemData.price),
          decimals: +((itemData.price % 1).toFixed(2).substring(2)),
        },
        picture: itemData.thumbnail,
        condition: itemData.condition,
        free_shipping: itemData.shipping?.free_shipping ?? null,
        sold_quantity: itemData.sold_quantity ?? null,
        description: descriptionData.plain_text ?? null
      }
    };

    res.send(formattedResponse);
  } catch (error) {
    console.error("An error occurred while fetching item details:", error);
    res.status(500).send({ error: "An error occurred while fetching item details" });
  }
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});

