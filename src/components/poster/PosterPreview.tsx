
import { useRef, useEffect } from 'react';
import { Grid, Eye, EyeOff } from 'lucide-react';
import { Template, Position } from '../../types';

interface PosterPreviewProps {
  selectedTemplate: Template | null;
  backgroundImage: string;
  price: string;
  pricePosition: Position;
  priceColor: string;
  priceFontSize: number;
  bgPosition: Position;
  bgScale: number;
  showGrid: boolean;
  showTemplate: boolean;
  isDraggingPrice: boolean;
  isDraggingBg: boolean;
  startDrag: (e: React.MouseEvent | React.TouchEvent, dragType: 'price' | 'background') => void;
}

export function PosterPreview({
  selectedTemplate,
  backgroundImage,
  price,
  pricePosition,
  priceColor,
  priceFontSize,
  bgPosition,
  bgScale,
  showGrid,
  showTemplate,
  isDraggingPrice,
  isDraggingBg,
  startDrag
}: PosterPreviewProps) {
  
  // Handle error logging for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, type: string) => {
    console.error(`Error loading ${type}:`, e);
  };
  
  if (!selectedTemplate) return null;
  
  return (
    <div className="relative mb-6 mx-auto overflow-hidden bg-white shadow-lg rounded-lg">
      <div
        style={{
          width: '100%',
          height: 0,
          paddingBottom: `${(selectedTemplate.height / selectedTemplate.width) * 100}%`,
          position: 'relative',
        }}
      >
        {/* Grid de ayuda */}
        {showGrid && (
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )}
        
        {/* Imagen de fondo */}
        {backgroundImage && (
          <div
            className="absolute cursor-move touch-none"
            style={{
              transform: `translate(${bgPosition.x}px, ${bgPosition.y}px) scale(${bgScale})`,
              transformOrigin: 'top left',
              transition: isDraggingBg ? 'none' : 'transform 0.1s ease',
            }}
            onMouseDown={(e) => startDrag(e, 'background')}
            onTouchStart={(e) => startDrag(e, 'background')}
          >
            <img
              src={backgroundImage}
              alt="Fondo"
              style={{
                maxWidth: 'none',
              }}
              onError={(e) => handleImageError(e, 'background image')}
            />
          </div>
        )}
        
        {/* Template overlay */}
        {showTemplate && selectedTemplate.overlay && (
          <img
            src={selectedTemplate.overlay}
            alt="Template"
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
            onError={(e) => handleImageError(e, 'template overlay')}
          />
        )}
        
        {/* Texto del precio */}
        {price && (
          <div
            className="absolute flex items-center justify-center z-30 cursor-move touch-none"
            style={{
              left: pricePosition.x,
              top: pricePosition.y,
              transform: 'translate(-50%, -50%)',
              transition: isDraggingPrice ? 'none' : 'all 0.1s ease',
            }}
            onMouseDown={(e) => startDrag(e, 'price')}
            onTouchStart={(e) => startDrag(e, 'price')}
          >
            <span
              style={{
                color: priceColor,
                fontSize: `${priceFontSize * 0.8}px`,
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
