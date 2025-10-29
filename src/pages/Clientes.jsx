import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApiService from "../services/ClientsService";
import ClientesModal from "../components/admin/client/ClientesModal";

const Clientes = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (showModal === "clients") handleAdd();
  }, [showModal]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getClientes();
      setClientes(data.clientes || []);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCliente(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    try {
      await ApiService.deleteCliente(id);
      fetchClientes();
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchClientes();
  };

  const filteredClientes = clientes.filter((c) =>
    (c.nombre_completo || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando clientes...</p>
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
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.nombre_completo}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.telefono}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleCrearUsuario(c)}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Crear Usuario
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
                  colSpan="5"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ClientesModal cliente={selectedCliente} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Clientes;
