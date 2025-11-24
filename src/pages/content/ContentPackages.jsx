import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Save, Layers } from "lucide-react";
import PackagesService from "../../services/PackagesService";
import UploadService from "../../services/UploadService";

const categories = [
  "Web",
  "UX/UI",
  "Automations/N8N",
  "Mobile",
  "Desktop",
  "Social Media",
  "General",
];

const defaultPackage = {
  name: "",
  category: categories[0],
  price: "",
  description: "",
  benefits: [""],
  visibility: "public",
  display_order: 1,
  image_url: "",
};

const ContentPackages = () => {
  const { searchTerm } = useOutletContext();
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(defaultPackage);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const loadPackages = async () => {
    try {
      const data = await PackagesService.getPackages();
      setPackages(data.packages || data.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los paquetes");
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(defaultPackage);
  };

  const startEdit = (pkg) => {
    const benefits = Array.isArray(pkg.benefits)
      ? pkg.benefits
      : typeof pkg.benefits_json === "string"
      ? JSON.parse(pkg.benefits_json)
      : pkg.benefits_json || [];
    setEditing(pkg);
    setForm({ ...defaultPackage, ...pkg, benefits: benefits.length ? benefits : [""] });
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const result = await UploadService.uploadImage(file);
    if (result.url) {
      setForm((prev) => ({ ...prev, image_url: result.url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, benefits_json: JSON.stringify(form.benefits) };
    try {
      if (editing?.id) {
        await PackagesService.updatePackage(editing.id, payload);
      } else {
        await PackagesService.createPackage(payload);
      }
      startCreate();
      loadPackages();
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo guardar el paquete");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar paquete?") || !id) return;
    await PackagesService.deletePackage(id);
    loadPackages();
  };

  const filteredPackages = useMemo(
    () =>
      packages.filter((item) =>
        (item.name || "")
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase())
      ),
    [packages, searchTerm]
  );

  const updateBenefit = (index, value) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, idx) => (idx === index ? value : benefit)),
    }));
  };

  const addBenefit = () => {
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const removeBenefit = (index) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Servicios</p>
            <h3 className="text-xl font-semibold">Paquetes</h3>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={startCreate}>
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id || pkg.name} className="surface-card theme-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{pkg.category}</p>
                  <h4 className="text-lg font-semibold">{pkg.name}</h4>
                  <p className="text-sm text-[var(--color-text-muted)]">{pkg.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-white/5"
                    onClick={() => startEdit(pkg)}
                    aria-label="Editar paquete"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 text-red-300"
                    onClick={() => handleDelete(pkg.id)}
                    aria-label="Eliminar paquete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                <span>{pkg.price ? `$${pkg.price}` : "Sin precio"}</span>
                <span>{pkg.visibility === "hidden" ? "Oculto" : "Visible"}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {(pkg.benefits || []).map((benefit, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {!filteredPackages.length && (
            <div className="col-span-full text-center py-12">
              <Layers className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-[var(--color-text-muted)]">No hay paquetes registrados</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface-card theme-border rounded-2xl p-6 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Formulario</p>
            <h4 className="text-lg font-semibold">{editing ? "Editar" : "Crear"} paquete</h4>
          </div>
          {error && <span className="text-red-300 text-sm">{error}</span>}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="input"
            placeholder="Nombre del paquete"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Categoría</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Precio</label>
              <input
                type="text"
                className="input"
                placeholder="$0.00"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          <textarea
            className="input"
            rows="3"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--color-text-muted)]">Beneficios</label>
              <button type="button" className="btn-primary btn-sm" onClick={addBenefit}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {form.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className="input flex-1"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/5 text-red-300"
                    onClick={() => removeBenefit(index)}
                    aria-label="Eliminar beneficio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Visibilidad</label>
              <select
                className="input"
                value={form.visibility}
                onChange={(e) => setForm((prev) => ({ ...prev, visibility: e.target.value }))}
              >
                <option value="public">Público</option>
                <option value="hidden">Oculto</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Orden</label>
              <input
                type="number"
                className="input"
                value={form.display_order}
                onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-muted)]">Imagen</label>
            <input
              type="url"
              className="input"
              placeholder="URL de imagen"
              value={form.image_url}
              onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
            />
            <label className="theme-toggle cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg">
              <Package className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
              <span>Subir archivo</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {editing && (
            <button type="button" className="theme-toggle px-4 py-2 rounded-lg" onClick={startCreate}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg">
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentPackages;
