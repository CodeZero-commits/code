import React from "react";
import { Link } from "react-router-dom";
import { Home, FolderOpen, FileText, Package } from "lucide-react";

const cards = [
  { title: "Home", to: "/dashboard/content/home", icon: <Home className="w-5 h-5" />, description: "Hero, highlights y límites de destacados." },
  { title: "Proyectos", to: "/dashboard/content/projects", icon: <FolderOpen className="w-5 h-5" />, description: "Catálogo para portada y landing." },
  { title: "Artículos", to: "/dashboard/content/articles", icon: <FileText className="w-5 h-5" />, description: "Blog y artículos destacados." },
  { title: "Paquetes", to: "/dashboard/content/packages", icon: <Package className="w-5 h-5" />, description: "Servicios, precios y beneficios." },
];

const ContentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Gestor de contenido</p>
        <h3 className="text-2xl font-bold">Central de ajustes</h3>
        <p className="text-[var(--color-text-muted)] mt-1">
          Define qué se muestra en el Home, proyectos destacados, artículos y paquetes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="surface-card theme-border rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-soft transition-all flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-text)]">
              {card.icon}
            </div>
            <div>
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-sm text-[var(--color-text-muted)]">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentDashboard;
