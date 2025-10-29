import { useEffect, useState } from "react";
import ApiService from "./../../../services/ApiService";

function SuscripcionesModal({ onClose, onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [planId, setPlanId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await ApiService.getClientes();
        const planesData = await ApiService.getPlanes();
        setClientes(clientesData.clientes || []);
        setPlanes(planesData.planes || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!empresaId || !planId) {
      alert("Debes seleccionar una empresa y un plan");
      return;
    }

    setLoading(true);
    try {
      await ApiService.asignarSuscripcion(empresaId, planId);
      onSuccess();
    } catch (err) {
      console.error("Error asignando suscripción:", err);
      alert("Error al asignar suscripción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Nueva Suscripción</h3>

        {/* Select empresa */}
        <label className="block mb-2 text-sm font-medium">Empresa</label>
        <select
          value={empresaId}
          onChange={(e) => setEmpresaId(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Seleccione una empresa</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {/* Select plan */}
        <label className="block mb-2 text-sm font-medium">Plan</label>
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Seleccione un plan</option>
          {planes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} - ${p.precio}
            </option>
          ))}
        </select>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuscripcionesModal;
