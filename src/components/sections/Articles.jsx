import React from "react";
import { PenSquare, ExternalLink } from "lucide-react";
import Fantasmas from "./../../assets/images/articles/001-Fantasmas-Visuales-en-tu-UI-Los-Errores-Invisibles-que-Alejan-a-tus-Usuarios-Code-Zero.png";
import PaulRand from "./../../assets/images/articles/002-Lecciones-de-Paul-Rand-para-diseñadores-y-empresarios-Code-Zero.png";
import DocumentarProyectos from "./../../assets/images/articles/003-Estrategias-para-documentar-proyectos-educativos-Code-Zero.png";
import MicroInteracciones from "./../../assets/images/articles/004-Microinteracciones-que-enamoran-code-zero.png";

const articles = [
  {
    id: 1,
    title:
      "Fantasmas Visuales en tu UI: Los Errores Invisibles que Alejan a tus Usuarios",
    summary:
      "El diseño de interfaz (UI) no es solo acomodar elementos en una retícula. Es estrategia, es psicología y — cuando se hace bien — es un camino despejado para el usuario.",
    image: Fantasmas,
    link: "https://medium.com/@codexzero.tech/fantasmas-visuales-en-tu-ui-los-errores-invisibles-que-alejan-a-tus-usuarios-37f532618951",
  },
  {
    id: 2,
    title:
      "El Impacto Duradero del Diseño: Lecciones de Paul Rand que Transforman Negocios",
    summary:
      "El diseño gráfico no es solo estética. Es estrategia, comunicación, identidad y — cuando se hace bien — una ventaja competitiva que puede cambiar la historia de una empresa.",
    image: PaulRand,
    link: "https://medium.com/@codexzero.tech/el-impacto-duradero-del-dise%C3%B1o-lecciones-de-paul-rand-que-transforman-negocios-3c174484c523",
  },
  {
    id: 3,
    title: "Estrategias para documentar proyectos educativos",
    summary:
      "Documentar un proyecto educativo no es solo dejar constancia. Es construir memoria, aprendizaje y mejora continua.",
    image: DocumentarProyectos,
    link: "https://medium.com/@codexzero.tech/estrategias-para-documentar-proyectos-educativos-1de0d0a4bf9e",
  },
  {
    id: 4,
    title: "Microinteracciones que enamoran",
    summary:
      "Hay algo mágico en esos pequeños detalles que nadie nota… hasta que faltan.",
    image: MicroInteracciones,
    link: "https://medium.com/@codexzero.tech/microinteracciones-que-enamoran-45848c4d401c",
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
            Reflexiones, tutoriales y experiencias de UX/UI y desarrollo con
            foco en prácticas accionables.
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
