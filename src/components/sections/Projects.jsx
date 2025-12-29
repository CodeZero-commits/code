import React, { useState, useMemo } from "react";
import {
  ExternalLink,
  Figma,
  Eye,
  EyeOff,
  Filter,
  Smartphone,
  Globe,
  Palette,
  Github,
} from "lucide-react";

// --- IMPORTACIÓN DE IMÁGENES ---
import ClinicFlow from "./../../assets/images/design/Clinic-Flow-code-zero.jpg";
import PulseMedia from "./../../assets/images/design/Pulse-Media-code-zero.jpg";
import BarberZone from "./../../assets/images/design/Barber-Zone-code-zero.PNG";
import BlackSector from "./../../assets/images/design/Black-Sector-code-zero.PNG";
import Odontologia from "./../../assets/images/design/Landing-page-odontologia-code-zero.jpg";
import RealVictoria from "./../../assets/images/design/Real-Victoria-code-zero.jpg";
import Autoland from "./../../assets/images/design/AutoLand-code-zero.jpg";
import Zenith from "./../../assets/images/design/Zenith-code-zero.jpg";
import CloudBox from "./../../assets/images/design/CloudBox-code-zero.jpg";

// --- DATOS DE PROYECTOS (Fuera del componente para rendimiento) ---
const ALL_PROJECTS = [
  {
    id: 1,
    title: "ClinicFlow Dashboard",
    alt: "ClinicFlow Dashboard - SaaS médico",
    category: "web",
    tags: ["React", "PHP", "MySQL", "SaaS"],
    description:
      "Sistema SaaS para la gestión integral de clínicas: agenda de citas, historial médico digital y facturación automatizada.",
    image: ClinicFlow,
    liveUrl: "", // Pon aquí la URL real cuando la tengas
    githubUrl: "",
    featured: true,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Real Victoria App",
    alt: "Real Victoria App - Mariachis",
    category: "mobile",
    tags: ["Flutter", "Node.js", "MySQL", "Mobile App"],
    description:
      "Aplicación móvil para grupos de mariachis que permite reservas, gestión de eventos y pagos en línea.",
    image: RealVictoria,
    liveUrl: "",
    githubUrl: "",
    featured: true,
    color: "from-green-500 to-blue-600",
  },
  {
    id: 3,
    title: "Zenith Landing Page",
    alt: "Zenith Travel",
    category: "design",
    tags: ["Figma", "React", "Travel", "UI/UX"],
    description:
      "Landing page diseñada en Figma para una agencia de viajes, con enfoque en UX/UI moderno.",
    image: Zenith,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-pink-500 to-orange-600",
  },
  {
    id: 4,
    title: "Pulse Media Analytics",
    alt: "Pulse Media Analytics",
    category: "web",
    tags: ["React", "PHP", "MySQL", "Analytics"],
    description:
      "Plataforma web para músicos que ofrece métricas avanzadas y análisis de audiencia.",
    image: PulseMedia,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 5,
    title: "CloudBox – UI Kit .NET",
    alt: "CloudBox UI Kit",
    category: "design",
    tags: ["Figma", "Design System", ".NET", "Dark Mode"],
    description:
      "Kit de diseño moderno en Figma para aplicaciones .NET. Incluye componentes y dark mode.",
    image: CloudBox,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: 6,
    title: "AutoLand Mobile",
    alt: "AutoLand Mobile App",
    category: "mobile",
    tags: ["Flutter", "Firebase", "Automotive", "Inventory"],
    description:
      "App para concesionarios que gestiona inventario, reservas de prueba de manejo y clientes.",
    image: Autoland,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-red-500 to-pink-600",
  },
  {
    id: 7,
    title: "BarberZone Platform",
    alt: "BarberZone",
    category: "web",
    tags: ["React", "PHP", "MySQL", "SaaS"],
    description:
      "Plataforma web para barberías que permite reservas en línea y gestión de promociones.",
    image: BarberZone,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-red-500 to-pink-600",
  },
  {
    id: 8,
    title: "Black Sector Gore",
    alt: "Black Sector Horror",
    category: "web",
    tags: ["React", "PHP", "Multimedia", "Interactive"],
    description:
      "Sitio web de terror con relatos, videos y minijuegos interactivos.",
    image: BlackSector,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-red-500 to-pink-600",
  },
  {
    id: 9,
    title: "Odontología Landing",
    alt: "Clínica Dental",
    category: "web",
    tags: ["React", "PHP", "Medical", "Landing"],
    description:
      "Landing page para clínica odontológica con servicios y formulario de contacto.",
    image: Odontologia,
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: "from-teal-500 to-blue-600",
  },
];

// --- SUB-COMPONENTE: Tarjeta de Proyecto ---
const ProjectCard = ({ project, isFeatured = false }) => {
  // Función auxiliar para saber si el link es válido
  const isValidLink = (link) => link && link !== "#" && link !== "";

  return (
    <div
      className={`group glass rounded-2xl overflow-hidden hover-lift border border-white/5 hover:border-purple-500/30 transition-all duration-500 flex flex-col ${
        isFeatured ? "h-full" : ""
      }`}
    >
      {/* Imagen con Overlay */}
      <div className="relative overflow-hidden h-56 sm:h-64 flex-shrink-0">
        <img
          src={project.image}
          alt={project.alt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Categoría Badge Flotante */}
        <div className="absolute -top-14 right-4">
          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${project.color} rounded-full shadow-lg`}
          >
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-md bg-gray-800/80 text-gray-300 border border-gray-700/50"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-md bg-gray-800/80 text-gray-500 border border-gray-700/50">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* --- NUEVA SECCIÓN DE BOTONES --- */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-800">
          {/* Botón Principal: Ver Demo */}
          {isValidLink(project.liveUrl) ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 group/btn"
            >
              <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              <span>Ver Demo</span>
            </a>
          ) : (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-500 text-sm font-medium py-2.5 px-4 rounded-xl cursor-not-allowed opacity-70"
            >
              <EyeOff className="w-4 h-4" />
              <span>Próximamente</span>
            </button>
          )}

          {/* Botón Secundario: Código / Diseño */}
          {isValidLink(project.githubUrl) && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-10 bg-gray-800/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700 transition-all duration-300"
              title={
                project.category === "design"
                  ? "Ver Diseño en Figma"
                  : "Ver Código en GitHub"
              }
            >
              {project.category === "design" ? (
                <Figma className="w-5 h-5" />
              ) : (
                <Github className="w-5 h-5" />
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Todos", icon: Filter },
    { id: "web", label: "Web", icon: Globe },
    { id: "mobile", label: "Mobile", icon: Smartphone },
    { id: "design", label: "Diseño", icon: Palette },
  ];

  // Filtrado optimizado
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return ALL_PROJECTS;
    return ALL_PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const featuredProjects = ALL_PROJECTS.filter((p) => p.featured);

  return (
    <section
      id="projects"
      className="py-20 bg-gray-900 relative overflow-hidden"
    >
      {/* Background Decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de Sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis <span className="gradient-text">Proyectos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Selección de trabajos donde combino código, diseño y estrategia.
          </p>
        </div>

        {/* Sección: Proyectos Destacados (Siempre visibles si no hay filtro activo) */}
        {activeFilter === "all" && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gray-800 flex-1"></div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-yellow-500">★</span> Destacados
              </h3>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isFeatured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 border ${
                activeFilter === filter.id
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20 scale-105"
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600"
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Call to Action Footer */}
        <div className="text-center mt-20">
          <a
            href="https://github.com/CodeZero-commits"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass px-8 py-3 rounded-full text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <Github className="w-5 h-5" />
            <span>Ver más en GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
