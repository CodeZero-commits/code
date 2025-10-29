import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import LogoCodezero from "./../../../assets/images/profile.jpg";

function Header({
  activeSection,
  searchTerm,
  setSearchTerm,
  setShowModal,
  theme,
  toggleTheme,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // SPA navigation
  };

  const handleDropdownClick = (action) => {
    switch (action) {
      case "staff":
        navigate("/dashboard/staff");
        break;
      case "settings":
        navigate("/dashboard/settings");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
    setDropdownOpen(false);
  };

  const getSectionTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      staff: "Gestión de Staff",
      clients: "Clientes",
      users: "Usuarios", // 👈 agregado
      projects: "Proyectos",
      subscriptions: "Suscripciones",
      roles: "Roles",
      uxui: "UX/UI Design",
      programming: "Programación",
      social: "Social Media",
      settings: "Configuración",
      plans: "Planes",
    };
    return titles[activeSection] || activeSection;
  };

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case "staff":
        return "Buscar miembros del staff...";
      case "clients":
        return "Buscar clientes...";
      case "users": // 👈 agregado
        return "Buscar usuarios...";
      case "subscriptions":
        return "Buscar suscripciones...";
      case "projects":
        return "Buscar proyectos...";
      case "roles":
        return "Buscar roles...";
      case "plans":
        return "Buscar planes...";
      default:
        return "Buscar...";
    }
  };

  const getActionButton = () => {
    const buttonConfig = {
      clients: {
        text: "Agregar Cliente",
        modal: "clients",
      },
      staff: {
        text: "Agregar Staff",
        modal: "staff",
      },
      users: {
        // 👈 agregado
        text: "Agregar Usuario",
        modal: "users",
      },
      subscriptions: {
        text: "Agregar Suscripción",
        modal: "subscriptions",
      },
      projects: {
        text: "Agregar Proyecto",
        modal: "projects",
      },
      roles: {
        text: "Agregar Rol",
        modal: "roles",
      },
      plans: {
        text: "Agregar Plan",
        modal: "plans",
      },
    };

    const config = buttonConfig[activeSection];

    if (!config) return null;

    return (
      <button
        onClick={() => setShowModal(config.modal)}
        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
      >
        <Plus className="w-4 h-4" /> {config.text}
      </button>
    );
  };

  return (
    <div className="surface-card theme-border shadow-soft px-6 py-4 flex items-center justify-between transition-colors duration-300">
      <h2 className="text-2xl font-bold text-[var(--color-text)]">
        {getSectionTitle()}
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input pl-10 pr-4 py-2 rounded-lg focus:outline-none"
          />
        </div>

        {getActionButton()}

        {/* Theme toggle button. It updates the CSS variables defined in globals.css */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle w-10 h-10 rounded-full flex items-center justify-center"
          aria-label={
            theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="relative">
          <img
            src={LogoCodezero}
            alt="Perfil"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="dropdown-panel absolute right-0 mt-2 w-48 rounded-lg z-50">
              <button
                onClick={() => handleDropdownClick("staff")}
                className="dropdown-item w-full text-left px-4 py-2 flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Staff
              </button>
              <button
                onClick={() => handleDropdownClick("settings")}
                className="dropdown-item w-full text-left px-4 py-2 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> Configuración
              </button>
              <button
                onClick={() => handleDropdownClick("logout")}
                className="dropdown-item danger w-full text-left px-4 py-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
