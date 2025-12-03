import React, { useState } from "react";
import {
  Palette,
  Code,
  Settings,
  Check,
  MessageCircle
} from "lucide-react";

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState("uxui");

  // Definición de las categorías y sus servicios
  const pricingData = {
    uxui: {
      id: "uxui",
      label: "Diseño UX/UI",
      icon: Palette,
      services: [
        {
          id: 1,
          title: "Landing Page UX/UI",
          price: "$4,500 MXN",
          description: "Diseño de alto impacto enfocado en conversión. Incluye investigación básica, wireframes y prototipo en Figma.",
          whatsappText: "Hola, me interesa contratar el servicio de Diseño UX/UI para Landing Page."
        },
        {
          id: 2,
          title: "App Móvil UX/UI",
          price: "Desde $8,500 MXN",
          description: "Diseño de interfaces para aplicaciones iOS o Android. Enfoque en usabilidad y guías de estilo modernas.",
          whatsappText: "Hola, me interesa contratar el servicio de Diseño UX/UI para App Móvil."
        },
        {
          id: 3,
          title: "Dashboard / SaaS UX/UI",
          price: "Desde $9,500 MXN",
          description: "Diseño complejo para paneles administrativos o SaaS. Jerarquía visual clara y componentes reutilizables.",
          whatsappText: "Hola, me interesa contratar el servicio de Diseño UX/UI para Dashboard/SaaS."
        }
      ]
    },
    web: {
      id: "web",
      label: "Desarrollo Web",
      icon: Code,
      services: [
        {
          id: 4,
          title: "Landing Page Desarrollo",
          price: "$6,000 MXN",
          description: "Desarrollo frontend rápido y optimizado. SEO básico, responsive design y animaciones suaves.",
          whatsappText: "Hola, me interesa contratar el servicio de Desarrollo de Landing Page."
        },
        {
          id: 5,
          title: "Sitio Corporativo",
          price: "$9,000 MXN",
          description: "Sitio web de 3 a 5 secciones (Inicio, Nosotros, Servicios, etc.). Panel autoadministrable opcional.",
          whatsappText: "Hola, me interesa contratar el servicio de Desarrollo de Sitio Corporativo."
        },
        {
          id: 6,
          title: "Web App / Sistema Personalizado",
          price: "Desde $12,500 MXN",
          description: "Soluciones a la medida con React, Node o PHP. Bases de datos, autenticación y lógica de negocio compleja.",
          whatsappText: "Hola, me interesa cotizar una Web App o Sistema Personalizado."
        }
      ]
    },
    maintenance: {
      id: "maintenance",
      label: "Mantenimiento e Integraciones",
      icon: Settings,
      services: [
        {
          id: 7,
          title: "Mantenimiento Mensual",
          price: "$1,200 MXN / mes",
          description: "Actualizaciones de seguridad, backups, corrección de bugs menores y monitoreo de rendimiento.",
          whatsappText: "Hola, me interesa contratar el servicio de Mantenimiento Mensual."
        },
        {
          id: 8,
          title: "Integración con APIs",
          price: "Desde $1,800 MXN",
          description: "Conexión con servicios externos como Stripe, WhatsApp, Notion, Google Maps, etc.",
          whatsappText: "Hola, me interesa contratar el servicio de Integración con APIs."
        },
        {
          id: 9,
          title: "Automatización (n8n / Zapier)",
          price: "Desde $2,500 MXN",
          description: "Automatización de flujos de trabajo para ahorrar tiempo. Conexión entre CRMs, correos y bases de datos.",
          whatsappText: "Hola, me interesa contratar servicios de Automatización con n8n/Zapier."
        }
      ]
    }
  };

  const categories = Object.values(pricingData).map(({ id, label, icon }) => ({ id, label, icon }));
  const currentServices = pricingData[activeCategory].services;

  return (
    <section id="precios" className="py-20 bg-gray-900 relative overflow-hidden">
       {/* Efectos de fondo similares a Projects */}
       <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Precios y <span className="gradient-text">Planes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Soluciones transparentes y escalables para cada etapa de tu proyecto.
          </p>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "glass text-gray-300 hover:text-white hover:scale-105"
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
              className="glass p-8 rounded-2xl flex flex-col hover-lift border border-white/5 hover:border-purple-500/30 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <div className="text-3xl font-bold text-purple-400 mb-4">{service.price}</div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto">
                <a
                  href={`https://wa.me/5211234567890?text=${encodeURIComponent(service.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Contratar</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
                * Precios sujetos a cambios según requerimientos específicos. Los precios no incluyen IVA.
            </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
