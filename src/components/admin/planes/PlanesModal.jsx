import React, { useState, useEffect } from "react";
import PlanesService from "../../../services/PlanesService";
import ProyectosService from "../../../services/ProjectsService"; // 👈 servicio proyectos

const PlanesModal = ({ plan, onClose }) => {
  const [form, setForm] = useState({
    proyecto_id: "",
    nombre: "",
    precio: 0,
    limite_usuarios: 1,
    limite_proyectos: 1,
    caracteristicas: "",
  });

  const [proyectos, setProyectos] = useState([]);

  // Cargar proyectos
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await ProyectosService.getProjects();
        setProyectos(data.proyectos || []);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    };
    fetchProyectos();
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (plan) {
      setForm({
        proyecto_id: plan.proyecto_id || "",
        nombre: plan.nombre || "",
        precio: plan.precio || 0,
        limite_usuarios: plan.limite_usuarios || 1,
        limite_proyectos: plan.limite_proyectos || 1,
        caracteristicas: plan.caracteristicas || "",
      });
    }
  }, [plan]);

  // Sincronizar el select cuando ya se cargaron los proyectos
  useEffect(() => {
    if (plan && proyectos.length > 0) {
      setForm((prev) => ({
        ...prev,
        proyecto_id: plan.proyecto_id || "",
      }));
    }
  }, [proyectos, plan]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (plan) {
        await PlanesService.updatePlan(plan.id, form);
      } else {
        await PlanesService.createPlan(form);
      }
      onClose();
    } catch (error) {
      console.error("Error guardando plan:", error);
      alert("Error al guardar el plan. Revisa la consola.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {plan ? "Editar Plan" : "Agregar Plan"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Proyecto */}
          <div>
            <label className="block text-gray-700">Proyecto</label>
            <select
              name="proyecto_id"
              value={form.proyecto_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">-- Selecciona un proyecto --</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Límite de Usuarios</label>
            <input
              type="number"
              name="limite_usuarios"
              value={form.limite_usuarios}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Límite de Proyectos</label>
            <input
              type="number"
              name="limite_proyectos"
              value={form.limite_proyectos}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Características</label>
            <textarea
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2 mt-1"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanesModal;
