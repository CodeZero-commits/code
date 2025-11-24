import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import "./styles/globals.css";

// Páginas independientes (solo estas dos)
import Home from "./pages/Home";
import Login from "./pages/Login";

// Dashboard layout + páginas del dashboard
import DashboardLayout from "./components/admin/layout/DashboardLayout";
import Proyectos from "./pages/Proyectos";
import Clientes from "./pages/Clientes";
import Suscripciones from "./pages/Suscripciones";
import Planes from "./pages/Planes"; // Esta es la única importación de Planes
import Staff from "./components/admin/staff/StaffDashboard";
import WhatsAppCRM from "./pages/WhatsAppCRM";
import Configuracion from "./components/admin/config/Configuracion";
import AjustesGenerales from "./pages/config/AjustesGenerales";
import UXUI from "./pages/pendientes/UXUI";
import Programming from "./pages/pendientes/Programming";
import Social from "./pages/pendientes/Social";
import Roles from "./pages/Roles";
import Usuarios from "./pages/usuarios";
import ContentDashboard from "./pages/content/ContentDashboard";
import ContentHome from "./pages/content/ContentHome";
import ContentProjects from "./pages/content/ContentProjects";
import ContentArticles from "./pages/content/ContentArticles";
import ContentPackages from "./pages/content/ContentPackages";

function App() {
  return (
    <Router>
      <Routes>
        {/* SOLO páginas públicas/independientes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard con layout - TODAS las demás páginas van aquí */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Rutas hijas que se renderizan dentro del <Outlet /> */}
          <Route path="projects" element={<Proyectos />} />
          <Route path="clients" element={<Clientes />} />
          <Route path="subscriptions" element={<Suscripciones />} />
          <Route path="plans" element={<Planes />} />{" "}
          {/* Solo esta ruta de Planes */}
          <Route path="staff" element={<Staff />} />
          <Route path="whatsapp" element={<WhatsAppCRM />} />
          <Route path="settings" element={<Configuracion />} />
          <Route path="settings/ajustes" element={<AjustesGenerales />} />
          <Route path="uxui" element={<UXUI />} />
          <Route path="programming" element={<Programming />} />
          <Route path="social" element={<Social />} />
          <Route path="roles" element={<Roles />} />
          <Route path="users" element={<Usuarios />} />
          <Route path="content" element={<ContentDashboard />} />
          <Route path="content/home" element={<ContentHome />} />
          <Route path="content/projects" element={<ContentProjects />} />
          <Route path="content/articles" element={<ContentArticles />} />
          <Route path="content/packages" element={<ContentPackages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
