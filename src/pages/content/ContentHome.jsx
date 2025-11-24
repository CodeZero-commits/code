import React, { useEffect, useMemo, useState } from "react";
import ContentService from "../../services/ContentService";
import UploadService from "../../services/UploadService";
import { Plus, Save, Upload, Trash2, AlertCircle } from "lucide-react";

const defaultHome = {
  heroTitle: "",
  heroSubtitle: "",
  heroCta: "",
  heroImage: "",
  highlights: [{ title: "", description: "" }],
  stats: [{ label: "", value: "" }],
  limits: { projects: 6, articles: 4, packages: 6 },
};

const ContentHome = () => {
  const [homeData, setHomeData] = useState(defaultHome);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadHome = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ContentService.getSection("home");
      const record =
        response.section ||
        response.content?.find((item) => item.section === "home") ||
        response.data;
      if (record) {
        const parsed = typeof record === "object" ? record : {};
        const payload = parsed.data || parsed.data_json || parsed;
        setHomeData({ ...defaultHome, ...(payload || {}) });
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la configuración del Home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHome();
  }, []);

  const handleChange = (field, value) => {
    setHomeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setHomeData((prev) => {
      const updated = prev[field]?.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field) => {
    const template = field === "stats" ? { label: "", value: "" } : { title: "", description: "" };
    setHomeData((prev) => ({ ...prev, [field]: [...(prev[field] || []), template] }));
  };

  const removeArrayItem = (field, index) => {
    setHomeData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const uploadResponse = await UploadService.uploadImage(file);
      if (uploadResponse.url) {
        handleChange("heroImage", uploadResponse.url);
        setMessage("Imagen cargada correctamente");
      }
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError.message || "No se pudo subir la imagen");
    }
  };

  const handleSave = async () => {
    try {
      setMessage(null);
      setError(null);
      await ContentService.updateSection("home", {
        section: "home",
        data: homeData,
      });
      setMessage("Configuración guardada");
      loadHome();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar la sección");
    }
  };

  const statGrid = useMemo(
    () =>
      (homeData.stats || []).map((stat, index) => (
        <div key={`stat-${index}`} className="surface-card theme-border p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-start">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Dato #{index + 1}</p>
            <button
              type="button"
              className="text-red-400 hover:text-red-200"
              onClick={() => removeArrayItem("stats", index)}
              aria-label="Eliminar estadística"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={stat.label}
              onChange={(e) => handleArrayChange("stats", index, "label", e.target.value)}
              placeholder="Etiqueta"
              className="input"
            />
            <input
              type="text"
              value={stat.value}
              onChange={(e) => handleArrayChange("stats", index, "value", e.target.value)}
              placeholder="Valor"
              className="input"
            />
          </div>
        </div>
      )),
    [homeData.stats]
  );

  const highlightGrid = useMemo(
    () =>
      (homeData.highlights || []).map((item, index) => (
        <div key={`highlight-${index}`} className="surface-card theme-border p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-start">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Bloque #{index + 1}</p>
            <button
              type="button"
              className="text-red-400 hover:text-red-200"
              onClick={() => removeArrayItem("highlights", index)}
              aria-label="Eliminar bloque"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleArrayChange("highlights", index, "title", e.target.value)}
              placeholder="Título"
              className="input"
            />
            <textarea
              rows="3"
              value={item.description}
              onChange={(e) => handleArrayChange("highlights", index, "description", e.target.value)}
              placeholder="Descripción"
              className="input"
            />
          </div>
        </div>
      )),
    [homeData.highlights]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--color-text-muted)] animate-pulse">Cargando sección Home...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div className={`rounded-xl border px-4 py-3 ${
          error
            ? "border-red-500/40 bg-red-500/10 text-red-200"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
        }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error || message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface-card theme-border rounded-2xl p-6 space-y-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Hero principal</p>
              <h3 className="text-xl font-semibold">Contenido del Home</h3>
            </div>
            <label className="btn-primary flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Subir imagen</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              className="input"
              placeholder="Título principal"
              value={homeData.heroTitle}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
            />
            <textarea
              className="input"
              rows="3"
              placeholder="Subtítulo / descripción"
              value={homeData.heroSubtitle}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Texto del CTA"
              value={homeData.heroCta}
              onChange={(e) => handleChange("heroCta", e.target.value)}
            />
            <input
              type="url"
              className="input"
              placeholder="URL de la imagen"
              value={homeData.heroImage}
              onChange={(e) => handleChange("heroImage", e.target.value)}
            />
          </div>
        </div>

        <div className="surface-card theme-border rounded-2xl p-6 space-y-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Límites</p>
              <h3 className="text-xl font-semibold">Elementos destacados</h3>
            </div>
            <Plus className="w-5 h-5 text-[var(--color-text-muted)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "projects", label: "Proyectos" },
              { key: "articles", label: "Artículos" },
              { key: "packages", label: "Paquetes" },
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <label className="text-sm text-[var(--color-text-muted)]">{item.label}</label>
                <input
                  type="number"
                  min="1"
                  className="input"
                  value={homeData.limits?.[item.key] ?? ""}
                  onChange={(e) =>
                    setHomeData((prev) => ({
                      ...prev,
                      limits: { ...prev.limits, [item.key]: Number(e.target.value) },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Highlights</h4>
            <button
              type="button"
              className="btn-primary flex items-center gap-2"
              onClick={() => addArrayItem("highlights")}
            >
              <Plus className="w-4 h-4" /> Bloque
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{highlightGrid}</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Estadísticas</h4>
            <button
              type="button"
              className="btn-primary flex items-center gap-2"
              onClick={() => addArrayItem("stats")}
            >
              <Plus className="w-4 h-4" /> Dato
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{statGrid}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
        >
          <Save className="w-4 h-4" /> Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default ContentHome;
