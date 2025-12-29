import React from "react";
import { User, Heart, Coffee, Code2, Palette, Rocket } from "lucide-react";

const About = () => {
  const stats = [
    { number: "3+", label: "Años de experiencia", icon: User },
    { number: "50+", label: "Proyectos completados", icon: Rocket },
    { number: "1000+", label: "Tazas de café", icon: Coffee },
    { number: "∞", label: "Pasión por el diseño", icon: Heart },
  ];

  const interests = [
    { icon: Code2, title: "Desarrollo", desc: "React, Node.js, TypeScript" },
    { icon: Palette, title: "Diseño", desc: "Figma, Adobe XD, Sketch" },
    {
      icon: Rocket,
      title: "Innovación",
      desc: "Nuevas tecnologías y tendencias",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sobre <span className="gradient-text">Mí</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conoce más sobre mi trayectoria, pasiones y lo que me motiva cada
            día
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-top">
          {/* Texto principal */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-2xl hover-lift">
              <h3 className="text-2xl font-bold text-white mb-4">
                Mi Historia
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Soy un apasionado diseñador UX/UI y desarrollador web con más de
                3 años de experiencia creando experiencias digitales que
                combinan funcionalidad y estética excepcional.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Mi enfoque único radica en entender profundamente las
                necesidades del usuario y transformarlas en soluciones digitales
                innovadoras que no solo cumplan, sino que superen las
                expectativas.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Cuando no estoy diseñando o programando, me encontrarás
                explorando nuevas tecnologías, tomando fotografías o disfrutando
                de una buena taza de café mientras planeo el próximo proyecto
                revolucionario.
              </p>
            </div>
          </div>
          {/* Estadísticas */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 ">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-xl hover-lift text-center group"
                >
                  <stat.icon className="w-8 h-8 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
