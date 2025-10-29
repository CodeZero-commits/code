import React, { useState, useEffect } from "react";
import ClientService from "../../../services/ClientsService";

const ClientesModal = ({ cliente, onClose }) => {
  const [form, setForm] = useState({
    email: "",
    telefono: "",
    nombre_completo: "",
    nombre_empresa: "",
    direccion: "",
    rfc: "",
    razon_social: "",
    codigo_postal: "",
    giro: "",
    notas: "",
    url_slug: "",
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    nombre: "",
    descripcion: "",
    categoria: "General",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basicos");

  const categorias = [
    "General",
    "Medicina General",
    "Odontología",
    "Nutrición",
    "Psicología",
    "Fisioterapia",
    "Cardiología",
    "Dermatología",
    "Ginecología",
    "Pediatría",
    "Oftalmología",
    "Neurología",
    "Traumatología",
    "Radiología",
    "Laboratorio",
    "Otro",
  ];

  // Función para generar URL slug
  const generateSlug = (text) => {
    if (!text) return "";

    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Cargar datos si es edición
  useEffect(() => {
    if (cliente) {
      setForm({
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        nombre_completo: cliente.nombre_completo || "",
        nombre_empresa: cliente.nombre_empresa || "",
        direccion: cliente.direccion || "",
        rfc: cliente.rfc || "",
        razon_social: cliente.razon_social || "",
        codigo_postal: cliente.codigo_postal || "",
        giro: cliente.giro || "",
        notas: cliente.notas || "",
        url_slug: cliente.url_slug || "",
      });

      // Cargar especialidades si existen
      if (cliente.especialidades_json) {
        try {
          const especialidadesData = JSON.parse(cliente.especialidades_json);
          setEspecialidades(especialidadesData || []);
        } catch (error) {
          console.error("Error parsing especialidades JSON:", error);
          setEspecialidades([]);
        }
      } else {
        setEspecialidades([]);
      }
    } else {
      setEspecialidades([]);
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };

    if (name === "nombre_empresa") {
      newForm.url_slug = generateSlug(value);
    }

    setForm(newForm);
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setForm({ ...form, url_slug: generateSlug(value) });
  };

  // Manejar especialidades
  const agregarEspecialidad = () => {
    if (!nuevaEspecialidad.nombre.trim()) {
      alert("El nombre de la especialidad es requerido");
      return;
    }

    const existe = especialidades.some(
      (esp) =>
        esp.nombre.toLowerCase() === nuevaEspecialidad.nombre.toLowerCase()
    );

    if (existe) {
      alert("Esta especialidad ya fue agregada");
      return;
    }

    const nuevaEsp = {
      ...nuevaEspecialidad,
      id: Date.now(),
      nombre: nuevaEspecialidad.nombre.trim(),
      descripcion: nuevaEspecialidad.descripcion.trim(),
    };

    setEspecialidades([...especialidades, nuevaEsp]);

    // Limpiar formulario
    setNuevaEspecialidad({
      nombre: "",
      descripcion: "",
      categoria: "General",
    });
  };

  const eliminarEspecialidad = (id) => {
    setEspecialidades(especialidades.filter((esp) => esp.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...form,
        especialidades_json: JSON.stringify(especialidades),
      };

      if (cliente) {
        await ClientService.updateCliente(cliente.id, dataToSend);
      } else {
        await ClientService.createCliente(dataToSend);
      }
      onClose();
    } catch (error) {
      console.error("Error guardando cliente:", error);
      alert(
        "Error guardando cliente: " + (error.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basicos", label: "Datos Básicos" },
    { id: "empresa", label: "Empresa" },
    { id: "especialidades", label: "Especialidades" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {cliente ? "Editar Cliente" : "Agregar Cliente"}
          </h2>
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* PESTAÑA DATOS BÁSICOS */}
          {activeTab === "basicos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={form.nombre_completo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="nombre_empresa"
                  value={form.nombre_empresa}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.url_slug && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border">
                    <span className="text-xs text-gray-500">URL generada:</span>
                    <div className="text-sm text-blue-600 font-mono">
                      https://tusitio.com/{form.url_slug}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  URL Slug (se genera automáticamente)
                </label>
                <input
                  type="text"
                  name="url_slug"
                  value={form.url_slug}
                  onChange={handleSlugChange}
                  placeholder="se-genera-automaticamente"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se genera automáticamente del nombre de la empresa
                </p>
              </div>
            </div>
          )}

          {/* PESTAÑA EMPRESA */}
          {activeTab === "empresa" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  RFC
                </label>
                <input
                  type="text"
                  name="rfc"
                  value={form.rfc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  name="razon_social"
                  value={form.razon_social}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={form.codigo_postal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Giro
                </label>
                <input
                  type="text"
                  name="giro"
                  value={form.giro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Servicios de Salud, Comercio..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Notas
                </label>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* PESTAÑA ESPECIALIDADES */}
          {activeTab === "especialidades" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Especialidades de la Empresa
                </h3>
                <p className="text-sm text-gray-600">
                  Agrega las especialidades médicas que manejará esta empresa.
                </p>
              </div>

              {/* Lista de especialidades agregadas */}
              {especialidades.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Especialidades agregadas ({especialidades.length}):
                  </h4>
                  <div className="space-y-2 mb-4">
                    {especialidades.map((esp) => (
                      <div
                        key={esp.id}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-blue-900">
                              {esp.nombre}
                            </span>
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                              {esp.categoria}
                            </span>
                          </div>
                          {esp.descripcion && (
                            <p className="text-sm text-blue-700 mt-1">
                              {esp.descripcion}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarEspecialidad(esp.id)}
                          className="ml-3 px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulario para agregar especialidad */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Agregar nueva especialidad:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={nuevaEspecialidad.nombre}
                      onChange={(e) =>
                        setNuevaEspecialidad({
                          ...nuevaEspecialidad,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Ej: Odontología, Nutrición..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Categoría
                    </label>
                    <select
                      value={nuevaEspecialidad.categoria}
                      onChange={(e) =>
                        setNuevaEspecialidad({
                          ...nuevaEspecialidad,
                          categoria: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={nuevaEspecialidad.descripcion}
                    onChange={(e) =>
                      setNuevaEspecialidad({
                        ...nuevaEspecialidad,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Breve descripción..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={agregarEspecialidad}
                    disabled={!nuevaEspecialidad.nombre.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {especialidades.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No hay especialidades agregadas aún.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="border-t p-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded-lg text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow transition-colors flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {cliente ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesModal;
