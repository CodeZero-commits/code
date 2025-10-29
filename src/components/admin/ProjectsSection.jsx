// components/ProjectsSection.jsx
import { Palette, Code, Share2, Briefcase } from "lucide-react";

function ProjectsSection() {
  const serviceTemplates = {
    uxui: [
      {
        title: "Manual de Identidad Completo",
        description: "Logo, tipografía, colores, aplicaciones",
        duration: "15-20 días",
        price: "$15,000 - $25,000",
      },
      {
        title: "Diseño de App/Web",
        description: "UX Research, wireframes, diseño UI",
        duration: "20-30 días",
        price: "$20,000 - $40,000",
      },
      {
        title: "Rediseño de Marca",
        description: "Actualización de identidad existente",
        duration: "10-15 días",
        price: "$8,000 - $15,000",
      },
    ],
    programming: [
      {
        title: "Sitio Web Corporativo",
        description: "Landing, sobre nosotros, contacto, blog",
        duration: "15-25 días",
        price: "$12,000 - $20,000",
      },
      {
        title: "E-commerce",
        description: "Catálogo, carrito, pagos, admin",
        duration: "30-45 días",
        price: "$25,000 - $50,000",
      },
      {
        title: "Aplicación Web",
        description: "Sistema personalizado, dashboard",
        duration: "45-60 días",
        price: "$40,000 - $80,000",
      },
    ],
    social: [
      {
        title: "Estrategia Completa",
        description: "Análisis, contenido, calendario, métricas",
        duration: "20-30 días",
        price: "$8,000 - $15,000",
      },
      {
        title: "Gestión Mensual",
        description: "Contenido, publicaciones, community mgmt",
        duration: "Mensual",
        price: "$5,000 - $10,000",
      },
      {
        title: "Campaña Publicitaria",
        description: "Ads Facebook/Instagram, optimización",
        duration: "15-20 días",
        price: "$3,000 - $8,000",
      },
    ],
  };

  const ServiceCard = ({ service, icon, color }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <h4 className="font-medium">{service.title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{service.duration}</span>
        <span className="font-medium text-green-600">{service.price}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* UX/UI Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Plantillas UX/UI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceTemplates.uxui.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              icon={<Palette className="w-4 h-4 text-purple-600" />}
              color="bg-purple-50"
            />
          ))}
        </div>
      </div>

      {/* Programming Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Plantillas de Desarrollo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceTemplates.programming.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              icon={<Code className="w-4 h-4 text-blue-600" />}
              color="bg-blue-50"
            />
          ))}
        </div>
      </div>

      {/* Social Media Templates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-pink-600" />
          Plantillas Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceTemplates.social.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              icon={<Share2 className="w-4 h-4 text-pink-600" />}
              color="bg-pink-50"
            />
          ))}
        </div>
      </div>

      {/* Quick Start Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Crear Proyecto Personalizado</div>
              <div className="text-sm text-gray-500">
                Desde cero con tus especificaciones
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <Palette className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Usar Plantilla UX/UI</div>
              <div className="text-sm text-gray-500">
                Inicia con diseños predefinidos
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <Code className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Plantilla de Desarrollo</div>
              <div className="text-sm text-gray-500">
                Desarrollo web optimizado
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;
