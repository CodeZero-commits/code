import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import PlanesService from "../services/PlanesService";
import PlanesModal from "../components/admin/planes/PlanesModal";

const Planes = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  useEffect(() => {
    if (showModal === "plans") handleAdd();
  }, [showModal]);

  const fetchPlanes = async () => {
    try {
      setLoading(true);
      const data = await PlanesService.getPlanes();
      setPlanes(data.planes || []);
    } catch (error) {
      console.error("Error fetching planes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar plan?")) return;
    try {
      await PlanesService.deletePlan(id);
      fetchPlanes();
    } catch (error) {
      console.error("Error eliminando plan:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchPlanes();
  };

  const filteredPlanes = planes.filter((p) =>
    (p.nombre || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando planes...</p>
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
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Límite Usuarios</th>
              <th className="p-3">Límite Proyectos</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlanes.length > 0 ? (
              filteredPlanes.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">${p.precio}</td>
                  <td className="p-3">{p.limite_usuarios}</td>
                  <td className="p-3">{p.limite_proyectos}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
                  colSpan="6"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No hay planes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PlanesModal plan={selectedPlan} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Planes;
