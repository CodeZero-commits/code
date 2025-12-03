const API_BASE = "https://codezerohub.net/api";

class ProjectService {
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
      throw error;
    }
  }

  // 🔹 CRUD Proyectos
  static async getProjects() {
    return this.request("/projects.php", { method: "GET" });
  }

  static async createProject(projectData) {
    return this.request("/projects.php", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  static async updateProject(id, projectData) {
    return this.request(`/projects.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  }

  static async deleteProject(id) {
    return this.request(`/projects.php?id=${id}`, { method: "DELETE" });
  }
}

export default ProjectService;
