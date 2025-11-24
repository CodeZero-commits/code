import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileText, Plus, Edit, Trash2, Save } from "lucide-react";
import ArticlesService from "../../services/ArticlesService";
import UploadService from "../../services/UploadService";

const defaultArticle = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  image_url: "",
  status: "draft",
  is_featured: false,
  display_order: 1,
};

const ContentArticles = () => {
  const { searchTerm } = useOutletContext();
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultArticle);
  const [error, setError] = useState(null);

  const loadArticles = async () => {
    try {
      const data = await ArticlesService.getArticles();
      setArticles(data.articles || data.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los artículos");
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const startEdit = (item) => {
    setEditing(item);
    setForm({ ...defaultArticle, ...item });
  };

  const startCreate = () => {
    setEditing(null);
    setForm(defaultArticle);
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
        await ArticlesService.updateArticle(editing.id, form);
      } else {
        await ArticlesService.createArticle(form);
      }
      startCreate();
      loadArticles();
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo guardar el artículo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar artículo?")) return;
    await ArticlesService.deleteArticle(id);
    loadArticles();
  };

  const filteredArticles = useMemo(
    () =>
      articles.filter((item) =>
        (item.title || "")
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase())
      ),
    [articles, searchTerm]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Blog</p>
            <h3 className="text-xl font-semibold">Artículos</h3>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={startCreate}>
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <div key={article.id || article.title} className="surface-card theme-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{article.author || "Sin autor"}</p>
                  <h4 className="text-lg font-semibold">{article.title}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-white/5"
                    onClick={() => startEdit(article)}
                    aria-label="Editar artículo"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 text-red-300"
                    onClick={() => handleDelete(article.id)}
                    aria-label="Eliminar artículo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Orden: {article.display_order || 1}</span>
                <span>{article.status || "draft"}</span>
              </div>
            </div>
          ))}
          {!filteredArticles.length && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-[var(--color-text-muted)]">No hay artículos registrados</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface-card theme-border rounded-2xl p-6 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Formulario</p>
            <h4 className="text-lg font-semibold">{editing ? "Editar" : "Crear"} artículo</h4>
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
          <input
            className="input"
            placeholder="Autor"
            value={form.author}
            onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
          />
          <textarea
            className="input"
            rows="2"
            placeholder="Resumen"
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            required
          />
          <textarea
            className="input"
            rows="5"
            placeholder="Contenido"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-3">
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
            <label className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
              />
              Destacado
            </label>
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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <span>Cargar archivo</span>
              </label>
            </div>
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

export default ContentArticles;
