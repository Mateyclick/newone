import { useState, useRef, useCallback } from 'react';
import { Move } from 'lucide-react';
import { Template, Position } from '../types';
import { TemplatePicker } from './TemplatePicker';
import { defaultTemplates } from '../data/templates';

export function PosterGenerator() {
  const [templates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0] || null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [pricePosition, setPricePosition] = useState<Position>({ x: 0, y: 0 });
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [bgPosition, setBgPosition] = useState<Position>({ x: 0, y: 0 });
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent, isDraggingPrice: boolean) => {
    e.preventDefault();
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } 
                              : { x: e.clientX, y: e.clientY };
    dragStartPos.current = pos;
    
    if (isDraggingPrice) {
      setIsDraggingPrice(true);
    } else {
      setIsDraggingBg(true);
    }
  };

  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    const currentPos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } 
                                    : { x: e.clientX, y: e.clientY };
    
    if (isDraggingPrice) {
      setPricePosition(prev => ({
        x: prev.x + (currentPos.x - dragStartPos.current.x),
        y: prev.y + (currentPos.y - dragStartPos.current.y)
      }));
    } else if (isDraggingBg) {
      setBgPosition(prev => ({
        x: prev.x + (currentPos.x - dragStartPos.current.x),
        y: prev.y + (currentPos.y - dragStartPos.current.y)
      }));
    }
    
    dragStartPos.current = currentPos;
  }, [isDraggingPrice, isDraggingBg]);

  const endDrag = useCallback(() => {
    setIsDraggingPrice(false);
    setIsDraggingBg(false);
  }, []);

  const generatePoster = () => {
    if (!selectedTemplate || !backgroundImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;

    // Draw background
    const bgImg = new Image();
    bgImg.onload = () => {
      ctx.drawImage(bgImg, bgPosition.x, bgPosition.y);
      
      // Draw overlay
      const overlay = new Image();
      overlay.onload = () => {
        ctx.drawImage(overlay, 0, 0, selectedTemplate.width, selectedTemplate.height);
        
        // Draw price
        ctx.fillStyle = 'white';
        ctx.font = `bold ${selectedTemplate.priceArea.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(price, pricePosition.x, pricePosition.y);
        
        // Draw logo if exists
        if (selectedTemplate.logo) {
          const logo = new Image();
          logo.onload = () => {
            ctx.drawImage(logo, 10, 10, 100, 100 * (logo.height / logo.width));
          };
          logo.src = selectedTemplate.logo;
        }
      };
      overlay.src = selectedTemplate.overlay;
    };
    bgImg.src = backgroundImage;
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'poster.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Add event listeners for drag
  useState(() => {
    if (isDraggingPrice || isDraggingBg) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('touchmove', onDrag);
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchend', endDrag);
    }

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [isDraggingPrice, isDraggingBg, onDrag, endDrag]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Generador de Carteles de Oferta</h1>
        
        <TemplatePicker
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir Imagen de Fondo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: $99"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {selectedTemplate && (
              <div className="relative mt-4" style={{
                width: selectedTemplate.width,
                height: selectedTemplate.height,
                margin: '0 auto'
              }}>
                {/* Background Image */}
                {backgroundImage && (
                  <img
                    src={backgroundImage}
                    alt="Fondo"
                    className="absolute cursor-move"
                    style={{
                      transform: `translate(${bgPosition.x}px, ${bgPosition.y}px)`,
                      touchAction: 'none'
                    }}
                    onMouseDown={(e) => startDrag(e, false)}
                    onTouchStart={(e) => startDrag(e, false)}
                  />
                )}

                {/* Template Overlay */}
                <img
                  src={selectedTemplate.overlay}
                  alt="Template"
                  className="absolute top-0 left-0 pointer-events-none"
                />

                {/* Draggable Price */}
                <div
                  className="absolute flex items-center justify-center cursor-move"
                  style={{
                    transform: `translate(${pricePosition.x}px, ${pricePosition.y}px)`,
                    touchAction: 'none'
                  }}
                  onMouseDown={(e) => startDrag(e, true)}
                  onTouchStart={(e) => startDrag(e, true)}
                >
                  <Move className="w-6 h-6 text-blue-500" />
                  <span className="ml-2 text-white font-bold" style={{
                    fontSize: selectedTemplate.priceArea.fontSize
                  }}>
                    {price || '$99'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={generatePoster}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generar Cartel
              </button>
              <button
                onClick={downloadPoster}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Descargar Cartel
              </button>
            </div>

            <canvas
              ref={canvasRef}
              className="mt-8 mx-auto border border-gray-300 rounded-md"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}