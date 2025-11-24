import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";

import LogoCodeZero from "../../assets/icons/Logo-Code-Zero.jpg";
import Platzi from "../../assets/icons/Logo-Platzi.png";
import Xylitech from "../../assets/icons/Logo-xylitech.png";
import PluriOne from "../../assets/icons/Logo-PluriOne.png";
import Upc from "../../assets/icons/Logo-Upc.png";
import Itd from "../../assets/icons/Logo-Itd.png";
import Google from "../../assets/icons/Logo-Google.png";
import Meta from "../../assets/icons/Logo-Meta.png";
import IsraelGonzálezCV from "./../../assets/pdf/Israel_González_CV.pdf";

const Experience = () => {
  const [activeTab, setActiveTab] = useState("work");

  const workExperience = [
    {
      id: 1,
      company: "Freelancer",
      position: "Community Manager / Desarrollador Full Stack / UX/UI Designer",
      period: "Oct 2024 – Actual",
      location: "Remoto / Diversas ubicaciones",
      description:
        "Trabajo independiente en proyectos diversos para clientes, abarcando desarrollo web, aplicaciones móviles y de escritorio, diseño UX/UI y gestión de comunidades en redes sociales.",
      achievements: [
        "Coordinación de proyectos desde el diseño hasta la implementación",
        "Creación, publicación y optimización de contenido digital",
        "Mejora de la experiencia de usuario y análisis de métricas",
      ],
      technologies: [
        "React",
        "Flutter",
        "Dart",
        "Figma",
        "Node.js",
        "PHP",
        "MySQL",
      ],
      companyLogo: LogoCodeZero,
      companyUrl: "#",
    },
    {
      id: 2,
      company: "Xylitech",
      position: "Community Manager (Freelance)",
      period: "Sep 2024 – Oct 2024 (1 mes)",
      location: "Chiapas, MX",
      description:
        "Colaboración por proyecto en gestión de redes sociales, interacción con la audiencia y campañas de marketing digital.",
      achievements: [
        "Optimización de contenido y análisis de métricas para aumentar engagement",
      ],
      technologies: [
        "Facebook Ads",
        "Instagram Ads",
        "Google Ads",
        "Redes Sociales",
      ],
      companyLogo: Xylitech,
      companyUrl: "https://www.linkedin.com/company/xylitech/",
    },

    {
      id: 3,
      company: "Plurione",
      position: "UI Designer / Front-end Developer (Freelance)",
      period: "Nov 2022 – Jul 2023 (9 meses)",
      location: "Remoto, CDMX",
      description:
        "Colaboración en proyectos diversos de diseño de interfaces y desarrollo front-end.",
      achievements: [
        "Mejora de la experiencia de usuario (UX) y optimización de flujos de interacción",
      ],
      technologies: ["Figma", "Adobe XD", "React", "HTML", "CSS", "JavaScript"],
      companyLogo: PluriOne,
      companyUrl: "https://www.plurione.com.mx/",
    },
    {
      id: 5,
      company: "Universidad Politécnica de Cuencamé",
      position: "Front-end / Back-end Developer",
      period: "Sep 2021 – Nov 2021 (3 meses)",
      location: "Cuencamé, Durango, MX",
      description:
        "Desarrollo de sistema de captura de datos del alumnado para su posterior uso en un sistema de identificación mediante código QR.",
      achievements: [
        "Implementación con HTML5, CSS3, JavaScript, PHP y MySQL",
        "Aplicación del patrón MVC y librerías PHPMailer y PHP QR Code",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      companyLogo: Upc,
      companyUrl: "https://www.upcuencame.edu.mx/portal/",
    },
  ];

  const education = [
    {
      id: 1,
      institution: "Universidad Politécnica de Cuencamé",
      degree: "Ingeniería en Tecnologías de la Información",
      period: "Concluida",
      location: "Durango, MX",
      description:
        "Especialización en desarrollo de software y diseño de interfaces.",
      achievements: [],
      logo: Upc,
    },
    {
      id: 2,
      institution: "Instituto Tecnológico de Durango",
      degree: "Licenciatura en Administración de Empresas (Trunca)",
      period: "3 años cursados",
      location: "Durango, MX",
      description: "Formación en gestión administrativa y negocios.",
      achievements: [],
      logo: Itd,
    },
    {
      id: 3,
      institution: "Platzi",
      degree: "Diseño de Producto / UX/UI Designer",
      period: "Online",
      location: "Online",
      description:
        "Educación continua en diseño de interfaces, experiencia de usuario y desarrollo front-end.",
      achievements: [],
      logo: Platzi,
    },
  ];

  const certifications = [
    {
      id: 1,
      name: "Meta React Developer Professional Certificate",
      issuer: "Meta",
      date: "2024",
      credentialUrl: "#",
      logo: Meta,
    },
    {
      id: 2,
      name: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "2023",
      credentialUrl: "#",
      logo: Google,
    },
  ];

  const tabs = [
    { id: "work", label: "Experiencia", icon: Briefcase },
    { id: "education", label: "Educación", icon: GraduationCap },
    { id: "certifications", label: "Certificaciones", icon: Award },
  ];

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mi <span className="gradient-text">Trayectoria</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Un recorrido por mi crecimiento profesional y académico
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="glass p-2 rounded-full">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "work" && (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="space-y-12">
                {workExperience.map((job) => (
                  <div
                    key={job.id}
                    className="relative flex items-start space-x-8"
                  >
                    <div className="flex-1 glass p-8 rounded-2xl hover-lift">
                      {/* HEADER MODIFICADO */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {job.position}
                          </h3>

                          {/* TECNOLOGÍAS AQUÍ */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {job.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-gray-300">
                            <a
                              href={job.companyUrl}
                              className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                            >
                              <span className="font-semibold">
                                {job.company}
                              </span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-col lg:items-end text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{job.period}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{job.description}</p>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3">
                          Logros destacados:
                        </h4>
                        <ul className="space-y-2">
                          {job.achievements.map((ach, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-300">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "education" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {education.map((edu) => (
                <div key={edu.id} className="glass p-8 rounded-2xl hover-lift">
                  <div className="flex items-start space-x-6">
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {edu.degree}
                          </h3>
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">
                            {edu.institution}
                          </h4>
                        </div>

                        <div className="flex flex-col lg:items-end text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{edu.period}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{edu.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="glass p-6 rounded-2xl hover-lift group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">
                          {cert.date}
                        </span>
                        <a
                          href={cert.credentialUrl}
                          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                        >
                          <span>Ver credencial</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="glass p-6 rounded-xl text-center hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">3+</div>
            <div className="text-gray-300 text-sm">Años de experiencia</div>
          </div>
          <div className="glass p-6 rounded-xl text-center hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">50+</div>
            <div className="text-gray-300 text-sm">Proyectos completados</div>
          </div>
          <div className="glass p-6 rounded-xl text-center hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">15+</div>
            <div className="text-gray-300 text-sm">Tecnologías dominadas</div>
          </div>
          <div className="glass p-6 rounded-xl text-center hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">8+</div>
            <div className="text-gray-300 text-sm">Certificaciones</div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Quieres saber más sobre mi experiencia?
            </h3>
            <p className="text-gray-300 mb-6">
              Descarga mi CV completo o conectemos para hablar sobre
              oportunidades de colaboración.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={IsraelGonzálezCV}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Descargar CV</span>
              </a>
              <a
                href="https://wa.link/qyg94v"
                className="glass text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
