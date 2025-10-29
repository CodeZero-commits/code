const API_BASE = "https://codezerohub.net/api";

class PlanesService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data.error || response.statusText);
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  static async getPlanes() {
    return this.request("/planes.php", { method: "GET" });
  }
  static async createPlan(plan) {
    return this.request("/planes.php", {
      method: "POST",
      body: JSON.stringify(plan),
    });
  }
  static async updatePlan(id, plan) {
    return this.request(`/planes.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(plan),
    });
  }
  static async deletePlan(id) {
    return this.request(`/planes.php?id=${id}`, { method: "DELETE" });
  }
}

export default PlanesService;
