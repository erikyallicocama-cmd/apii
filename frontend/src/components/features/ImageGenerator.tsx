import React, { useState } from 'react';
import { imageService } from '../../services/imageService';
import { IMAGE_STYLE_OPTIONS, IMAGE_SIZE_OPTIONS } from '../../constants';
import { ImageSidebar } from './ImageSidebar';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import type { ImageRequestDTO, AiImage } from '../../types/api';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

interface ImageGeneratorProps {
  onBack: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState(1);
  const [selectedSize, setSelectedSize] = useState('1-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Usar las constantes importadas en lugar de definir arrays locales

  const handleNewGeneration = () => {
    setImages([]);
    setPrompt('');
  };

  const handleLoadImage = (image: AiImage) => {
    setPrompt(image.prompt);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Usar el servicio de imágenes real con la nueva estructura
      const imageRequestData: ImageRequestDTO = {
        prompt: prompt.trim(),
        style_id: selectedStyleId,
        size: selectedSize
      };
      
      console.log('📤 Enviando request:', imageRequestData);
      const response = await imageService.generate(imageRequestData);
      console.log('📥 Respuesta recibida:', response);
      
      // Verificar que la generación fue exitosa
      if (response.imageUrl && response.status === 'success') {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: response.imageUrl,
          prompt: prompt.trim(),
          timestamp: new Date(),
        };
        
        setImages(prev => [newImage, ...prev]);
        setPrompt('');
      } else {
        console.error('❌ Error en la generación:');
        console.error('Status:', response.status);
        console.error('ImageUrl:', response.imageUrl);
        console.error('Raw Response:', response.rawResponse);
        
        // Mostrar un error más descriptivo
        const errorMsg = response.rawResponse 
          ? `Error: ${response.status || 'desconocido'}\n\nRespuesta: ${response.rawResponse.substring(0, 200)}...`
          : `Error: ${response.status || 'desconocido'}. No se recibió imagen.`;
        
        alert(errorMsg);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('💥 Error en la llamada:', error);
      alert(`Error en la llamada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Sidebar */}
      <ImageSidebar
        onNewGeneration={handleNewGeneration}
        onLoadImage={handleLoadImage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="group flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Volver</span>
              </button>
              <div className="h-8 w-px bg-white/30"></div>
              <div className="flex items-center space-x-3">
                <AnimatedLogo size="md" className="shadow-lg" />
                <div>
                  <h1 className="font-bold text-white text-lg">Generador de Imágenes AI</h1>
                  <p className="text-xs text-white/80">Crea arte con inteligencia artificial</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
        {/* Input Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-200 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-orange-800 mb-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Describe tu visión</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Un gato naranja durmiendo en un sofá azul, estilo artístico, iluminación cinematográfica..."
                className="w-full border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all resize-none"
                rows={3}
                disabled={isLoading}
              />
              <p className="text-xs text-orange-700/80 mt-2 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Sé específico para mejores resultados</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-orange-800 mb-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span>Estilo Artístico</span>
                  <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">70+ estilos</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent appearance-none bg-white pr-10 font-medium text-gray-700 transition-all"
                    value={selectedStyleId}
                    onChange={(e) => setSelectedStyleId(Number(e.target.value))}
                    disabled={isLoading}
                  >
                    {IMAGE_STYLE_OPTIONS.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-xs text-orange-700/80 mt-2">
                  {IMAGE_STYLE_OPTIONS.find(s => s.value === selectedStyleId)?.category || 'Estilos profesionales'}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-teal-800 mb-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Formato & Tamaño</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent appearance-none bg-white pr-10 font-medium text-gray-700 transition-all"
                    disabled={isLoading}
                  >
                    {IMAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-xs text-orange-700/80 mt-2">
                  {IMAGE_SIZE_OPTIONS.find(s => s.value === selectedSize)?.description || 'Selecciona un formato'}
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-2 font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generando imagen...</span>
                </>
              ) : (
                <>
                  <span>🎨</span>
                  <span>Generar Imagen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Images */}
        {images.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-orange-900 flex items-center space-x-2">
                <span className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>Galería de Creaciones</span>
              </h2>
              <span className="text-sm text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-teal-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">"{image.prompt}"</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{image.timestamp.toLocaleString()}</span>
                      </span>
                      <a
                        href={image.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Descargar</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-900 mb-3">
              ¡Crea tu primera obra maestra!
            </h3>
            <p className="text-orange-800/90 max-w-md mx-auto">
              Describe tu visión y nuestro AI la transformará en arte digital en segundos.
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};
