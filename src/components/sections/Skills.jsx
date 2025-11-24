import React, { useState, useEffect } from "react";
import { Code, Palette, Smartphone, Database, Globe, Zap } from "lucide-react";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [animatedBars, setAnimatedBars] = useState({});

  const skillCategories = {
    frontend: {
      icon: Code,
      title: "Frontend",
      color: "from-blue-500 to-purple-600",
      skills: [
        { name: "React", level: 95, color: "bg-blue-500" },
        { name: "TypeScript", level: 90, color: "bg-blue-600" },
        { name: "Tailwind CSS", level: 92, color: "bg-cyan-500" },
        { name: "Next.js", level: 88, color: "bg-gray-800" },
        { name: "Vue.js", level: 85, color: "bg-green-500" },
        { name: "JavaScript", level: 93, color: "bg-yellow-500" },
      ],
    },
    design: {
      icon: Palette,
      title: "Diseño UX/UI",
      color: "from-pink-500 to-purple-600",
      skills: [
        { name: "Figma", level: 95, color: "bg-purple-500" },
        { name: "Adobe XD", level: 88, color: "bg-pink-500" },
        { name: "Prototyping", level: 92, color: "bg-indigo-500" },
        { name: "User Research", level: 85, color: "bg-blue-500" },
        { name: "Wireframing", level: 90, color: "bg-gray-500" },
        { name: "Design Systems", level: 88, color: "bg-green-500" },
      ],
    },
    backend: {
      icon: Database,
      title: "Backend & Tools",
      color: "from-green-500 to-blue-600",
      skills: [
        { name: "Node.js", level: 82, color: "bg-green-500" },
        { name: "Express", level: 80, color: "bg-gray-700" },
        { name: "MongoDB", level: 75, color: "bg-green-600" },
        { name: "Git", level: 90, color: "bg-orange-500" },
        { name: "Docker", level: 70, color: "bg-blue-500" },
        { name: "AWS", level: 65, color: "bg-yellow-600" },
      ],
    },
    mobile: {
      icon: Smartphone,
      title: "Mobile & Otros",
      color: "from-orange-500 to-red-600",
      skills: [
        { name: "React Native", level: 78, color: "bg-blue-600" },
        { name: "Flutter", level: 70, color: "bg-blue-400" },
        { name: "Progressive PWA", level: 85, color: "bg-purple-500" },
        { name: "SEO", level: 80, color: "bg-green-600" },
        { name: "Analytics", level: 75, color: "bg-red-500" },
        { name: "Performance", level: 88, color: "bg-yellow-500" },
      ],
    },
  };

  const tools = [
    { name: "VS Code", icon: "💻" },
    { name: "Figma", icon: "🎨" },
    { name: "Git", icon: "📚" },
    { name: "Slack", icon: "💬" },
    { name: "Notion", icon: "📝" },
    { name: "Docker", icon: "🐳" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedBars = {};
      skillCategories[activeCategory].skills.forEach((skill, index) => {
        setTimeout(() => {
          setAnimatedBars((prev) => ({ ...prev, [skill.name]: true }));
        }, index * 100);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis <span className="gradient-text">Habilidades</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tecnologías y herramientas que domino para crear experiencias
            excepcionales
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Categorías de habilidades */}
          <div className="lg:col-span-2">
            {/* Navegación de categorías */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {Object.entries(skillCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    activeCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-110`
                      : "glass text-gray-300 hover:text-white"
                  }`}
                >
                  <category.icon className="w-6 h-6" />
                </button>
              ))}
            </div>

            {/* Skills activos */}
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                {skillCategories[activeCategory].title}
              </h3>
              <div className="space-y-6">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          skill.color
                        } rounded-full transition-all duration-1000 ease-out ${
                          animatedBars[skill.name] ? "" : "w-0"
                        }`}
                        style={{
                          width: animatedBars[skill.name]
                            ? `${skill.level}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Herramientas favoritas */}
            <div className="glass p-6 rounded-2xl hover-lift">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">
                  Herramientas Favoritas
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-gray-300 text-sm">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificaciones */}
            <div className="glass p-6 rounded-2xl hover-lift">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">
                  Certificaciones
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-white font-medium">React Developer</div>
                  <div className="text-gray-400 text-sm">Meta - 2024</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-white font-medium">
                    UX Design Professional
                  </div>
                  <div className="text-gray-400 text-sm">Google - 2023</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-white font-medium">
                    AWS Cloud Practitioner
                  </div>
                  <div className="text-gray-400 text-sm">Amazon - 2023</div>
                </div>
              </div>
            </div>

            {/* Experiencia resumida */}
            <div className="glass p-6 rounded-2xl hover-lift text-center">
              <div className="text-4xl font-bold gradient-text mb-2">3+</div>
              <div className="text-gray-300 text-sm">Años de experiencia</div>
              <div className="text-4xl font-bold gradient-text mb-2 mt-4">
                50+
              </div>
              <div className="text-gray-300 text-sm">Proyectos completados</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para trabajar juntos?
            </h3>
            <p className="text-gray-300 mb-6">
              Combinemos estas habilidades para crear algo extraordinario
            </p>
            <a
              href="https://wa.link/qyg94v"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Hablemos de tu proyecto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
