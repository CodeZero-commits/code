import React, { useState } from "react";
import {
  ExternalLink,
  Figma,
  Eye,
  Filter,
  Smartphone,
  Globe,
  Palette,
} from "lucide-react";
import ClinicFlow from "./../../assets/images/design/Clinic-Flow-code-zero.jpg";
import PulseMedia from "./../../assets/images/design/Pulse-Media-code-zero.jpg";
import BarberZone from "./../../assets/images/design/Barber-Zone-code-zero.png";
import BlackSector from "./../../assets/images/design/Black-Sector-code-zero.PNG";
import Odontologia from "./../../assets/images/design/Landing-page-odontologia-code-zero.jpg";
import RealVictoria from "./../../assets/images/design/Real-Victoria-code-zero.jpg";
import Autoland from "./../../assets/images/design/AutoLand-code-zero.jpg";
import Zenith from "./../../assets/images/design/Zenith-code-zero.jpg";
import CloudBox from "./../../assets/images/design/CloudBox-code-zero.jpg";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "ClinicFlow Dashboard",
      alt: "ClinicFlow Dashboard - Sistema SaaS para gestión integral de clínicas médicas",
      category: "web",
      tags: ["React", "PHP", "MySQL", "SaaS", "Healthcare", "Medical Software"],
      description:
        "Sistema SaaS para la gestión integral de clínicas: agenda de citas, historial médico digital y facturación automatizada.",
      image: ClinicFlow,
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "Real Victoria App",
      alt: "Real Victoria App - Aplicación móvil para reservas y gestión de eventos de mariachis",
      category: "mobile",
      tags: [
        "Flutter",
        "Node.js",
        "PHP",
        "MySQL",
        "Eventos",
        "Reservas",
        "Mobile App",
      ],
      description:
        "Aplicación móvil para grupos de mariachis que permite reservas, gestión de eventos y pagos en línea.",
      image: RealVictoria,
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
      color: "from-green-500 to-blue-600",
    },
    {
      id: 3,
      title: "Zenith Landing Page",
      alt: "Zenith Landing Page - Diseño UX/UI para agencia de viajes en Figma",
      category: "design",
      tags: [
        "Figma",
        "Storybook",
        "React",
        "Travel",
        "Landing Page",
        "UI/UX Design",
      ],
      description:
        "Landing page diseñada en Figma para una agencia de viajes, con enfoque en UX/UI moderno y experiencia de usuario intuitiva.",
      image: Zenith,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-pink-500 to-orange-600",
    },
    {
      id: 4,
      title: "Pulse Media Analytics",
      alt: "Pulse Media Analytics - Plataforma web de métricas y reportes para músicos",
      category: "web",
      tags: ["React", "PHP", "MySQL", "Analytics", "Music", "Reports"],
      description:
        "Plataforma web para músicos que ofrece métricas avanzadas, análisis de audiencia y reportes personalizados.",
      image: PulseMedia,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 5,
      title: "CloudBox – Kit de Diseño Moderno para .NET",
      alt: "CloudBox UI Kit - Sistema de diseño moderno en Figma para aplicaciones .NET",
      category: "design",
      tags: [
        "Figma",
        "UI Kit",
        "Design System",
        "Prototyping",
        ".NET",
        "Modern UI",
        "Dark Mode",
        "UX/UI",
      ],
      description:
        "Kit de diseño moderno en Figma para aplicaciones .NET. Incluye componentes, sistema de diseño y soporte para dark mode.",
      image: CloudBox,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: 6,
      title: "AutoLand Mobile",
      alt: "AutoLand Mobile - Aplicación móvil para concesionarios de autos con gestión de inventario y clientes",
      category: "mobile",
      tags: [
        "Flutter",
        "Dart",
        "SQLite",
        "Firebase",
        "Automotive",
        "Inventory",
        "Mobile App",
      ],
      description:
        "Aplicación móvil para concesionarios de autos que gestiona inventario, reservas de prueba de manejo y clientes.",
      image: Autoland,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-red-500 to-pink-600",
    },
    {
      id: 7,
      title: "BarberZone Platform",
      alt: "BarberZone Platform - Plataforma web para reservas y gestión de clientes en barberías",
      category: "web",
      tags: ["React", "PHP", "MySQL", "Reservas", "Barbería", "Clientes"],
      description:
        "Plataforma web para barberías que permite reservas en línea, control de clientes y gestión de promociones.",
      image: BarberZone,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-red-500 to-pink-600",
    },
    {
      id: 8,
      title: "Black Sector Gore",
      alt: "Black Sector Gore - Sitio web de terror con relatos, videos y juegos interactivos",
      category: "web",
      tags: ["React", "PHP", "MySQL", "Horror", "Gore", "Interactive"],
      description:
        "Sitio web de terror con relatos, videos y minijuegos interactivos para fans del género gore.",
      image: BlackSector,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-red-500 to-pink-600",
    },
    {
      id: 9,
      title: "Landing Page Odontología",
      alt: "Landing Page Odontología - Sitio web para clínica dental con servicios y formulario de contacto",
      category: "web",
      tags: [
        "React",
        "PHP",
        "MySQL",
        "Healthcare",
        "Landing Page",
        "Odontología",
      ],
      description:
        "Landing page para clínica odontológica con secciones de servicios, equipo profesional y formulario de contacto.",
      image: Odontologia,
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      color: "from-red-500 to-pink-600",
    },
  ];

  const filters = [
    { id: "all", label: "Todos", icon: Filter },
    { id: "web", label: "Web", icon: Globe },
    { id: "mobile", label: "Mobile", icon: Smartphone },
    { id: "design", label: "Diseño", icon: Palette },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section
      id="projects"
      className="py-20 bg-gray-900 relative overflow-hidden"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis <span className="gradient-text">Proyectos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Una selección de mis trabajos más destacados que demuestran mis
            habilidades y creatividad
          </p>
        </div>

        {/* Proyectos destacados */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Proyectos Destacados
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group glass rounded-2xl overflow-hidden hover-lift"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.liveUrl}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      aria-label="Ver proyecto"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href={project.githubUrl}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      aria-label="Ver Diseño"
                    >
                      <Figma className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 text-sm rounded-full bg-gradient-to-r ${project.color} text-white`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.liveUrl}
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver proyecto</span>
                    </a>
                    <a
                      href={project.githubUrl}
                      className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <Figma className="w-4 h-4" />
                      <span>Diseño</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "glass text-gray-300 hover:text-white hover:scale-105"
              }`}
            >
              <filter.icon className="w-5 h-5" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Grid de todos los proyectos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group glass rounded-2xl overflow-hidden hover-lift"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.liveUrl}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Ver proyecto"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Ver código"
                  >
                    <Figma className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-2">
                  {project.title}
                </h4>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Te gusta lo que ves?
            </h3>
            <p className="text-gray-300 mb-6">
              Estos son solo algunos ejemplos. Tengo muchos más proyectos y
              siempre estoy trabajando en algo nuevo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/*
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                Ver todos mis proyectos
              </button>*/}
              <a
                href="https://wa.link/qyg94v"
                target="_blank"
                className="glass text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Empezar un proyecto
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
