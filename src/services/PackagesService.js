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

class PackagesService {
  static async getPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE}/packages.php${query ? `?${query}` : ""}`
    );
    return parseResponse(response);
  }

  static async createPackage(pkg) {
    const response = await fetch(`${API_BASE}/packages.php`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(pkg),
    });
    return parseResponse(response);
  }

  static async updatePackage(id, pkg) {
    const response = await fetch(`${API_BASE}/packages.php?id=${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(pkg),
    });
    return parseResponse(response);
  }

  static async deletePackage(id) {
    const response = await fetch(`${API_BASE}/packages.php?id=${id}`, {
      method: "DELETE",
    });
    return parseResponse(response);
  }
}

export default PackagesService;
