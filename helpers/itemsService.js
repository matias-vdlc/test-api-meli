const axios = require("axios");

const fetchItemDetails = async (itemId) => {
  const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
  const itemDescriptionUrl = `https://api.mercadolibre.com/items/${itemId}/description`;

  try {
    const [itemResponse, itemDescriptionResponse] = await Promise.all([
      axios.get(itemUrl),
      axios.get(itemDescriptionUrl),
    ]);

    return {
      itemData: itemResponse.data,
      descriptionData: itemDescriptionResponse.data,
    };
  } catch (error) {
    console.error("An error occurred while fetching item details:", error);
    throw error;
  }
};

module.exports = { fetchItemDetails };
