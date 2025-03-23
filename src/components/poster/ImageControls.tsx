
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
  );
}
