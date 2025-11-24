import React from "react";
import { FlaskConical, ExternalLink, Sparkles } from "lucide-react";
import ClinicFlow from "./../../assets/images/design/Clinic-Flow-code-zero.jpg";
import CloudBox from "./../../assets/images/design/CloudBox-code-zero.jpg";
import Zenith from "./../../assets/images/design/Zenith-code-zero.jpg";
import Autoland from "./../../assets/images/design/AutoLand-code-zero.jpg";

const experiments = [
  {
    id: 1,
    title: "Neon Pattern Generator",
    description:
      "Herramienta para crear patrones generativos en tiempo real con controles de color, ruido y exportación SVG.",
    cover: CloudBox,
    link: "#",
    linkLabel: "Ver prototipo",
    status: "En progreso",
  },
  {
    id: 2,
    title: "ClinicFlow AI Console",
    description:
      "Panel experimental para predecir la demanda de citas médicas usando series de tiempo y dashboards interactivos.",
    cover: ClinicFlow,
    link: "#",
    linkLabel: "Demo interactiva",
    status: "Beta",
  },
  {
    id: 3,
    title: "Zenith Motion UI",
    description:
      "Exploración de microinteracciones para secciones hero y cards 3D con animaciones suaves y gestos touch.",
    cover: Zenith,
    link: "#",
    linkLabel: "Ver en Figma",
    status: "Concepto",
  },
  {
    id: 4,
    title: "AutoLand XR",
    description:
      "Experiencia inmersiva para visualizar inventario automotriz en realidad aumentada con catálogos interactivos.",
    cover: Autoland,
    link: "#",
    linkLabel: "Probar demo",
    status: "Lab",
  },
];

const Laboratory = () => {
  return (
    <section
      id="laboratory"
      className="py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full mb-4 text-purple-300">
            <FlaskConical className="w-5 h-5" />
            <span className="text-sm font-semibold">Laboratorio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos <span className="gradient-text">Experimentales</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Espacio dedicado a ideas en progreso, prototipos rápidos y pruebas de concepto con nuevas tecnologías.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiments.map((project) => (
            <div
              key={project.id}
              className="glass rounded-2xl overflow-hidden hover-lift group transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.cover}
                  alt={project.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-gray-900/20 to-transparent"></div>
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs text-purple-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {project.status}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.linkLabel}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Laboratory;
