import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LogoCodeZero from "./../../assets/images/LogoCodeZero.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Chequear usuario en localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", href: "#hero" },
    { name: "Sobre mí", href: "#about" },
    { name: "Habilidades", href: "#skills" },
    { name: "Proyectos", href: "#projects" },
    { name: "Experiencia", href: "#experience" },
    { name: "Contacto", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img src={LogoCodeZero} alt="Logo Code Zero" className="w-12" />
          </div>
          <span className="text-2xl font-bold gradient-text">Code Zero</span>
        </div>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}

          {/*!user ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Dashboard
            </button>
          )*/}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (animado) */}
      <div
        className={`md:hidden bg-gray-900 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}

          {/*!user ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200"
            >
              Dashboard
            </button>
          )*/}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
