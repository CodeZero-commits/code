import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import UsuariosService from "../services/UsuariosService";
import UsuariosModal from "../components/admin/users/UsuariosModal";

const Usuarios = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (showModal === "users") handleAdd();
  }, [showModal]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Iniciando fetch de usuarios...");
      const data = await UsuariosService.getUsuarios();
      console.log("✅ Datos recibidos:", data);

      // Manejar diferentes formatos de respuesta
      const usuariosArray = data.usuarios || data.data || data || [];
      setUsuarios(usuariosArray);
    } catch (error) {
      console.error("❌ Error fetching usuarios:", error);
      setError("Error al cargar usuarios: " + error.message);
      setUsuarios([]); // Reset a array vacío
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUsuario(null);
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (usuario) => {
    console.log("📝 Editando usuario:", usuario);
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      console.log("🗑️ Eliminando usuario:", id);
      await UsuariosService.deleteUsuario(id);
      alert("Usuario eliminado correctamente");
      fetchUsuarios(); // Refrescar lista
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
    fetchUsuarios(); // Refrescar la lista después de cerrar modal
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      (u.username || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase()) ||
      (u.email || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error al cargar usuarios
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchUsuarios}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header con botón agregar */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Usuarios ({filteredUsuarios.length})
        </h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700 uppercase text-sm">
              <th className="p-3">ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((u, idx) => (
                <tr
                  key={u.id_usuario || idx}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 font-mono text-sm">{u.id_usuario}</td>
                  <td className="p-3 font-semibold">{u.username}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">{u.telefono || "-"}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {u.rol || u.rol_nombre || "Sin rol"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.estado}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                      title="Editar usuario"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id_usuario)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Eliminar usuario"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  <div className="text-gray-400 text-lg mb-2">👥</div>
                  <div className="font-medium">No hay usuarios registrados</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Haz clic en "Agregar Usuario" para crear el primero
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <UsuariosModal usuario={selectedUsuario} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Usuarios;
