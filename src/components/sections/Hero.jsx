import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Download,
  Target,
} from "lucide-react";
import ParticlesBackground from "../ui/ParticlesBackground";
import ProfileImg from "./../../assets/images/profile.jpg";
import IsraelGonzálezCV from "./../../assets/pdf/Israel_González_CV.pdf";

const HeroRoles = () => {
  const roles = [
    "Diseñador UX/UI",
    "Desarrollador Web",
    "Desarrollador Frontend",
  ];
  const [text, setText] = useState("");
  const [currentRole, setCurrentRole] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;

    if (typing) {
      // Escribir letra por letra
      const currentText = roles[currentRole];
      if (text.length < currentText.length) {
        timeout = setTimeout(() => {
          setText(currentText.slice(0, text.length + 1));
        }, 100);
      } else {
        // Pausa al terminar de escribir
        timeout = setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    } else {
      // Borrar letra por letra
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 50);
      } else {
        // Cambiar al siguiente rol y empezar a escribir
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, typing, currentRole, roles]);

  return (
    <span className="gradient-text font-semibold">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Hero = () => {
  const scrollToNext = () => {
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
    >
      <ParticlesBackground />

      <div className=" mt-24 mb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          {/* Avatar con efecto glassmorphism */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            <div className="w-full h-full rounded-full glass animate-float overflow-hidden border-4 border-white/20">
              <img
                src={ProfileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 blur-xl"></div>
          </div>

          {/* Saludo animado */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              ¡Hola! Soy{" "}
              <span className="gradient-text animate-gradient">
                Israel González
              </span>
            </h1>

            <div className="text-2xl md:text-4xl text-gray-300 min-h-[1.5em]">
              <HeroRoles />
            </div>
          </div>

          {/* Descripción */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Creo experiencias digitales excepcionales combinando diseño
            intuitivo con desarrollo técnico de vanguardia. Especializado en
            crear interfaces que no solo lucen increíbles, sino que funcionan
            perfectamente.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#projects"
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Ver mis proyectos</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>

            <a
              href={IsraelGonzálezCV}
              download
              className="group glass text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Descargar CV</span>
            </a>
          </div>

          {/* Enlaces sociales */}
          <div className="flex justify-center space-x-6 pt-8">
            {[
              {
                icon: Github,
                href: "https://github.com/CodeZero-commits",
                Target: "_blank",
                label: "GitHub",
              },
              {
                icon: Linkedin,
                href: "https://www.linkedin.com/in/israel-olmec-5939b8323/",
                Target: "_blank",
                label: "LinkedIn",
              },
              { 
                icon: Mail, 
                href: "#contact", 
                Target: "_self", 
                label: "Email",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                target= {social.Target}
                className="group p-3 glass rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300"
              >
                <social.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-white/50 hover:text-white transition-colors" />
      </button>

      {/* Efectos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;
