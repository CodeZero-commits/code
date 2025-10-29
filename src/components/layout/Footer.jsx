import React from "react";
import {
  Heart,
  Code,
  Palette,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUp,
  Facebook,
} from "lucide-react";
import LogoCodeZero from "./../../assets/images/LogoCodeZero.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Inicio", href: "#hero" },
    { name: "Sobre mí", href: "#about" },
    { name: "Habilidades", href: "#skills" },
    { name: "Proyectos", href: "#projects" },
    { name: "Experiencia", href: "#experience" },
    { name: "Contacto", href: "#contact" },
  ];

  const services = [
    "Diseño UX/UI",
    "Desarrollo Frontend",
    "Desarrollo React",
    "Design Systems",
    "Prototipado",
    "Consultoría UX",
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/CodeZero-commits",
      target: "_blank",
      label: "GitHub",
      color: "hover:text-gray-300",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/code-zero-5939b8323/",
      target: "_blank",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: "https://x.com/ZeroCode48056",
      target: "_blank",
      label: "Twitter",
      color: "hover:text-blue-300",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/codezero.dev",
      label: "Facebook",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className="bg-black border-t border-gray-800 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Contenido principal del footer */}
        <div className="py-12 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <img src={LogoCodeZero} alt="Logo Code Zero" className="w-12" />
              </div>
              <span className="text-xl font-bold text-white">Code Zero</span>
            </div>
            <p className="text-gray-400 text-sm">
              UX/UI Designer & Frontend Developer. Construyo experiencias
              digitales intuitivas y visualmente atractivas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-gray-400">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Redes</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${color} transition`}
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll to top */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-4">
          &copy; Actualizado {currentYear} Hecho con{" "}
          <Heart className="inline w-4 h-4 text-red-500 mx-1" /> por Code Zero.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
