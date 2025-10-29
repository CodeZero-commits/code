// src/pages/Suscripciones.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import SuscripcionesService from "../services/SuscripcionesService";
import SuscripcionesModal from "../components/admin/suscripciones/SuscripcionesModal";

const Suscripciones = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSuscripcion, setSelectedSuscripcion] = useState(null);

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  useEffect(() => {
    if (showModal === "subscriptions") handleAdd();
  }, [showModal]);

  const fetchSuscripciones = async () => {
    try {
      setLoading(true);
      const data = await SuscripcionesService.getSuscripciones();
      setSuscripciones(data.suscripciones || []);
    } catch (error) {
      console.error("Error fetching suscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSuscripcion(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (suscripcion) => {
    setSelectedSuscripcion(suscripcion);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar suscripción?")) return;
    try {
      await SuscripcionesService.deleteSuscripcion(id);
      fetchSuscripciones();
    } catch (error) {
      console.error("Error eliminando suscripción:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchSuscripciones();
  };

  const filteredSuscripciones = suscripciones.filter((s) =>
    (s.empresa_nombre || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando suscripciones...</p>
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
              <th className="p-3">Plan</th>
              <th className="p-3">Fecha Inicio</th>
              <th className="p-3">Fecha Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuscripciones.length > 0 ? (
              filteredSuscripciones.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">{s.empresa_nombre}</td>
                  <td className="p-3">{s.plan_nombre}</td>
                  <td className="p-3">{s.fecha_inicio}</td>
                  <td className="p-3">{s.fecha_fin}</td>
                  <td className="p-3 capitalize">{s.estado}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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
                  No hay suscripciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <SuscripcionesModal
          suscripcion={selectedSuscripcion}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Suscripciones;
