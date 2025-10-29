// src/services/SuscripcionesService.js
const API_BASE = "https://codezerohub.net/api";

class SuscripcionesService {
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

  static async getSuscripciones() {
    return this.request("/suscripciones.php", { method: "GET" });
  }

  static async createSuscripcion(suscripcion) {
    return this.request("/suscripciones.php", {
      method: "POST",
      body: JSON.stringify(suscripcion),
    });
  }

  static async updateSuscripcion(id, suscripcion) {
    return this.request(`/suscripciones.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(suscripcion),
    });
  }

  static async deleteSuscripcion(id) {
    return this.request(`/suscripciones.php?id=${id}`, { method: "DELETE" });
  }
}

export default SuscripcionesService;
