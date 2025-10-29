import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FolderOpen, Edit, Trash2, AlertCircle } from "lucide-react";
import ProjectService from "../services/ProjectsService";
import ProjectsModal from "../components/admin/projects/ProjectsModal";

const Proyectos = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProyectos();
  }, []);

  useEffect(() => {
    if (showModal === "projects") handleAdd();
  }, [showModal]);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectService.getProjects();
      setProyectos(data.proyectos || data || []);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
      setError("Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProyecto(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (proyecto) => {
    console.log("Editando proyecto:", proyecto); // Para debug
    setSelectedProyecto(proyecto);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar proyecto?")) return;
    try {
      await ProjectService.deleteProject(id);
      fetchProyectos();
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      setError("Error al eliminar el proyecto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!formData.descripcion.trim())
      errors.descripcion = "La descripción es requerida";
    if (!formData.fecha_inicio)
      errors.fecha_inicio = "La fecha de inicio es requerida";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (selectedProyecto) {
        // Editar proyecto existente
        // await ProjectService.updateProject(selectedProyecto.id, formData);
        console.log("Actualizando proyecto:", formData);
      } else {
        // Crear nuevo proyecto
        // await ProjectService.createProject(formData);
        console.log("Creando proyecto:", formData);
      }
      handleModalClose();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);

      let errorMessage = "Error al guardar. Intenta de nuevo.";
      if (error.message && error.message.includes("400")) {
        const match = error.message.match(/400 - (.+)$/);
        if (match) {
          errorMessage = match[1];
        }
      }

      setFormErrors({ general: errorMessage });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProyecto(null);
    fetchProyectos();
  };

  const filteredProyectos = proyectos.filter((p) =>
    (p.nombre || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProyectos.length > 0 ? (
              filteredProyectos.map((proyecto) => (
                <div
                  key={proyecto.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {proyecto.nombre}
                        </h3>
                        {proyecto.categoria && (
                          <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {proyecto.categoria}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(proyecto)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proyecto.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      {proyecto.descripcion}
                    </p>
                    {proyecto.caracteristicas && (
                      <div className="text-sm text-gray-500">
                        <strong>Características:</strong>{" "}
                        {proyecto.caracteristicas}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-3">
                      Creado:{" "}
                      {new Date(proyecto.creado_en).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay proyectos registrados
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza agregando tu primer proyecto desde el botón superior.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal usando tu componente existente */}
      {modalOpen && (
        <ProjectsModal proyecto={selectedProyecto} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Proyectos;
