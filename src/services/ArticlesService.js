const API_BASE = "https://codezerohub.net/api";

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.error || response.statusText);
  }
  return data;
};

const jsonHeaders = { "Content-Type": "application/json" };

class ArticlesService {
  static async getArticles(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE}/articles.php${query ? `?${query}` : ""}`
    );
    return parseResponse(response);
  }

  static async createArticle(article) {
    const response = await fetch(`${API_BASE}/articles.php`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(article),
    });
    return parseResponse(response);
  }

  static async updateArticle(id, article) {
    const response = await fetch(`${API_BASE}/articles.php?id=${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(article),
    });
    return parseResponse(response);
  }

  static async deleteArticle(id) {
    const response = await fetch(`${API_BASE}/articles.php?id=${id}`, {
      method: "DELETE",
    });
    return parseResponse(response);
  }
}

export default ArticlesService;
