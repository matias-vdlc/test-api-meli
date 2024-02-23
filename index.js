const express = require("express");
const cors = require("cors");
const {
  fetchSearchData,
  findMostCommonCategory,
  getCategoryPath,
} = require("./helpers/searchService");
const { fetchItemDetails } = require("./helpers/itemsService");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Mercado Libre API middleware para test frontend.");
});

app.get("/api/items", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).send({ error: "Missing query parameter" });
  }

  if (q.length > 100) {
    return res.status(400).send({
      error: "Query parameter exceeds maximum length of 100 characters",
    });
  }

  try {
    const response = await fetchSearchData(q);
    const mostCommonCategoryId = findMostCommonCategory(response.data.results);
    const categoryPath = getCategoryPath(
      response.data.filters,
      mostCommonCategoryId
    ).map((category) => category.name);

    const transformedData = {
      author: {
        name: "Matias",
        lastname: "Vazquez de la Colina",
      },
      categories: categoryPath,
      items: response.data.results.map((item) => ({
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: Math.floor(item.price),
          decimals: +(item.price % 1).toFixed(2).substring(2),
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
      })),
    };

    res.json(transformedData);
  } catch (error) {
    console.error("An error occurred while retrieving search results:", error);
    res.status(500).send("Error retrieving data from Mercado Libre");
  }
});

app.get("/api/items/:id", async (req, res) => {
  const itemId = req.params.id;

  const validIdRegex = /^MLA\d+$/;

  // If the Id does not match the regex pattern, return error
  if (!validIdRegex.test(itemId)) {
    return res.status(400).send({ error: "Invalid item ID format." });
  }

  try {
    const { itemData, descriptionData } = await fetchItemDetails(itemId);

    // TODO: review meli api, sold_quantity prop not found
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
          decimals: +(itemData.price % 1).toFixed(2).substring(2),
        },
        picture: itemData.thumbnail,
        condition: itemData.condition,
        free_shipping: itemData.shipping?.free_shipping,
        sold_quantity: itemData.sold_quantity ?? null,
        description: descriptionData.plain_text,
      },
    };

    res.send(formattedResponse);
  } catch (error) {
    console.error("An error occurred while fetching item details:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching item details" });
  }
});

app.listen(4000, () => {
  console.log("Meli API middleware listening on port 4000");
});
