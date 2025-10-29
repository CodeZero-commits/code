import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(null);
  const location = useLocation();

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
    };
    return sectionMap[path] || "dashboard";
  };

  const [activeSection, setActiveSection] = useState(
    getActiveSectionFromPath(location.pathname)
  );

  // Actualizar activeSection cuando cambia la ruta
  useEffect(() => {
    const newSection = getActiveSectionFromPath(location.pathname);
    setActiveSection(newSection);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 flex flex-col">
        <Header
          activeSection={activeSection}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowModal={setShowModal}
        />
        <main className="p-6 flex-1 bg-gray-100">
          <Outlet
            context={{
              showModal,
              setShowModal,
              searchTerm,
              setSearchTerm,
              activeSection,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
