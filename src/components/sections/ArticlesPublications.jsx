import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import Codepen001 from "./../../assets/images/AtomicDesign-Code-Zero.png";
import Codepen002 from "./../../assets/images/Microinteracciones-que-enamoran-code-zero.png";
import Codepen003 from "./../../assets/images/Estrategias-para-documentar-proyectos-educativos-Code-Zero.png";

const articles = [
  {
    id: 1,
    title: "Entender Atomic Design cambió mi vida",
    description:
      "Este artículo explora cómo la metodología Atomic Design, creada por Brad Frost, transformó por completo mi forma de diseñar interfaces.",
    image: Codepen001,
    url: "https://medium.com/@codexzero.tech/entender-atomic-design-cambió-mi-vida-b62df1a807db",
  },
  {
    id: 2,
    title: "Microinteracciones que enamoran",
    description:
      "En este artículo exploro cómo las microinteracciones —esos pequeños detalles que muchos pasan por alto— pueden marcar la diferencia entre una interfaz funcional y una experiencia memorable.",
    image: Codepen002,
    url: "https://dev.to/israelgonzalez/microinteracciones-que-enamoran",
  },
  {
    id: 3,
    title: "Estrategias para documentar proyectos educativos",
    description:
      "Buenas prácticas que sigo para convertir experimentos en recursos de aprendizaje reutilizables para la comunidad.",
    image: Codepen003,
    url: "https://medium.com/@codexzero.tech/estrategias-para-documentar-proyectos-educativos-1de0d0a4bf9e",
  },
];

const ArticlesPublications = () => {
  return (
    <section
      id="articles"
      className="relative py-20 bg-gray-950 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm font-medium text-pink-200 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            Contenido destacado
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Artículos y <span className="gradient-text">Publicaciones</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Documentos y reflexiones donde comparto aprendizajes, procesos y
            metodologías que nacen de mis proyectos experimentales.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="group glass rounded-2xl overflow-hidden flex flex-col hover-lift"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-300 flex-1">
                  {article.description}
                </p>
                <div className="mt-6">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Leer artículo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesPublications;
