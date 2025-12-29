import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Calendar,
  MessageCircle, // Nuevo icono para WhatsApp/Mensajería
} from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "codexzero.tech@gmail.com",
      description: "Respondo en menos de 24 horas",
      link: "mailto:codexzero.tech@gmail.com",
      btnText: "Enviar correo",
    },
    {
      icon: MessageCircle, // Usando MessageCircle para WhatsApp o similar
      title: "WhatsApp",
      value: "+52 618 448 0821",
      description: "Lunes a Viernes, 9AM - 6PM",
      link: "https://wa.link/qyg94v",
      btnText: "Enviar mensaje",
    },
    {
      icon: Calendar,
      title: "Calendario",
      value: "Agenda una llamada",
      description: "Reunión virtual de 30 min",
      link: "#", // Aquí iría tu link de Calendly o similar
      btnText: "Agendar ahora",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/CodeZero-commits",
      label: "GitHub",
      color: "hover:text-gray-300",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/code-zero-5939b8323/",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: "https://x.com/ZeroCode48056",
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
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hablemos de tu <span className="gradient-text">Proyecto</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ¿Listo para empezar? Elige el canal que prefieras y ponte en
            contacto conmigo directamente.
          </p>
        </div>

        {/* Grid principal de tarjetas de contacto */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 border border-gray-700/50 hover:border-purple-500/50"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-900/20">
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {info.title}
              </h3>
              <p className="text-gray-400 text-sm mb-1">{info.description}</p>
              <p className="text-white font-medium mb-6">{info.value}</p>

              <a
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-colors border border-white/10"
              >
                {info.btnText}
              </a>
            </div>
          ))}
        </div>

        {/* Sección inferior: Ubicación y Redes Sociales */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Tarjeta de Ubicación / Disponibilidad */}
          <div className="glass p-8 rounded-2xl flex items-center space-x-6 border border-gray-700/50">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Ubicación</h3>
              <p className="text-gray-300">Ciudad de México, MX</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  Disponible para trabajo remoto
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Redes Sociales */}
          <div className="glass p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-gray-700/50">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-lg font-bold text-white">Sígueme</h3>
              <p className="text-gray-400 text-sm">Conecta en redes sociales</p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-3 bg-gray-800/50 rounded-lg hover:scale-110 transition-all duration-200 text-gray-400 ${social.color} border border-gray-700`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
