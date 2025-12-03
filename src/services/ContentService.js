const API_BASE = "https://codezerohub.net/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const errorMessage = data.error || response.statusText;
    throw new Error(errorMessage);
  }
  return data;
};

const buildOptions = (method, body, extra = {}) => ({
  method,
  headers: { ...defaultHeaders, ...extra.headers },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

class ContentService {
  static async getSection(section) {
    const response = await fetch(`${API_BASE}/content.php${
      section ? `?section=${encodeURIComponent(section)}` : ""
    }`, buildOptions("GET"));
    return handleResponse(response);
  }

  static async createSection(payload) {
    const response = await fetch(
      `${API_BASE}/content.php`,
      buildOptions("POST", payload)
    );
    return handleResponse(response);
  }

  static async updateSection(section, payload) {
    const response = await fetch(
      `${API_BASE}/content.php${
        section ? `?section=${encodeURIComponent(section)}` : ""
      }`,
      buildOptions("PUT", payload)
    );
    return handleResponse(response);
  }

  static async deleteSection(id) {
    const response = await fetch(
      `${API_BASE}/content.php?id=${encodeURIComponent(id)}`,
      buildOptions("DELETE")
    );
    return handleResponse(response);
  }
}

export default ContentService;
