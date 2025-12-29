const faqs = [
  {
    question: "¿Cuál es tu proceso de trabajo?",
    answer:
      "Inicio con una consulta detallada, seguida de investigación, wireframes, diseño, desarrollo y testing para asegurar calidad.",
    icon: "🎨", // Opcional: podrías usar iconos reales
  },
  {
    question: "¿Ofreces mantenimiento?",
    answer:
      "Sí, ofrezco planes de mantenimiento y soporte continuo para asegurar que tu sitio siga funcionando perfecto tras el lanzamiento.",
    icon: "🛠️",
  },
  {
    question: "¿Trabajas con equipos?",
    answer:
      "Por supuesto, tengo experiencia colaborando con equipos de desarrollo, diseñadores y managers usando metodologías ágiles.",
    icon: "🤝",
  },
];
function FAQ() {
  return (
    <section id="faq" className="py-20 bg-gray-900 relative">
      {/* Fondo decorativo opcional */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl mix-blend-screen"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full blur-3xl mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Resuelvo tus dudas
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto">
            Todo lo que necesitas saber sobre cómo trabajamos juntos para crear
            tu próximo proyecto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
            >
              {/* Icono decorativo */}
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:bg-purple-500/20 transition-colors">
                {faq.icon}
              </div>

              <h4 className="text-xl text-white font-bold mb-3 group-hover:text-purple-400 transition-colors">
                {faq.question}
              </h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FAQ;
