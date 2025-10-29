const API_BASE = "https://codezerohub.net/api";

class ApiService {
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

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      const responseText = await response.text();
      console.log("📄 Response Text:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        console.log("📄 Raw response text:", responseText);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        console.error("❌ HTTP Error:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            data.error || response.statusText
          }`
        );
      }

      console.log("✅ API Success:", data);
      return data;
    } catch (error) {
      console.error("💥 API Error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }

  // CRUD Staff
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

  // ========================================
  // CRUD CLIENTES (usando clientes.php)
  // ========================================

  static async getClientes() {
    return this.request("/clientes.php", { method: "GET" });
  }

  static async createCliente(clienteData) {
    console.log("📝 Creating cliente with data:", clienteData);
    return this.request("/clientes.php", {
      method: "POST",
      body: JSON.stringify(clienteData),
    });
  }

  static async updateCliente(id, clienteData) {
    console.log("📝 Updating cliente with data:", clienteData);
    return this.request(`/clientes.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(clienteData),
    });
  }

  static async deleteCliente(id) {
    return this.request(`/clientes.php?id=${id}`, { method: "DELETE" });
  }

  // ========================================
  // CRUD Empresas (usando empresas.php - para compatibilidad con otros componentes)
  // ========================================

  static async getEmpresas() {
    return this.request("/empresas.php", { method: "GET" });
  }

  // Método específico para crear cliente con mapeo de campos
  static async createClient(clientData) {
    console.log("📝 Creating client with data:", clientData);

    // Mapear datos del frontend al formato que espera el backend
    const mappedData = {
      usuario: clientData.name || "", // nombre del responsable como usuario
      nombre: clientData.company_name || "", // nombre de la empresa
      proyecto: this.mapProjectType(clientData.project_type),
      giro: this.mapProjectToGiro(
        clientData.project_type,
        clientData.specialties
      ),
      email: clientData.email || "",
      telefono: clientData.phone || "",
      fecha_inicio:
        clientData.start_date || new Date().toISOString().split("T")[0],
      fecha_fin: this.calculateEndDate(
        clientData.start_date,
        clientData.modality
      ),
      estado: this.mapModalityToState(clientData.modality),
      // Campos adicionales que podrían estar en la BD
      responsable: clientData.name || "",
      notas: clientData.notes || "",
    };

    console.log("🔄 Mapped data for backend:", mappedData);

    const result = await this.request("/empresas.php", {
      method: "POST",
      body: JSON.stringify(mappedData),
    });

    return {
      ...result,
      client_id: result.id, // Para compatibilidad con ProjectsService
    };
  }

  // Método específico para actualizar cliente
  static async updateClient(id, clientData) {
    console.log("📝 Updating client with data:", clientData);

    const mappedData = {
      usuario: clientData.name || "",
      nombre: clientData.company_name || "",
      proyecto: this.mapProjectType(clientData.project_type),
      giro: this.mapProjectToGiro(
        clientData.project_type,
        clientData.specialties
      ),
      email: clientData.email || "",
      telefono: clientData.phone || "",
      fecha_inicio:
        clientData.start_date || new Date().toISOString().split("T")[0],
      fecha_fin: this.calculateEndDate(
        clientData.start_date,
        clientData.modality
      ),
      estado: this.mapModalityToState(clientData.modality),
      responsable: clientData.name || "",
      notas: clientData.notes || "",
    };

    return this.request(`/empresas.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(mappedData),
    });
  }

  // Método para eliminar cliente
  static async deleteClient(id) {
    return this.request(`/empresas.php?id=${id}`, { method: "DELETE" });
  }

  // Métodos auxiliares para mapeo de datos
  static mapProjectType(projectType) {
    const projectMap = {
      clinic: "Sistema de Clínica",
      pos: "Punto de Venta (SICAR)",
      restaurant: "SoftRestaurant",
    };
    return projectMap[projectType] || projectType;
  }

  static mapProjectToGiro(projectType, specialties = []) {
    const giroMap = {
      clinic: "Servicios de Salud",
      pos: "Comercio/Retail",
      restaurant: "Restaurante/Alimentos",
    };

    let giro = giroMap[projectType] || "General";

    // Si es clínica y tiene especialidades, agregar detalle
    if (projectType === "clinic" && specialties.length > 0) {
      const specialtyNames = this.getSpecialtyNames(specialties);
      if (specialtyNames.length > 0) {
        giro += ` - ${specialtyNames.join(", ")}`;
      }
    }

    return giro;
  }

  static getSpecialtyNames(specialtyIds) {
    const specialtyMap = {
      1: "Odontología",
      2: "Medicina General",
      3: "Veterinaria",
      4: "Dermatología",
      5: "Cardiología",
      6: "Pediatría",
      7: "Ginecología",
      8: "Traumatología",
    };

    return specialtyIds.map((id) => specialtyMap[id]).filter(Boolean);
  }

  static mapModalityToState(modality) {
    console.log("🔄 Mapping modality to state:", modality);
    const stateMap = {
      trial: "prueba",
      monthly: "activo",
      annual: "activo",
    };
    const result = stateMap[modality] || "activo"; // Por defecto activo, no inactivo
    console.log("📤 Mapped state:", result);
    return result;
  }

  static calculateEndDate(startDate, modality) {
    if (!startDate) {
      startDate = new Date().toISOString().split("T")[0];
    }

    const start = new Date(startDate);
    let endDate = new Date(start);

    switch (modality) {
      case "trial":
        endDate.setDate(start.getDate() + 30);
        break;
      case "monthly":
        endDate.setMonth(start.getMonth() + 1);
        break;
      case "annual":
        endDate.setFullYear(start.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(start.getMonth() + 1); // default mensual
    }

    return endDate.toISOString().split("T")[0];
  }

  // Métodos legacy para compatibilidad (deprecated)
  static async createEmpresa(empresaData) {
    console.warn("⚠️ createEmpresa is deprecated, use createClient instead");
    return this.request("/empresas.php", {
      method: "POST",
      body: JSON.stringify(empresaData),
    });
  }

  static async updateEmpresa(id, empresaData) {
    console.warn("⚠️ updateEmpresa is deprecated, use updateClient instead");
    return this.request(`/empresas.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(empresaData),
    });
  }

  static async deleteEmpresa(id) {
    console.warn("⚠️ deleteEmpresa is deprecated, use deleteClient instead");
    return this.request(`/empresas.php?id=${id}`, { method: "DELETE" });
  }
}

export default ApiService;
