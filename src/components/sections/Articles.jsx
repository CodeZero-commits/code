import React from "react";
import { PenSquare, ExternalLink } from "lucide-react";
import PulseMedia from "./../../assets/images/design/Pulse-Media-code-zero.jpg";
import RealVictoria from "./../../assets/images/design/Real-Victoria-code-zero.jpg";
import BarberZone from "./../../assets/images/design/Barber-Zone-code-zero.png";
import BlackSector from "./../../assets/images/design/Black-Sector-code-zero.PNG";

const articles = [
  {
    id: 1,
    title: "UX Writing para formularios con fricción",
    summary:
      "Guía práctica para reducir el abandono en formularios usando microcopys claros, validaciones empáticas y patrones accesibles.",
    image: PulseMedia,
    link: "https://medium.com",
  },
  {
    id: 2,
    title: "Design Systems oscuros: coherencia y accesibilidad",
    summary:
      "Cómo construir un sistema de diseño dark mode con tokens, gradientes neon y controles escalables para equipos multidisciplinares.",
    image: BlackSector,
    link: "https://medium.com",
  },
  {
    id: 3,
    title: "Motion design aplicado a dashboards de datos",
    summary:
      "Principios de timing, continuidad y jerarquía visual para crear animaciones que guíen la lectura en paneles complejos.",
    image: RealVictoria,
    link: "https://medium.com",
  },
  {
    id: 4,
    title: "UX Research Express: 5 experimentos rápidos",
    summary:
      "Plantillas de entrevistas, pruebas guerrilla y síntesis ágil para validar ideas de producto en menos de una semana.",
    image: BarberZone,
    link: "https://medium.com",
  },
];

const Articles = () => {
  return (
    <section
      id="articles"
      className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full mb-4 text-pink-200">
            <PenSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">Artículos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contenido <span className="gradient-text">Editorial</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Reflexiones, tutoriales y experiencias de UX/UI y desarrollo con foco en prácticas accionables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="glass rounded-2xl overflow-hidden hover-lift group transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                  <a
                    href={article.link}
                    className="inline-flex items-center gap-2 px-4 py-2 glass text-white text-sm font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Leer en Medium
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

export default Articles;
