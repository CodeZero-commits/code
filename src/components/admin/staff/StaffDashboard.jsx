import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, Edit, Trash2, AlertCircle, X } from "lucide-react";
import ApiService from "./../../../services/ApiService";

const StaffDashboard = () => {
  const { showModal, setShowModal, searchTerm } = useOutletContext();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [error, setError] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    telefono: "",
    password: "",
    confirm_password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (showModal === "staff") handleAdd();
  }, [showModal]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getStaff();
      setStaff(data.staff || data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError("Error al cargar el staff");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setFormData({
      usuario: "",
      email: "",
      telefono: "",
      password: "",
      confirm_password: "",
    });
    setFormErrors({});
    setModalOpen(true);
    setShowModal(null);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      usuario: staffMember.usuario || "",
      email: staffMember.email || "",
      telefono: staffMember.telefono || "",
      password: "",
      confirm_password: "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar miembro del staff?")) return;
    try {
      await ApiService.deleteStaff(id);
      fetchStaff();
    } catch (error) {
      console.error("Error eliminando staff:", error);
      setError("Error al eliminar el staff");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const errors = {};
    if (!formData.usuario.trim()) errors.usuario = "El usuario es requerido";
    if (!formData.email.trim()) errors.email = "El email es requerido";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es requerido";

    if (!selectedStaff) {
      if (!formData.password) errors.password = "La contraseña es requerida";
      if (formData.password !== formData.confirm_password) {
        errors.confirm_password = "Las contraseñas no coinciden";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (selectedStaff) {
        // Editar staff existente
        await ApiService.updateStaff(selectedStaff.id, formData);
      } else {
        // Crear nuevo staff
        await ApiService.createStaff(formData);
      }
      handleModalClose();
    } catch (error) {
      console.error("Error al guardar staff:", error);
      setFormErrors({ general: "Error al guardar. Intenta de nuevo." });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStaff(null);
    setFormData({
      usuario: "",
      email: "",
      telefono: "",
      password: "",
      confirm_password: "",
    });
    setFormErrors({});
    fetchStaff();
  };

  const filteredStaff = staff.filter((s) =>
    (s.usuario || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Cargando staff...</p>
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

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.usuario}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Staff Member
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm text-gray-900">
                        {member.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Teléfono:</span>
                      <span className="text-sm text-gray-900">
                        {member.telefono}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Creado:</span>
                      <span className="text-sm text-gray-900">
                        {member.fecha_creacion}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay staff registrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza agregando tu primer miembro del staff desde el botón
                  superior.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedStaff ? "Editar Staff" : "Agregar Staff"}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa el nombre de usuario"
                />
                {formErrors.usuario && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.usuario}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="555-0123"
                />
                {formErrors.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.telefono}
                  </p>
                )}
              </div>

              {!selectedStaff && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Repite la contraseña"
                    />
                    {formErrors.confirm_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.confirm_password}
                      </p>
                    )}
                  </div>
                </>
              )}

              {formErrors.general && (
                <p className="text-red-500 text-sm">{formErrors.general}</p>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {selectedStaff ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
