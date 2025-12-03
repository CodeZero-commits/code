import ApiClient from "./ApiClient";

class RolesService extends ApiClient {
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
