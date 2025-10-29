import React from "react";
import { ExternalLink, Beaker } from "lucide-react";

const codepenProjects = [
  {
    id: 1,
    title: "Neon Microinteractions Lab",
    description:
      "Exploración de microinteracciones y glassmorphism usando solo CSS y un toque de JavaScript para detonar animaciones contextuales.",
    focus: "Experimento UI",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    penUrl: "https://codepen.io/israelgonzalez/pen/neon-microinteractions",
  },
  {
    id: 2,
    title: "Responsive Layout Playground",
    description:
      "Sistema de cuadrículas fluidas creado para enseñar principios de diseño responsivo y layout adaptativo en proyectos reales.",
    focus: "Educativo",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    penUrl: "https://codepen.io/israelgonzalez/pen/layout-playground",
  },
  {
    id: 3,
    title: "Dark Mode Dashboard Kit",
    description:
      "Concepto experimental para panel de analíticas con componentes modulares y variables CSS para teming claro/oscuro instantáneo.",
    focus: "Concepto",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    penUrl: "https://codepen.io/israelgonzalez/pen/dashboard-kit",
  },
  {
    id: 4,
    title: "Motion Typography Stories",
    description:
      "Colección de historias animadas basadas en tipografía cinética, ideal para experimentar con timelines en CSS y GSAP.",
    focus: "Inspiración",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    penUrl: "https://codepen.io/israelgonzalez/pen/motion-typography",
  },
];

const CodePenProjects = () => {
  return (
    <section
      id="codepen-projects"
      className="relative py-20 bg-gray-900 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm font-medium text-purple-200 uppercase tracking-widest">
            <Beaker className="w-4 h-4" />
            Laboratorio creativo
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Proyectos <span className="gradient-text">CodePen</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Una colección de experimentos, conceptos UI y pequeños descubrimientos técnicos. No son proyectos comerciales, sino espacios donde documento mi proceso creativo para que otros desarrolladores aprendan o encuentren inspiración.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {codepenProjects.map((project, index) => (
            <article
              key={project.id}
              className="group glass rounded-2xl overflow-hidden flex flex-col hover-lift"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-200 backdrop-blur">
                  {project.focus}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300 flex-1">
                  {project.description}
                </p>
                <div className="mt-6">
                  <a
                    href={project.penUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver en CodePen
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

export default CodePenProjects;
