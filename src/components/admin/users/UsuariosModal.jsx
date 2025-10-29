// src/components/admin/users/UsuariosModal.jsx
import React, { useState, useEffect } from "react";
import UsuariosService from "../../../services/UsuariosService";

const UsuariosModal = ({ usuario, onClose }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefono: "",
    rol_id: "",
    estado: "activo",
    password_hash: "",
    empresa_id: "", // Ahora es requerido seleccionar
  });

  const [empresas, setEmpresas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmpresas();
    if (usuario) {
      setForm({
        username: usuario.username || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        rol_id: usuario.rol_id || "",
        estado: usuario.estado || "activo",
        password_hash: "",
        empresa_id: usuario.empresa_id || "",
      });

      // Si estamos editando y ya tiene empresa, cargar roles de esa empresa
      if (usuario.empresa_id) {
        fetchRolesByEmpresa(usuario.empresa_id);
      }
    }
  }, [usuario]);

  const fetchEmpresas = async () => {
    try {
      setLoadingEmpresas(true);
      const data = await UsuariosService.getEmpresas();
      console.log("Empresas obtenidas:", data);

      // Adaptar según la estructura de tu API de clientes/empresas
      const empresasArray =
        data.clientes || data.empresas || data.data || data || [];
      setEmpresas(empresasArray);
    } catch (error) {
      console.error("Error cargando empresas:", error);
      // Empresas por defecto si no se pueden cargar
      setEmpresas([
        { id: 1, nombre_empresa: "Empresa Demo 1", proyecto: "Proyecto A" },
        { id: 2, nombre_empresa: "Empresa Demo 2", proyecto: "Proyecto B" },
      ]);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const fetchRolesByEmpresa = async (empresaId) => {
    if (!empresaId) {
      setRoles([]);
      return;
    }

    try {
      setLoadingRoles(true);
      console.log(`Cargando roles para empresa ID: ${empresaId}`);

      const data = await UsuariosService.getRolesByEmpresa(empresaId);
      console.log("Roles obtenidos para empresa:", data);

      const rolesArray = data.roles || data.data || data || [];
      setRoles(rolesArray);

      // Si el rol actual ya no está disponible, resetear
      if (form.rol_id && !rolesArray.find((r) => r.id == form.rol_id)) {
        setForm((prev) => ({ ...prev, rol_id: "" }));
      }
    } catch (error) {
      console.error("Error cargando roles:", error);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Si cambió la empresa, recargar roles y resetear rol seleccionado
    if (name === "empresa_id") {
      setForm((prev) => ({ ...prev, rol_id: "" })); // Reset rol
      fetchRolesByEmpresa(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validaciones básicas
      if (!form.username.trim()) {
        alert("Username es requerido");
        return;
      }
      if (!form.email.trim()) {
        alert("Email es requerido");
        return;
      }
      if (!form.empresa_id) {
        alert("Selecciona una empresa");
        return;
      }
      if (!form.rol_id) {
        alert("Selecciona un rol");
        return;
      }
      if (!usuario && !form.password_hash.trim()) {
        alert("Contraseña es requerida para nuevos usuarios");
        return;
      }

      console.log("Enviando datos:", form);

      if (usuario) {
        // Actualizar usuario existente
        await UsuariosService.updateUsuario(usuario.id_usuario, form);
        alert("Usuario actualizado correctamente");
      } else {
        // Crear nuevo usuario
        await UsuariosService.createUsuario(form);
        alert("Usuario creado correctamente");
      }

      onClose(); // Esto debería refrescar la lista
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar usuario: " + (error.message || error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {usuario ? "Editar Usuario" : "Agregar Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PASO 1: Seleccionar Empresa */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-medium mb-2 text-blue-800">
              🏢 Paso 1: Seleccionar Empresa
            </label>
            {loadingEmpresas ? (
              <p className="text-gray-500 text-sm">Cargando empresas...</p>
            ) : (
              <select
                name="empresa_id"
                value={form.empresa_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre_empresa || empresa.nombre}
                    {empresa.proyecto && ` - ${empresa.proyecto}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* PASO 2: Seleccionar Rol (solo si hay empresa seleccionada) */}
          <div
            className={`${
              form.empresa_id
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } p-4 rounded-lg border-2`}
          >
            <label className="block text-sm font-medium mb-2 text-green-800">
              👤 Paso 2: Seleccionar Rol
            </label>
            {!form.empresa_id ? (
              <p className="text-gray-500 text-sm italic">
                Primero selecciona una empresa para ver los roles disponibles
              </p>
            ) : loadingRoles ? (
              <p className="text-gray-500 text-sm">Cargando roles...</p>
            ) : roles.length === 0 ? (
              <p className="text-orange-600 text-sm">
                No hay roles creados para esta empresa
              </p>
            ) : (
              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* PASO 3: Datos del Usuario */}
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <label className="block text-sm font-medium mb-2 text-purple-800">
              📝 Paso 3: Datos del Usuario
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ingresa el username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              {!usuario && (
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password_hash"
                    value={form.password_hash}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              )}

              {usuario && (
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Nueva Contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    name="password_hash"
                    value={form.password_hash}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Dejar vacío para no cambiar"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              disabled={submitting || !form.empresa_id || !form.rol_id}
            >
              {submitting ? "Guardando..." : usuario ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuariosModal;
