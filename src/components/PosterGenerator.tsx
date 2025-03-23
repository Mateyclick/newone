
import { useState, useRef, useCallback, useEffect } from 'react';
import { Move, Maximize, Minimize, Eye, EyeOff, Grid, Download, Upload, Image as ImageIcon } from 'lucide-react';
import { Template, Position } from '../types';
import { TemplatePicker } from './TemplatePicker';
import { defaultTemplates } from '../data/templates';

export function PosterGenerator() {
  // Estados para manejar las plantillas y la selección
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0] || null);
  
  // Estados para la imagen y su manipulación
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [pricePosition, setPricePosition] = useState<Position>({ x: 200, y: 700 });
  const [priceColor, setPriceColor] = useState<string>('#ffffff');
  const [priceFontSize, setPriceFontSize] = useState<number>(40);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(true);
  
  // Estados para el manejo del arrastre (drag)
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [bgPosition, setBgPosition] = useState<Position>({ x: 0, y: 0 });
  const [bgScale, setBgScale] = useState<number>(1.0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Referencias
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicialización de plantillas SVG
  useEffect(() => {
    // Cargar las plantillas SVG proporcionadas
    const loadSvgTemplates = async () => {
      try {
        // Usar las plantillas predeterminadas
        setTemplates(defaultTemplates);
        setSelectedTemplate(defaultTemplates[0]);
        console.log("Templates loaded:", defaultTemplates);
      } catch (error) {
        console.error("Error cargando plantillas SVG:", error);
      }
    };

    loadSvgTemplates();
  }, []);

  // Manejador para la subida de archivos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        // Reiniciar posición y escala cuando se sube una nueva imagen
        setBgPosition({ x: 0, y: 0 });
        setBgScale(1.0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador para iniciar el arrastre (drag)
  const startDrag = (e: React.MouseEvent | React.TouchEvent, dragType: 'price' | 'background') => {
    e.preventDefault();
    const pos = 'touches' in e 
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY } 
      : { x: e.clientX, y: e.clientY };
    
    dragStartPos.current = pos;
    
    if (dragType === 'price') {
      setIsDraggingPrice(true);
    } else {
      setIsDraggingBg(true);
    }
  };

  // Manejador para el movimiento durante el arrastre
  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    const currentPos = 'touches' in e 
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY } 
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

  // Manejador para finalizar el arrastre
  const endDrag = useCallback(() => {
    setIsDraggingPrice(false);
    setIsDraggingBg(false);
  }, []);

  // Función para remover el fondo usando remove.bg API
  const removeBackground = async () => {
    if (!backgroundImage) {
      setError("Por favor, sube una imagen primero");
      return;
    }
    
    if (!apiKey) {
      setError("Por favor, ingresa tu API key de remove.bg");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      // Convertir la imagen base64 a un archivo Blob
      const base64Data = backgroundImage.split(',')[1];
      const blob = b64toBlob(base64Data, 'image/png');
      
      const formData = new FormData();
      formData.append('image_file', blob, 'image.png');
      formData.append('size', 'auto');
      
      // Llamar a la API de remove.bg
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error de remove.bg:", errorText);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      // Convertir la respuesta a base64 para mostrarla
      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(imageBlob);
      
    } catch (error) {
      console.error("Error al remover el fondo:", error);
      setError("Error al procesar la imagen. Verifica tu API key y la conexión a internet.");
      setIsProcessing(false);
    }
  };

  // Función auxiliar para convertir base64 a Blob
  const b64toBlob = (b64Data: string, contentType: string) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: contentType });
  };

  // Función para generar el póster
  const generatePoster = () => {
    if (!selectedTemplate || !backgroundImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar dimensiones del canvas
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;

    // Crear y cargar imagen de fondo
    const bgImg = new window.Image();
    bgImg.onload = () => {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calcular dimensiones escaladas
      const scaledWidth = bgImg.width * bgScale;
      const scaledHeight = bgImg.height * bgScale;
      
      // Dibujar imagen con posición y escala
      ctx.drawImage(
        bgImg, 
        bgPosition.x, bgPosition.y, 
        scaledWidth, scaledHeight
      );
      
      // Dibujar overlay si está visible
      if (showTemplate) {
        const overlay = new window.Image();
        overlay.onload = () => {
          ctx.drawImage(overlay, 0, 0, selectedTemplate.width, selectedTemplate.height);
          
          // Dibujar precio
          if (price) {
            ctx.fillStyle = priceColor;
            ctx.font = `bold ${priceFontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(price, pricePosition.x, pricePosition.y);
          }
        };
        overlay.src = selectedTemplate.overlay;
        overlay.onerror = (e) => {
          console.error("Error al cargar el overlay:", e);
        };
      } else if (price) {
        // Si el template está oculto pero hay precio, dibujarlo de todas formas
        ctx.fillStyle = priceColor;
        ctx.font = `bold ${priceFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(price, pricePosition.x, pricePosition.y);
      }
    };
    bgImg.src = backgroundImage;
    bgImg.onerror = (e) => {
      console.error("Error al cargar la imagen de fondo:", e);
    };
  };

  // Función para descargar el póster
  const downloadPoster = () => {
    // Primero generar el póster
    generatePoster();
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = 'poster.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 500); // Pequeño retraso para asegurar que el canvas esté listo
  };
  
  // Ajustar el tamaño de la imagen
  const adjustImageSize = (factor: number) => {
    setBgScale(prev => {
      const newScale = prev * factor;
      // Limitar el zoom entre 0.1 y 5
      return Math.max(0.1, Math.min(5, newScale));
    });
  };
  
  // Ajustar el tamaño de la fuente del precio
  const adjustFontSize = (change: number) => {
    setPriceFontSize(prev => Math.max(10, Math.min(200, prev + change)));
  };
  
  // Centrar la imagen
  const centerImage = () => {
    if (!selectedTemplate) return;
    
    setBgPosition({
      x: (selectedTemplate.width / 2) - (backgroundImage ? 250 : 0),
      y: (selectedTemplate.height / 2) - (backgroundImage ? 250 : 0)
    });
  };
  
  // Abrir el selector de archivos
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Agregar event listeners para drag
  useEffect(() => {
    if (isDraggingPrice || isDraggingBg) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('touchmove', onDrag, { passive: false });
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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 sm:mb-6">Generador de Carteles</h1>
        
        {/* Selector de plantillas */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl font-semibold mb-2 sm:mb-3">Selecciona una plantilla</h2>
          <TemplatePicker
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        </div>
        
        {/* Controles principales */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Panel de imagen */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-medium">Imagen de Fondo</h3>
              
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Botón para subir imagen */}
              <button
                onClick={triggerFileInput}
                className="flex items-center justify-center w-full p-2 sm:p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Subir Imagen</span>
              </button>
              
              {/* API Key para remove.bg */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key de remove.bg
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API key"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtén tu API key en <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">remove.bg/api</a>
                </p>
              </div>
              
              {/* Botón para quitar fondo */}
              <button
                onClick={removeBackground}
                disabled={isProcessing || !backgroundImage || !apiKey}
                className={`w-full p-2 rounded-md flex items-center justify-center ${
                  isProcessing || !backgroundImage || !apiKey
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Quitar Fondo</span>
                  </>
                )}
              </button>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              {/* Controles de manipulación de imagen */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => adjustImageSize(1.1)}
                  disabled={!backgroundImage}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => adjustImageSize(0.9)}
                  disabled={!backgroundImage}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={centerImage}
                  disabled={!backgroundImage}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <Move className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded ${showGrid ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setShowTemplate(!showTemplate)}
                  className={`p-2 rounded ${!showTemplate ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {showTemplate ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
            
            {/* Panel de precio */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-medium">Texto del Precio</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej: $99"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={priceColor}
                    onChange={(e) => setPriceColor(e.target.value)}
                    className="p-1 border border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">{priceColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño de fuente: {priceFontSize}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustFontSize(-5)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={priceFontSize}
                    onChange={(e) => setPriceFontSize(parseInt(e.target.value))}
                    className="flex-grow"
                  />
                  <button
                    onClick={() => adjustFontSize(5)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={downloadPoster}
                  disabled={!backgroundImage}
                  className={`w-full p-2 sm:p-3 rounded-md flex items-center justify-center ${
                    !backgroundImage
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span>Descargar Banner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Área de previsualización */}
        {selectedTemplate && (
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
                    onError={(e) => console.error("Error cargando imagen:", e)}
                  />
                </div>
              )}
              
              {/* Template overlay */}
              {showTemplate && (
                <img
                  src={selectedTemplate.overlay}
                  alt="Template"
                  className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
                  onError={(e) => console.error("Error cargando template overlay:", e)}
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
        )}
        
        {/* Canvas oculto para generar el póster */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
      
      {/* Instrucciones para el usuario */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg text-sm">
        <h3 className="font-medium mb-2">Instrucciones de uso:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Selecciona una plantilla de las opciones disponibles.</li>
          <li>Sube una imagen de fondo haciendo clic en "Subir Imagen".</li>
          <li>Para quitar el fondo, ingresa tu API key de remove.bg y haz clic en "Quitar Fondo".</li>
          <li>Agrega el texto del precio y ajusta su color y tamaño.</li>
          <li>Arrastra la imagen y el precio para posicionarlos como desees.</li>
          <li>Usa los botones de zoom para ajustar el tamaño de la imagen.</li>
          <li>Cuando estés satisfecho, haz clic en "Descargar Banner".</li>
        </ol>
      </div>
    </div>
  );
}
