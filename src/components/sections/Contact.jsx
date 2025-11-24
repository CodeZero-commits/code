import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  Facebook,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "access_key",
        "08dd17a4-2045-4dde-8432-506069211166"
      ); // tu key real

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          budget: "",
          timeline: "",
        });
      } else {
        alert("❌ Error al enviar el formulario. Intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error de conexión. Intenta de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "codexzero.tech@gmail.com",
      description: "Respondo en menos de 24 horas",
      link: "mailto:hola@tudominio.com",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+52 618 476 4306",
      description: "Lunes a Viernes, 9AM - 6PM",
      link: "https://wa.link/qyg94v",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      value: "Ciudad de México, MX",
      description: "Disponible para trabajo remoto",
      link: "#",
    },
    {
      icon: Calendar,
      title: "Calendario",
      value: "Agenda una llamada",
      description: "Reunión virtual de 30 min",
      link: "#",
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

  const budgetOptions = [
    "Menos de $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "Más de $50,000",
  ];

  const timelineOptions = [
    "Lo antes posible",
    "1-2 semanas",
    "1 mes",
    "2-3 meses",
    "Más de 3 meses",
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
            Trabajemos <span className="gradient-text">Juntos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Me encantaría escuchar tu idea y
            ayudarte a hacerla realidad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulario de contacto */}
          <div className="order-2 lg:order-1">
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Cuéntame sobre tu proyecto
              </h3>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Asunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="¿En qué te puedo ayudar?"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Presupuesto estimado
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Selecciona un rango</option>
                        {budgetOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="timeline"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Timeline deseado
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">¿Cuándo necesitas el proyecto?</option>
                        {timelineOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Cuéntame más detalles sobre tu proyecto, objetivos, características específicas que necesitas, etc."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-gray-300">
                    Gracias por contactarme. Te responderé lo antes posible.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Otras formas de contacto
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {info.title}
                      </h4>
                      <p className="text-purple-400 font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Redes sociales */}
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Sígueme</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`p-3 bg-gray-800/50 rounded-lg hover:scale-110 transition-all duration-200 text-gray-400 ${social.color}`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Estado de disponibilidad */}
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">
                  Disponible para proyectos
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Actualmente tengo disponibilidad para nuevos proyectos. Mi
                tiempo de respuesta promedio es de 2-4 horas en días laborales.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ rápido */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Preguntas frecuentes
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">
                ¿Cuál es tu proceso de trabajo?
              </h4>
              <p className="text-gray-300 text-sm">
                Inicio con una consulta detallada, seguida de investigación,
                wireframes, diseño, desarrollo y testing.
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">
                ¿Ofreces mantenimiento?
              </h4>
              <p className="text-gray-300 text-sm">
                Sí, ofrezco planes de mantenimiento y soporte continuo para
                todos mis proyectos.
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-2">
                ¿Trabajas con equipos?
              </h4>
              <p className="text-gray-300 text-sm">
                Por supuesto, tengo experiencia colaborando con equipos de
                desarrollo y diseño.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
