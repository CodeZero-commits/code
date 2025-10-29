// components/DashboardContent.jsx
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Palette,
  Code,
  Share2,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
} from "lucide-react";

function DashboardContent() {
  // Datos mock para el dashboard
  const stats = [
    {
      title: "Proyectos Activos",
      value: "12",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    { title: "Clientes", value: "8", icon: Users, color: "bg-green-500" },
    {
      title: "Ingresos Mes",
      value: "$45,000",
      icon: DollarSign,
      color: "bg-purple-500",
    },
    {
      title: "Tareas Pendientes",
      value: "23",
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  const projects = [
    {
      id: 1,
      client: "TechStart Inc.",
      service: "Manual de Identidad",
      status: "En Progreso",
      progress: 65,
      deadline: "2024-09-15",
      budget: 15000,
      area: "UXUI",
    },
    {
      id: 2,
      client: "Café Central",
      service: "Desarrollo Web",
      status: "Revisión",
      progress: 85,
      deadline: "2024-09-10",
      budget: 25000,
      area: "Programación",
    },
    {
      id: 3,
      client: "Boutique Luna",
      service: "Social Media Strategy",
      status: "Iniciado",
      progress: 20,
      deadline: "2024-09-25",
      budget: 8000,
      area: "Social Media",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "En Progreso":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Revisión":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Iniciado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completado":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAreaIcon = (area) => {
    switch (area) {
      case "UXUI":
        return <Palette className="w-4 h-4" />;
      case "Programación":
        return <Code className="w-4 h-4" />;
      case "Social Media":
        return <Share2 className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  // Componente StatsCards
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente ProjectsTable
  const ProjectsTable = () => (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Proyectos Recientes
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Cliente / Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Área
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Fecha Límite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Presupuesto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {project.client}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.service}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getAreaIcon(project.area)}
                    <span className="text-sm text-gray-900">
                      {project.area}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[40px]">
                      {project.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.deadline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${project.budget.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <StatsCards />
      <ProjectsTable />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <Palette className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            Nuevo Proyecto UX/UI
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Crear proyecto de diseño con plantillas predefinidas
          </p>
          <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
            Comenzar →
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <Code className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Nuevo Desarrollo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Iniciar proyecto de programación web o app
          </p>
          <Link
            to="/proyectos-saas"
            className="text-green-600 font-medium text-sm hover:text-green-700"
          >
            Comenzar →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <Share2 className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            Estrategia Social
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Planificar campañas y gestión de redes
          </p>
          <button className="text-purple-600 font-medium text-sm hover:text-purple-700">
            Comenzar →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
