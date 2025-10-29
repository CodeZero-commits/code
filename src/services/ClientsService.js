const API_BASE = "https://codezerohub.net/api";

class ClientService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log("🔄 API Request:", {
      url,
      method: options.method || "GET",
      headers: options.headers,
      body: options.body,
    });

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            data.error || response.statusText
          }`
        );
      }

      return data;
    } catch (error) {
      console.error("💥 API Error:", error);
      throw error;cd
    }
  }

  // 🔹 CRUD Clientes
  static async getClientes() {
    return this.request("/clientes.php", { method: "GET" });
  }

  static async createCliente(clienteData) {
    return this.request("/clientes.php", {
      method: "POST",
      body: JSON.stringify(clienteData),
    });
  }

  static async updateCliente(id, clienteData) {
    return this.request(`/clientes.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(clienteData),
    });
  }

  static async deleteCliente(id) {
    return this.request(`/clientes.php?id=${id}`, { method: "DELETE" });
  }
}

export default ClientService;
