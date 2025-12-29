import React, { useState } from "react";
import { Palette, Code, Settings, Check, MessageCircle } from "lucide-react";

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState("web");

  // Definición de las categorías y sus servicios con PRECIOS ACTUALIZADOS Y REALISTAS
  const pricingData = {
    web: {
      id: "web",
      label: "Desarrollo Web",
      icon: Code,
      services: [
        {
          id: 4,
          title: "Landing Page Profesional",
          price: "Desde $5,500 MXN",
          features: [
            "Diseño único (No plantillas)",
            "Optimización SEO básica",
            "Formulario de contacto",
            "Diseño Responsive (Móvil)",
            "Carga ultra rápida",
          ],
          description:
            "Ideal para captar leads o presentar un producto. Desarrollo optimizado para conversión.",
          whatsappText:
            "Hola, me interesa cotizar una Landing Page Profesional.",
        },
        {
          id: 5,
          title: "Sitio Web Corporativo",
          price: "Desde $12,000 MXN",
          features: [
            "Hasta 5 secciones internas",
            "Blog autoadministrable",
            "Integración con Google Maps",
            "Enlaces a redes sociales",
            "Certificado SSL incluido",
          ],
          description:
            "Sitio web completo para empresas que buscan establecer una presencia digital sólida.",
          whatsappText: "Hola, me interesa cotizar un Sitio Web Corporativo.",
        },
        {
          id: 6,
          title: "Web App / Sistema a Medida",
          price: "Desde $25,000 MXN",
          features: [
            "Desarrollo en React / Next.js",
            "Base de datos y API",
            "Panel de administración",
            "Autenticación de usuarios",
            "Lógica de negocio compleja",
          ],
          description:
            "Soluciones personalizadas como dashboards, CRMs o plataformas SaaS.",
          whatsappText:
            "Hola, me interesa cotizar una Web App o Sistema a Medida.",
        },
      ],
    },
    uxui: {
      id: "uxui",
      label: "Diseño UX/UI",
      icon: Palette,
      services: [
        {
          id: 1,
          title: "Diseño Landing Page",
          price: "$4,500 MXN",
          features: [
            "Investigación de usuarios",
            "Wireframes de baja fidelidad",
            "Diseño visual en Figma",
            "Prototipo interactivo básico",
            "Entrega de assets para dev",
          ],
          description:
            "Diseño visual de alto impacto enfocado en conversión (Solo diseño, sin código).",
          whatsappText:
            "Hola, me interesa contratar el servicio de Diseño UX/UI para Landing Page.",
        },
        {
          id: 2,
          title: "Diseño App Móvil",
          price: "Desde $15,000 MXN",
          features: [
            "Diseño de hasta 10 pantallas",
            "Sistema de diseño (UI Kit)",
            "Prototipo navegable",
            "Adaptación iOS y Android",
            "Pruebas de usabilidad básicas",
          ],
          description:
            "Diseño de interfaces modernas y funcionales para aplicaciones nativas.",
          whatsappText:
            "Hola, me interesa contratar el servicio de Diseño UX/UI para App Móvil.",
        },
        {
          id: 3,
          title: "Diseño Dashboard SaaS",
          price: "Desde $18,000 MXN",
          features: [
            "Arquitectura de información",
            "Diseño de componentes complejos",
            "Visualización de datos",
            "Modo oscuro / claro",
            "Documentación de diseño",
          ],
          description:
            "Diseño especializado para paneles administrativos y herramientas de software.",
          whatsappText:
            "Hola, me interesa contratar el servicio de Diseño UX/UI para Dashboard/SaaS.",
        },
      ],
    },
    maintenance: {
      id: "maintenance",
      label: "Mantenimiento & Auto",
      icon: Settings,
      services: [
        {
          id: 7,
          title: "Soporte Mensual",
          price: "$2,500 MXN / mes",
          features: [
            "Monitoreo 24/7",
            "Backups semanales",
            "Actualización de plugins/core",
            "Corrección de bugs menores",
            "Reporte mensual de estado",
          ],
          description:
            "Tranquilidad total para tu negocio. Asegura que tu sitio siempre esté en línea.",
          whatsappText:
            "Hola, me interesa contratar el servicio de Soporte y Mantenimiento Mensual.",
        },
        {
          id: 9,
          title: "Automatización de Procesos",
          price: "Desde $3,500 MXN",
          features: [
            "Integración con n8n / Zapier",
            "Conexión de CRM y Email",
            "Notificaciones automáticas",
            "Ahorro de horas manuales",
            "Documentación del flujo",
          ],
          description:
            "Automatiza tareas repetitivas conectando tus herramientas digitales.",
          whatsappText:
            "Hola, me interesa contratar servicios de Automatización de Procesos.",
        },
        {
          id: 8,
          title: "Consultoría Técnica",
          price: "$1,200 MXN / hora",
          features: [
            "Revisión de código",
            "Arquitectura de software",
            "Asesoría en UX/UI",
            "Elección de stack tecnológico",
            "Mentoria personalizada",
          ],
          description:
            "Asesoría experta para resolver dudas específicas o planificar tu proyecto.",
          whatsappText:
            "Hola, me interesa agendar una hora de Consultoría Técnica.",
        },
      ],
    },
  };

  const categories = Object.values(pricingData).map(({ id, label, icon }) => ({
    id,
    label,
    icon,
  }));
  const currentServices = pricingData[activeCategory].services;

  return (
    <section
      id="precios"
      className="py-20 bg-gray-900 relative overflow-hidden"
    >
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-gray-800/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Inversión Transparente
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu proyecto.
            Sin costos ocultos.
          </p>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-105 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid de Tarjetas de Precios */}
        <div className="grid md:grid-cols-3 gap-8">
          {currentServices.map((service, index) => (
            <div
              key={service.id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 flex flex-col hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <div className="text-3xl font-extrabold text-white mb-4">
                  {service.price}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-12">
                  {service.description}
                </p>

                {/* Lista de características */}
                <ul className="space-y-3 mb-8">
                  {service.features &&
                    service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm text-gray-300"
                      >
                        <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-auto">
                <a
                  href={`https://wa.link/qyg94v?text=${encodeURIComponent(
                    service.whatsappText
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Cotizar ahora</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">
            * Los precios son estimaciones base y pueden variar según la
            complejidad y alcance específico de cada proyecto.
            <br />
            Precios en Pesos Mexicanos (MXN) + IVA si requieres factura.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
