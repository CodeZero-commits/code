// components/Sidebar.jsx
import { useNavigate } from "react-router-dom";

import {
  Users,
  Briefcase,
  FileText,
  Palette,
  Code,
  Share2,
  UserCheck,
  Package,
  Home,
  Layers,
  Sparkles,
} from "lucide-react";
import LogoCodeZero from "./../../../assets/images/LogoCodeZero.png";

const Sidebar = ({
  activeSection,
  setActiveSection,
  onBackToPortfolio,
  isOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (section, route) => {
    setActiveSection(section);
    navigate(route);
    if (onClose) onClose();
  };

  // Cada elemento de navegación adopta los colores definidos por las variables
  // CSS (ver globals.css) para responder al cambio de tema de forma automática.
  const NavItem = ({ icon, label, active, onClick, route, sectionKey }) => (
    <button
      onClick={() => {
        if (route) {
          handleNavigation(sectionKey || label.toLowerCase().replace(/\s+/g, ""), route);
        } else if (onClick) {
          onClick();
        }
      }}
      className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active ? "nav-item-active" : ""
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div
      className={`surface-card border-r theme-border h-full flex flex-col transition-all duration-300 ease-in-out w-64 z-40 lg:static lg:translate-x-0 lg:shadow-none lg:h-auto ${
        isOpen ? "translate-x-0 shadow-2xl fixed inset-y-0 left-0" : "-translate-x-full fixed inset-y-0 left-0"
      } lg:flex`}
    >
      {/* Logo */}
      <div
        className="p-6 border-b theme-border flex items-center gap-2 cursor-pointer transition-colors duration-300"
        onClick={onBackToPortfolio}
      >
        <img
          src={LogoCodeZero}
          alt="Code Zero Logo"
          className="w-12 h-12 object-contain" // evita que se estire
        />

        <h1 className="text-2xl font-bold text-[var(--color-text)]">Code Zero</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
      <p className="nav-section-label text-xs font-medium uppercase tracking-wide mb-2">
        CRM Profesional
      </p>
      <NavItem
        icon={<Briefcase className="w-5 h-5" />}
          label="Dashboard"
          active={activeSection === "dashboard"}
          route="/dashboard"
        />
        <NavItem
          icon={<Users className="w-5 h-5" />}
          label="Clientes"
          active={activeSection === "clients"}
          route="/dashboard/clients"
        />
        <NavItem
          icon={<Users className="w-5 h-5" />}
          label="Suscripciones"
          active={activeSection === "subscriptions"}
          route="/dashboard/subscriptions"
        />
        <NavItem
          icon={<FileText className="w-5 h-5" />}
          label="Proyectos"
          active={activeSection === "projects"}
          route="/dashboard/projects"
        />
        <NavItem
          icon={<UserCheck className="w-5 h-5" />}
          label="Roles"
          active={activeSection === "roles"}
          route="/dashboard/roles"
        />

        <NavItem
          icon={<Package className="w-5 h-5" />}
          label="Planes"
          active={activeSection === "plans"}
          route="/dashboard/plans"
        />
        <NavItem
        icon={<Package className="w-5 h-5" />}
        label="Usuarios"
        active={activeSection === "users"}
        route="/dashboard/users"
      />

        <div className="pt-4">
          <p className="nav-section-label text-xs font-medium uppercase tracking-wide mb-2">
            Gestor de Contenido
          </p>
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Home"
            sectionKey="content-home"
            active={activeSection === "content-home"}
            route="/dashboard/content/home"
          />
          <NavItem
            icon={<Sparkles className="w-5 h-5" />}
            label="Proyectos CMS"
            sectionKey="content-projects"
            active={activeSection === "content-projects"}
            route="/dashboard/content/projects"
          />
          <NavItem
            icon={<FileText className="w-5 h-5" />}
            label="Artículos"
            sectionKey="content-articles"
            active={activeSection === "content-articles"}
            route="/dashboard/content/articles"
          />
          <NavItem
            icon={<Layers className="w-5 h-5" />}
            label="Paquetes"
            sectionKey="content-packages"
            active={activeSection === "content-packages"}
            route="/dashboard/content/packages"
          />
        </div>

        {/* Áreas de Trabajo */}
        <div className="pt-4">
          <p className="nav-section-label text-xs font-medium uppercase tracking-wide mb-2">
            Áreas de Trabajo
          </p>
          <NavItem
            icon={<Palette className="w-5 h-5" />}
            label="WhatsApp"
            active={activeSection === "whatsapp"}
            route="/dashboard/whatsapp"
          />
          <NavItem
            icon={<Palette className="w-5 h-5" />}
            label="UX/UI Design"
            active={activeSection === "uxui"}
            route="/dashboard/uxui"
          />
          <NavItem
            icon={<Code className="w-5 h-5" />}
            label="Programación"
            active={activeSection === "programming"}
            route="/dashboard/programming"
          />
          <NavItem
            icon={<Share2 className="w-5 h-5" />}
            label="Social Media"
            active={activeSection === "social"}
            route="/dashboard/social"
          />
        </div>
      </nav>
      <div className="p-4 lg:hidden">
        <button
          type="button"
          onClick={onClose}
          className="w-full theme-toggle py-2 rounded-lg text-sm"
        >
          Cerrar menú
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
