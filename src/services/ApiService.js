import ApiClient from "./ApiClient";

class ApiService extends ApiClient {
  // 🔹 CRUD Staff
  static async getStaff() {
    return this.request("/staff.php", { method: "GET" });
  }

  static async createStaff(staffData) {
    return this.request("/staff.php", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  }

  static async updateStaff(id, staffData) {
    return this.request(`/staff.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(staffData),
    });
  }

  static async deleteStaff(id) {
    return this.request(`/staff.php?id=${id}`, { method: "DELETE" });
  }

  // 🔹 Login
  static async login(credentials) {
    return this.request("/login.php", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }
}

export default ApiService;
