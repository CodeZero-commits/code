// components/admin/ProjectsSection.jsx
import { useState, useEffect } from "react";
import ApiService from "./../services/ApiService"; // Ajusta la ruta
import { Plus, Edit, Trash2, X } from "lucide-react";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    db_connection: "",
    plans: [],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getProjectsSaas();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlansChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      plans: value.split(",").map((p) => p.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await ApiService.updateProject(editingProject.id, formData);
      } else {
        await ApiService.createProject(formData);
      }
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar proyecto: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      db_connection: project.db_connection,
      plans: project.plans.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro quieres eliminar este proyecto?")) return;
    try {
      await ApiService.deleteProject(id);
      fetchProjects();
    } catch (err) {
      alert("Error al eliminar proyecto");
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ name: "", db_connection: "", plans: [] });
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Proyectos SaaS</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Conexión DB</th>
            <th className="p-2 border">Planes</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="p-2 border">{project.id}</td>
              <td className="p-2 border">{project.name}</td>
              <td className="p-2 border">{project.db_connection}</td>
              <td className="p-2 border">{project.plans.join(", ")}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-green-500"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Conexión DB</label>
                <input
                  type="text"
                  name="db_connection"
                  value={formData.db_connection}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Planes (separados por coma)
                </label>
                <input
                  type="text"
                  name="plans"
                  value={formData.plans}
                  onChange={handlePlansChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="15 días, 1 mes, 3 meses"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsSection;
