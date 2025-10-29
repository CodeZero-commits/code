// src/pages/Roles.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApiService from "../services/RolesService";
import RolesModal from "../components/admin/roles/RolesModal";

const Roles = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (showModal === "roles") handleAdd();
  }, [showModal]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getRoles();
      setRoles(data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar rol?")) return;
    try {
      await ApiService.deleteRole(id);
      fetchRoles();
    } catch (error) {
      console.error("Error eliminando rol:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchRoles();
  };

  const filteredRoles = roles.filter((r) =>
    (r.nombre || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando roles...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700 uppercase text-sm">
              <th className="p-3">ID</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Permisos</th>
              <th className="p-3">Creado en</th>
              <th className="p-3">Actualizado en</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.empresa_id}</td>
                  <td className="p-3">{r.nombre}</td>
                  <td className="p-3 text-xs max-w-xs truncate">
                    {JSON.stringify(r.permisos_json)}
                  </td>
                  <td className="p-3">{r.creado_en}</td>
                  <td className="p-3">{r.actualizado_en}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(r)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No hay roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <RolesModal role={selectedRole} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Roles;
