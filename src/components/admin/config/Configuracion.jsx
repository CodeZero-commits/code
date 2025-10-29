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
      path: "/config/ajustes",
      description: "Configurar parámetros generales del sistema",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <div
              key={btn.label}
              onClick={() => navigate(btn.path)}
              className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-4 hover:shadow-lg transition-shadow"
            >
              <Icon className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                {btn.label}
              </h2>
              <p className="text-gray-500 text-sm">{btn.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Configuracion;
