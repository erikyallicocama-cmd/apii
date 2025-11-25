import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  gradient: string;
  iconBg: string;
  features: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  gradient,
  iconBg,
  features 
}) => {
  return (
    <div 
      className="group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-full rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/40 bg-white/60 backdrop-blur-md">
        {/* Soft gradient aura */}
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${gradient}`} />
        
        <div className="relative p-8">
          {/* Header with icon and title */}
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 bg-gradient-to-br ${iconBg}`} />
              <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl bg-gradient-to-br ${iconBg}`}>
                <span className="text-2xl">{icon}</span>
              </div>
            </div>
            <h3 className={`text-2xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{title}</h3>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {description}
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-50 to-teal-50 text-teal-700 border border-teal-100"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA at bottom */}
          <div className="flex justify-end">
            <button className={`inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} hover:shadow-lg transform hover:-translate-y-0.5 transition-all`}>
              Explorar ahora
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomeProps {
  onSelectAI: () => void;
  onSelectImage: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectAI, onSelectImage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl w-full">
        {/* Header ARRIBA */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-black mb-6 bg-gradient-to-l from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
            ERICKA SEPK
          </h1>
          
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Desata tu potencial creativo con inteligencia artificial avanzada. Selecciona tu herramienta y transforma tus ideas en realidad.
          </p>
        </div>

        {/* Service Cards AHORA ABAJO */}
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Mantener orden actual: Generador Visual primero */}
          <ServiceCard
            title="Generador Visual"
            description="Crea imágenes espectaculares a partir de texto. Accede a más de 70 estilos artísticos y diseña visuales únicos con IA."
            icon="🖼️"
            gradient="from-orange-500 via-amber-500 to-yellow-500"
            iconBg="from-orange-200 to-amber-300"
            features={[
              "70+ estilos",
              "9 formatos",
              "Instantáneo",
              "Galería"
            ]}
            onClick={onSelectImage}
          />
          
          <ServiceCard
            title="Asistente Conversacional"
            description="Conecta con un asistente inteligente de última generación. Resuelve dudas, crea contenido y mantén diálogos naturales con IA."
            icon="💬"
            gradient="from-teal-500 via-emerald-500 to-green-500"
            iconBg="from-teal-200 to-emerald-300"
            features={[
              "Sin límites",
              "Instantáneo",
              "Con memoria",
              "Multi-modelo"
            ]}
            onClick={onSelectAI}
          />
        </div>
        
        {/* Footer ABAJO */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-6 py-2 rounded-full shadow-md border border-gray-200">
            <span>Powered by Flux AI</span>
            <span>•</span>
            <span>Privacidad Garantizada</span>
            <span>🔒</span>
          </div>
        </div>
      </div>
    </div>
  );
};
