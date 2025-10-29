// components/Sidebar.jsx
import { useNavigate } from "react-router-dom";

import {
  Users,
  Briefcase,
  FileText,
  Settings,
  Palette,
  Code,
  Share2,
  LogOut,
  UserCheck,
  CreditCard,
  Award,
  Package,
} from "lucide-react";
import LogoCodeZero from "./../../../assets/images/LogoCodeZero.png";

const Sidebar = ({
  activeSection,
  setActiveSection,
  LogoCode,
  onBackToPortfolio,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Función para navegar y actualizar estado
  const handleNavigation = (section, route) => {
    setActiveSection(section);
    navigate(route);
  };

  const NavItem = ({ icon, label, active, onClick, route }) => (
    <button
      onClick={() => {
        if (route) {
          handleNavigation(label.toLowerCase().replace(/\s+/g, ""), route);
        } else if (onClick) {
          onClick();
        }
      }}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div
        className="p-6 border-b border-gray-200 flex  items-center gap-2 cursor-pointer"
        onClick={onBackToPortfolio}
      >
        <img
          src={LogoCodeZero}
          alt="Code Zero Logo"
          className="w-12 h-12 object-contain" // evita que se estire
        />

        <h1 className="text-2xl font-bold text-gray-900">Code Zero</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
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
          active={activeSection === "plans"}
          route="/dashboard/users"
        />

        {/* Áreas de Trabajo */}
        <div className="pt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
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
    </div>
  );
};

export default Sidebar;
