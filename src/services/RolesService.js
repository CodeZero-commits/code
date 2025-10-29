const API_BASE = "https://codezerohub.net/api";

class RolesService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

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
      throw error;
    }
  }

  // 🔹 CRUD Roles
  static async getRoles() {
    return this.request("/roles.php", { method: "GET" });
  }

  static async createRole(roleData) {
    return this.request("/roles.php", {
      method: "POST",
      body: JSON.stringify(roleData),
    });
  }

  static async updateRole(id, roleData) {
    return this.request(`/roles.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    });
  }

  static async deleteRole(id) {
    return this.request(`/roles.php?id=${id}`, { method: "DELETE" });
  }
}

export default RolesService;
