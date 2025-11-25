import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const formatText = (text: string) => {
    // Dividir el texto en líneas para procesarlo
    const lines = text.split('\n');
    const formattedElements: React.ReactNode[] = [];
    let currentListItems: React.ReactNode[] = [];
    let listKey = 0;
    
    const pushListIfExists = () => {
      if (currentListItems.length > 0) {
        formattedElements.push(
          <ul key={`list-${listKey++}`} className="ml-4 mb-3 space-y-1 list-disc">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Títulos principales (### )
      if (trimmedLine.startsWith('### ')) {
        pushListIfExists();
        formattedElements.push(
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2 border-b border-gray-200 pb-1">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      // Títulos secundarios (**texto**)
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length > 4) {
        pushListIfExists();
        const title = trimmedLine.slice(2, -2);
        formattedElements.push(
          <h4 key={index} className="text-base font-semibold text-gray-800 mt-3 mb-2">
            {title}
          </h4>
        );
      }
      // Listas con viñetas (* )
      else if (trimmedLine.startsWith('* ')) {
        currentListItems.push(
          <li key={index} className="text-gray-700 text-sm">
            {processInlineFormatting(trimmedLine.replace('* ', ''))}
          </li>
        );
      }
      // Separadores (---)
      else if (trimmedLine === '---') {
        pushListIfExists();
        formattedElements.push(
          <hr key={index} className="my-4 border-gray-300" />
        );
      }
      // Párrafos normales
      else if (trimmedLine.length > 0) {
        pushListIfExists();
        formattedElements.push(
          <p key={index} className="mb-2 text-gray-700 text-sm leading-relaxed">
            {processInlineFormatting(trimmedLine)}
          </p>
        );
      }
      // Espacios en blanco (solo si no estamos en una lista)
      else if (currentListItems.length === 0) {
        formattedElements.push(<div key={index} className="h-2" />);
      }
    });
    
    // Agregar la lista final si existe
    pushListIfExists();
    
    return formattedElements;
  };

  const processInlineFormatting = (text: string): React.ReactNode => {
    // Procesar texto en negrita (**texto**)
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`formatted-text ${className}`}>
      {formatText(text)}
    </div>
  );
};
