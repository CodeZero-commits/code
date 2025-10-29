const API_BASE = "https://codezerohub.net/api";

class UsuariosService {
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

  // 🔹 CRUD Usuarios
  static async getUsuarios() {
    return this.request("/usuarios.php", { method: "GET" });
  }

  static async createUsuario(usuarioData) {
    return this.request("/usuarios.php", {
      method: "POST",
      body: JSON.stringify(usuarioData),
    });
  }

  static async updateUsuario(id, usuarioData) {
    return this.request(`/usuarios.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(usuarioData),
    });
  }

  static async deleteUsuario(id) {
    return this.request(`/usuarios.php?id=${id}`, { method: "DELETE" });
  }

  // 🔹 NUEVO: Obtener empresas usando ClientService pattern
  static async getEmpresas() {
    return this.request("/clientes.php", { method: "GET" });
  }

  // 🔹 NUEVO: Obtener roles filtrados por empresa
  static async getRolesByEmpresa(empresaId) {
    if (!empresaId) {
      throw new Error("Empresa ID es requerida para obtener roles");
    }
    return this.request(`/roles.php?empresa_id=${empresaId}`, {
      method: "GET",
    });
  }

  // 🔹 Método genérico para obtener todos los roles (sin filtrar)
  static async getRoles() {
    return this.request("/roles.php", { method: "GET" });
  }

  // 🔹 Alias para mantener compatibilidad
  static async createUser(userData) {
    return this.createUsuario(userData);
  }

  static async updateUser(id, userData) {
    return this.updateUsuario(id, userData);
  }
}

export default UsuariosService;
