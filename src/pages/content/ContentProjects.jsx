import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Edit, Trash2, Save, FolderOpen } from "lucide-react";
import ProjectService from "../../services/ProjectsService";
import UploadService from "../../services/UploadService";

const defaultProject = {
  title: "",
  description: "",
  category: "General",
  image_url: "",
  status: "draft",
  is_featured: false,
  display_order: 1,
};

const ContentProjects = () => {
  const { searchTerm } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultProject);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectService.getProjects();
      const list = data.projects || data.proyectos || data.data || [];
      setProjects(list);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(defaultProject);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({ ...defaultProject, ...item });
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
    try {
      if (editing?.id) {
        await ProjectService.updateProject(editing.id, form);
      } else {
        await ProjectService.createProject(form);
      }
      startCreate();
      loadProjects();
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo guardar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar proyecto?")) return;
    try {
      await ProjectService.deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el proyecto");
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((item) =>
        (item.title || item.nombre || "")
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase())
      ),
    [projects, searchTerm]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Catálogo</p>
            <h3 className="text-xl font-semibold">Proyectos</h3>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={startCreate}>
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center text-[var(--color-text-muted)]">Cargando proyectos...</div>
          ) : filteredProjects.length ? (
            filteredProjects.map((project) => (
              <div key={project.id || project.title} className="surface-card theme-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{project.category || project.categoria}</p>
                    <h4 className="text-lg font-semibold">{project.title || project.nombre}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-white/5"
                      onClick={() => startEdit(project)}
                      aria-label="Editar proyecto"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-white/5 text-red-300"
                      onClick={() => handleDelete(project.id)}
                      aria-label="Eliminar proyecto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">
                  {project.description || project.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>Orden: {project.display_order || project.orden || 1}</span>
                  <span>{project.status || project.estado || "draft"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-[var(--color-text-muted)]">No hay proyectos registrados</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface-card theme-border rounded-2xl p-6 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Formulario</p>
            <h4 className="text-lg font-semibold">{editing ? "Editar" : "Crear"} proyecto</h4>
          </div>
          {error && <span className="text-red-300 text-sm">{error}</span>}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="input"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <textarea
            className="input"
            rows="3"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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
                {["General", "Web", "UX/UI", "Mobile", "Automations/N8N"].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Estado</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--color-text-muted)]">Orden</label>
              <input
                type="number"
                className="input"
                value={form.display_order}
                onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
              />
              Destacado en Home
            </label>
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
              <Upload className="w-4 h-4" />
              <span>Subir archivo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {editing && (
            <button
              type="button"
              className="theme-toggle px-4 py-2 rounded-lg"
              onClick={startCreate}
            >
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

export default ContentProjects;
