import React, { useState, useEffect } from "react";
import ProjectsService from "../../../services/ProjectsService";

const ProjectsModal = ({ proyecto, onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    caracteristicas: "",
  });

  useEffect(() => {
    if (proyecto) {
      setForm({
        nombre: proyecto.nombre || "",
        descripcion: proyecto.descripcion || "",
        categoria: proyecto.categoria || "",
        caracteristicas: proyecto.caracteristicas || "",
      });
    }
  }, [proyecto]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (proyecto) {
        await ProjectsService.updateProject(proyecto.id, form);
      } else {
        await ProjectsService.createProject(form);
      }
      onClose();
    } catch (error) {
      console.error("Error guardando proyecto:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {proyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Web, Mobile, Desktop, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Características
            </label>
            <textarea
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={2}
              placeholder="Funcionalidades principales del proyecto..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsModal;
