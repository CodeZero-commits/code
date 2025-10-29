import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(null);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    // Persist the chosen theme between sessions using localStorage
    const storedTheme = localStorage.getItem("dashboard-theme");
    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    // Apply the theme to the <html> and <body> elements so the whole
    // application (including modals and portals) inherits the palette.
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  // Extraer la sección activa de la URL
  // Extraer la sección activa de la URL
  const getActiveSectionFromPath = (pathname) => {
    const path = pathname.split("/").pop();
    const sectionMap = {
      clients: "clients",
      staff: "staff",
      users: "users", // 👈 agregado
      subscriptions: "subscriptions",
      projects: "projects",
      roles: "roles",
      plans: "plans",
      uxui: "uxui",
      programming: "programming",
      social: "social",
      settings: "settings",
      ajustes: "settings",
    };
    return sectionMap[path] || "dashboard";
  };

  const [activeSection, setActiveSection] = useState(
    getActiveSectionFromPath(location.pathname)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Actualizar activeSection cuando cambia la ruta
  useEffect(() => {
    const newSection = getActiveSectionFromPath(location.pathname);
    setActiveSection(newSection);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // El botón del header invierte el modo actual actualizando la preferencia.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div
      className="dashboard-theme min-h-screen transition-colors duration-300"
      data-theme={theme}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex min-h-screen">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeSection={activeSection}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowModal={setShowModal}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
          <main className="p-4 sm:p-6 flex-1 background-muted transition-colors duration-300 min-w-0">
            <Outlet
              context={{
                showModal,
                setShowModal,
                searchTerm,
                setSearchTerm,
                activeSection,
                theme,
                setTheme,
                toggleTheme,
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
