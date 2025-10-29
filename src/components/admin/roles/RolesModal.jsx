import React, { useState, useEffect } from "react";
import RolesService from "../../../services/RolesService";

const RolesModal = ({ role, onClose }) => {
  const [form, setForm] = useState({
    empresa_id: "",
    nombre: "",
  });

  useEffect(() => {
    if (role) {
      setForm({
        empresa_id: role.empresa_id || "",
        nombre: role.nombre || "",
      });
    }
  }, [role]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        permisos_json: [1, 2], // siempre fijo
      };

      if (role) {
        await RolesService.updateRole(role.id, payload);
      } else {
        await RolesService.createRole(payload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando rol:", error);
      alert("Error al guardar el rol. Revisa la consola.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {role ? "Editar Rol" : "Agregar Rol"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Empresa ID</label>
            <input
              type="number"
              name="empresa_id"
              value={form.empresa_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
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

export default RolesModal;
