import ApiClient from "./ApiClient";

class ProjectService extends ApiClient {
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
