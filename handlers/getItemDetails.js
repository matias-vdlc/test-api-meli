const { fetchItemDetails } = require("../helpers/itemsService");

async function getItemDetails(req, res) {
  const itemId = req.params.id;
  const validIdRegex = /^MLA\d+$/;

  if (!validIdRegex.test(itemId)) {
    return res.status(400).send({ error: "Invalid item ID format." });
  }

  try {
    const { itemData, descriptionData } = await fetchItemDetails(itemId);

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
}

module.exports = { getItemDetails };
