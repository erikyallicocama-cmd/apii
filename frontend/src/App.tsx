import React, { useState } from 'react';
import { Home } from './components/features/Home';
import { AiChat } from './components/features/AiChat';
import { ImageGenerator } from './components/features/ImageGenerator';

type View = 'home' | 'chat' | 'image';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (view: View) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 300);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home
            onSelectAI={() => handleNavigate('chat')}
            onSelectImage={() => handleNavigate('image')}
          />
        );
      case 'chat':
        return <AiChat onBack={() => handleNavigate('home')} />;
      case 'image':
        return <ImageGenerator onBack={() => handleNavigate('home')} />;
      default:
        return (
          <Home
            onSelectAI={() => handleNavigate('chat')}
            onSelectImage={() => handleNavigate('image')}
          />
        );
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderView()}
      </div>
    </div>
  );
};

export default App;
