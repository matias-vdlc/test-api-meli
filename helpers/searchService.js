const axios = require("axios");

async function fetchSearchData(query) {
  const url = `https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=4`;
  return axios.get(url);
}

function findMostCommonCategory(items) {
  const categoryCounts = items.reduce((counts, item) => {
    counts[item.category_id] = (counts[item.category_id] || 0) + 1;
    return counts;
  }, {});
  return Object.keys(categoryCounts).reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b
  );
}

function getCategoryPath(filters, mostCommonCategoryId) {
  const categoryFilter = filters.find((filter) => filter.id === "category");
  const mostCommonCategoryPath = categoryFilter?.values.find(
    (value) => value.id === mostCommonCategoryId
  )?.path_from_root;
  const defaultCategoryPath = categoryFilter?.values[0]?.path_from_root;
  return mostCommonCategoryPath || defaultCategoryPath || [];
}

module.exports = { fetchSearchData, findMostCommonCategory, getCategoryPath };
