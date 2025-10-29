import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Users, Settings, Database } from "lucide-react";

const Configuracion = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Planes",
      icon: CreditCard,
      path: "/plans",
      description: "Administrar los planes disponibles",
    },
    {
      label: "Proyectos",
      icon: Database,
      path: "/projects",
      description: "Administrar proyectos y sus datos",
    },
    {
      label: "Ajustes Generales",
      icon: Settings,
      path: "/dashboard/settings/ajustes",
      description: "Configurar parámetros generales del sistema",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <div
              key={btn.label}
              onClick={() => navigate(btn.path)}
              className="cursor-pointer surface-card theme-border rounded-xl p-6 flex flex-col items-start gap-4 hover:shadow-soft transition-shadow"
            >
              <div className="p-3 rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary-foreground)]">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                {btn.label}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {btn.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Configuracion;
