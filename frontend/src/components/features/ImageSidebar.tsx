import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { imageService } from '../../services/imageService';
import type { AiImage } from '../../types/api';

interface ImageHistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  style: string;
  size: string;
  createdAt: string;
}

interface ImageSidebarProps {
  onNewGeneration: () => void;
  onLoadImage?: (image: AiImage) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ImageSidebar: React.FC<ImageSidebarProps> = ({
  onNewGeneration,
  onLoadImage,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'history' | 'archived' | 'docs'>('history');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [archivedImages, setArchivedImages] = useState<ImageHistoryItem[]>([]);

  useEffect(() => {
    loadImageHistory();
  }, []);

  useEffect(() => {
    if (activeSection === 'archived') {
      loadArchivedImages();
    }
  }, [activeSection]);

  const loadImageHistory = async () => {
    try {
      setIsLoading(true);
      const response = await imageService.getHistory();
      
      // Convertir a items de historial
      const historyItems: ImageHistoryItem[] = response.map((item) => ({
        id: item.id || '',
        prompt: item.prompt.length > 40 
          ? `${item.prompt.slice(0, 40)}...` 
          : item.prompt,
        imageUrl: item.imageUrl,
        thumbnailUrl: item.thumbnailUrl,
        style: item.style || `Style ${item.styleId}`,
        size: item.size,
        createdAt: new Date(item.createdAt || '').toLocaleDateString()
      }));
      
      setImageHistory(historyItems);
    } catch (error) {
      console.error('Error loading image history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArchivedImages = async () => {
    try {
      setIsLoading(true);
      // Obtener todas las imágenes
      const allImages = await imageService.getAllImagesHistory();
      const activeImages = await imageService.getHistory();
      
      // Obtener IDs de imágenes activas
      const activeImageIds = new Set(activeImages.map(item => item.id));
      
      // Filtrar solo las imágenes inactivas
      const inactiveImages = allImages.filter(item => !activeImageIds.has(item.id));
      
      // Convertir a items de historial
      const archivedItems: ImageHistoryItem[] = inactiveImages.map((item) => ({
        id: item.id || '',
        prompt: item.prompt.length > 40 
          ? `${item.prompt.slice(0, 40)}...` 
          : item.prompt,
        imageUrl: item.imageUrl,
        thumbnailUrl: item.thumbnailUrl,
        style: item.style || `Style ${item.styleId}`,
        size: item.size,
        createdAt: new Date(item.createdAt || '').toLocaleDateString()
      }));
      
      setArchivedImages(archivedItems);
    } catch (error) {
      console.error('Error loading archived images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageId: string) => {
    if (!isDeleteMode && onLoadImage) {
      // Buscar la imagen completa y pasarla al callback
      imageService.getById(imageId).then(onLoadImage).catch(console.error);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedImages(new Set());
  };

  const handleCheckboxChange = (imageId: string, checked: boolean) => {
    const newSelected = new Set(selectedImages);
    if (checked) {
      newSelected.add(imageId);
    } else {
      newSelected.delete(imageId);
    }
    setSelectedImages(newSelected);
  };

  const deactivateSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    try {
      setIsDeleting(true);
      
      // Desactivar todas las imágenes seleccionadas
      const deactivatePromises = Array.from(selectedImages).map(imageId =>
        imageService.deactivateImage(imageId)
      );
      
      await Promise.all(deactivatePromises);
      
      // Recargar el historial
      await loadImageHistory();
      
      // Salir del modo desactivación
      setIsDeleteMode(false);
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error deactivating images:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const reactivateSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    try {
      setIsDeleting(true);
      
      // Reactivar todas las imágenes seleccionadas
      const reactivatePromises = Array.from(selectedImages).map(imageId =>
        imageService.reactivateImage(imageId)
      );
      
      await Promise.all(reactivatePromises);
      
      // Recargar ambos historiales
      await loadArchivedImages();
      await loadImageHistory();
      
      // Salir del modo reactivación
      setIsDeleteMode(false);
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error reactivating images:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-gradient-to-b from-orange-600 via-amber-600 to-orange-700 text-white flex flex-col items-center py-4 space-y-4 shadow-xl">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          title="Expandir sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={onNewGeneration}
          className="p-2 rounded-xl bg-gradient-to-br from-white/90 to-white/70 text-orange-700 hover:from-white hover:to-white transition-all shadow-lg"
          title="Nueva imagen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gradient-to-b from-orange-600 via-amber-600 to-orange-700 text-white flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Generador de Imágenes</h2>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl hover:bg-white/15 transition-colors backdrop-blur-sm"
            title="Colapsar sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <Button
          onClick={onNewGeneration}
          className="w-full bg-white text-orange-700 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-amber-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Imagen
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-5 border-b border-white/10">
        <div className="grid grid-cols-3 gap-2 bg-white/15 p-1.5 rounded-2xl mb-3 backdrop-blur-sm">
          <button
            onClick={() => setActiveSection('history')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'history'
                ? 'bg-white text-orange-700 shadow'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setActiveSection('archived')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'archived'
                ? 'bg-white text-orange-700 shadow'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Archivadas
          </button>
          <button
            onClick={() => setActiveSection('docs')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'docs'
                ? 'bg-white text-orange-700 shadow'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Docs
          </button>
        </div>

        {/* Deactivate/Reactivate Mode Controls */}
        {(activeSection === 'history' || activeSection === 'archived') && (
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDeleteMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                isDeleteMode
                  ? activeSection === 'archived'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-orange-700 hover:bg-amber-50'
              }`}
            >
              {isDeleteMode
                ? 'Cancelar'
                : activeSection === 'archived'
                  ? 'Restaurar'
                  : 'Archivar'}
            </button>
            
            {isDeleteMode && (
              <button
                onClick={activeSection === 'archived' ? reactivateSelectedImages : deactivateSelectedImages}
                disabled={selectedImages.size === 0 || isDeleting}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                  selectedImages.size > 0 && !isDeleting
                    ? activeSection === 'archived'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/40 text-white cursor-not-allowed'
                }`}
              >
                {isDeleting
                  ? activeSection === 'archived' ? 'Restaurando...' : 'Archivando...'
                  : activeSection === 'archived'
                    ? `Restaurar (${selectedImages.size})`
                    : `Archivar (${selectedImages.size})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'history' && (
          <div className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Imágenes Recientes</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : imageHistory.length > 0 ? (
              <div className="space-y-3">
                {imageHistory.map((image) => (
                  <div
                    key={image.id}
                    className={`relative p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group ${
                      isDeleteMode ? 'pr-12' : ''
                    }`}
                  >
                    {/* Checkbox en modo eliminación */}
                    {isDeleteMode && (
                      <div className="absolute right-3 top-3">
                        <input
                          type="checkbox"
                          checked={selectedImages.has(image.id)}
                          onChange={(e) => handleCheckboxChange(image.id, e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                      </div>
                    )}
                    
                    {/* Contenido de la imagen */}
                    <button
                      onClick={() => handleImageClick(image.id)}
                      className={`w-full text-left ${isDeleteMode ? 'pr-6' : ''}`}
                      disabled={isDeleteMode}
                    >
                      {/* Thumbnail de la imagen */}
                      <div className="w-full h-20 mb-2 rounded-lg overflow-hidden bg-black/20">
                        <img
                          src={image.thumbnailUrl || image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/80x80/374151/9CA3AF?text=IMG`;
                          }}
                        />
                      </div>
                      
                      <div className="font-medium text-xs text-white mb-1 truncate">
                        {image.prompt}
                      </div>
                      <div className="text-xs text-white/70 mb-1 flex justify-between">
                        <span>{image.createdAt}</span>
                        <span>{image.size}</span>
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        Estilo: {image.style}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <p className="text-sm">No hay imágenes generadas aún</p>
                <p className="text-xs mt-1">Genera tu primera imagen para comenzar</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'archived' && (
          <div className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Imágenes Archivadas</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : archivedImages.length > 0 ? (
              <div className="space-y-3">
                {archivedImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group opacity-70 ${
                      isDeleteMode ? 'pr-12' : ''
                    }`}
                  >
                    {/* Checkbox en modo restauración */}
                    {isDeleteMode && (
                      <div className="absolute right-3 top-3">
                        <input
                          type="checkbox"
                          checked={selectedImages.has(image.id)}
                          onChange={(e) => handleCheckboxChange(image.id, e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                      </div>
                    )}
                    
                    {/* Icono de archivo */}
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    
                    {/* Contenido de la imagen */}
                    <button
                      onClick={() => handleImageClick(image.id)}
                      className={`w-full text-left ${isDeleteMode ? 'pr-6' : ''}`}
                      disabled={isDeleteMode}
                    >
                      {/* Thumbnail de la imagen */}
                      <div className="w-full h-20 mb-2 rounded-lg overflow-hidden bg-black/20">
                        <img
                          src={image.thumbnailUrl || image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/80x80/374151/9CA3AF?text=IMG`;
                          }}
                        />
                      </div>
                      
                      <div className="font-medium text-xs text-white mb-1 truncate">
                        {image.prompt}
                      </div>
                      <div className="text-xs text-white/70 mb-1 flex justify-between">
                        <span>{image.createdAt}</span>
                        <span>{image.size}</span>
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        Estilo: {image.style}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <p className="text-sm">No hay imágenes archivadas</p>
                <p className="text-xs mt-1">Las imágenes archivadas aparecerán aquí</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'docs' && (
          <div className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Documentación</h3>
            <div className="space-y-2">
              <a
                href="https://platform.openai.com/docs/guides/images"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Guía de Generación de Imágenes
                </div>
                <div className="text-xs text-white/70">
                  Aprende sobre prompts efectivos
                </div>
              </a>
              
              <a
                href="https://platform.openai.com/docs/guides/images/usage"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Estilos y Configuraciones
                </div>
                <div className="text-xs text-white/70">
                  Opciones de personalización
                </div>
              </a>
              
              <a
                href="https://platform.openai.com/docs/guides/images/prompting"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Mejores Prácticas
                </div>
                <div className="text-xs text-white/70">
                  Tips para mejores resultados
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-white/10">
        <div className="text-xs text-white/60 text-center">Powered by AI Image Generation</div>
      </div>
    </div>
  );
};
