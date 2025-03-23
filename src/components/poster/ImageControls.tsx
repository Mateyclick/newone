
import { useRef } from 'react';
import { Upload, ImageIcon, Maximize, Minimize, Move, Grid, Eye, EyeOff } from 'lucide-react';

interface ImageControlsProps {
  backgroundImage: string;
  apiKey: string;
  isProcessing: boolean;
  error: string;
  setApiKey: (value: string) => void;
  removeBackground: () => void;
  adjustImageSize: (factor: number) => void;
  centerImage: () => void;
  setShowGrid: (value: boolean) => void;
  showGrid: boolean;
  setShowTemplate: (value: boolean) => void;
  showTemplate: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageControls({
  backgroundImage,
  apiKey,
  isProcessing,
  error,
  setApiKey,
  removeBackground,
  adjustImageSize,
  centerImage,
  setShowGrid,
  showGrid,
  setShowTemplate,
  showTemplate,
  handleFileUpload
}: ImageControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
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
          Obtén tu API key gratis en <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">remove.bg/api</a>
        </p>
      </div>
      
      {/* Botón para quitar fondo */}
      <button
        onClick={removeBackground}
        disabled={isProcessing || !backgroundImage || !apiKey}
        className={`w-full p-2 sm:p-3 rounded-md flex items-center justify-center ${
          isProcessing || !backgroundImage || !apiKey
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Procesando...</span>
          </div>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span>Quitar Fondo</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {/* Información sobre imágenes sin fondo */}
      {backgroundImage && !error && (
        <div className="text-xs text-gray-600 p-2 bg-gray-50 border border-gray-100 rounded-md">
          <p className="font-medium mb-1">Instrucciones:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Usa las herramientas abajo para ajustar la imagen</li>
            <li>Puedes arrastrar la imagen con el mouse/dedo para posicionarla</li>
            <li>El botón de cuadrícula te ayuda a ver la alineación</li>
          </ul>
        </div>
      )}
      
      {/* Controles de manipulación de imagen */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => adjustImageSize(1.1)}
          disabled={!backgroundImage}
          title="Agrandar imagen"
          className="p-2 sm:p-3 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex-1 flex items-center justify-center"
        >
          <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-1 text-sm hidden sm:inline">Agrandar</span>
        </button>
        <button
          onClick={() => adjustImageSize(0.9)}
          disabled={!backgroundImage}
          title="Reducir imagen"
          className="p-2 sm:p-3 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex-1 flex items-center justify-center"
        >
          <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-1 text-sm hidden sm:inline">Reducir</span>
        </button>
        <button
          onClick={centerImage}
          disabled={!backgroundImage}
          title="Centrar imagen"
          className="p-2 sm:p-3 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex-1 flex items-center justify-center"
        >
          <Move className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-1 text-sm hidden sm:inline">Centrar</span>
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          title={showGrid ? "Ocultar cuadrícula" : "Mostrar cuadrícula"}
          className={`p-2 sm:p-3 rounded flex-1 flex items-center justify-center ${showGrid ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-1 text-sm hidden sm:inline">Cuadrícula</span>
        </button>
        <button
          onClick={() => setShowTemplate(!showTemplate)}
          title={showTemplate ? "Ocultar plantilla" : "Mostrar plantilla"}
          className={`p-2 sm:p-3 rounded flex-1 flex items-center justify-center ${!showTemplate ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {showTemplate ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="ml-1 text-sm hidden sm:inline">Plantilla</span>
        </button>
      </div>
    </div>
  );
}
