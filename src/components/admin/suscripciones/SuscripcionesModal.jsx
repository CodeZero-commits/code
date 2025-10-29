import React, { useState, useEffect } from "react";
import SuscripcionesService from "../../../services/SuscripcionesService";
import ClientService from "../../../services/ClientsService"; // ✅ correcto
import PlanesService from "../../../services/PlanesService";

const SuscripcionesModal = ({ suscripcion, onClose }) => {
  const [form, setForm] = useState({
    empresa_id: "",
    plan_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "activo",
  });

  const [empresas, setEmpresas] = useState([]);
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Traer clientes (empresas)
        const empresasData = await ClientService.getClientes();
        setEmpresas(empresasData.clientes || []); // ❗ clave 'clientes' coincide con PHP

        const planesData = await PlanesService.getPlanes();
        setPlanes(planesData.planes || []);
      } catch (error) {
        console.error("Error cargando empresas o planes:", error);
      }
    };
    fetchData();

    if (suscripcion) {
      setForm({
        empresa_id: suscripcion.empresa_id || "",
        plan_id: suscripcion.plan_id || "",
        fecha_inicio: suscripcion.fecha_inicio || "",
        fecha_fin: suscripcion.fecha_fin || "",
        estado: suscripcion.estado || "activo",
      });
    }
  }, [suscripcion]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (suscripcion) {
        await SuscripcionesService.updateSuscripcion(suscripcion.id, form);
      } else {
        await SuscripcionesService.createSuscripcion(form);
      }
      onClose();
    } catch (error) {
      console.error("Error guardando suscripción:", error);
      alert("Error al guardar la suscripción. Revisa la consola.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {suscripcion ? "Editar Suscripción" : "Agregar Suscripción"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Empresa */}
          <div>
            <label className="block text-gray-700">Empresa</label>
            <select
              name="empresa_id"
              value={form.empresa_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">-- Selecciona una empresa --</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre_empresa || e.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Select Plan */}
          <div>
            <label className="block text-gray-700">Plan</label>
            <select
              name="plan_id"
              value={form.plan_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">-- Selecciona un plan --</option>
              {planes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div>
            <label className="block text-gray-700">Fecha Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Fecha Fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-gray-700">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="activo">Activo</option>
              <option value="vencido">Vencido</option>
              <option value="cancelado">Cancelado</option>
            </select>
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

export default SuscripcionesModal;
