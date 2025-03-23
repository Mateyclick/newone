
import { Download } from 'lucide-react';

interface PriceControlsProps {
  price: string;
  priceColor: string;
  priceFontSize: number;
  backgroundImage: string;
  setPrice: (value: string) => void;
  setPriceColor: (value: string) => void;
  adjustFontSize: (change: number) => void;
  setPriceFontSize: (value: number) => void;
  downloadPoster: () => void;
}

export function PriceControls({
  price,
  priceColor,
  priceFontSize,
  backgroundImage,
  setPrice,
  setPriceColor,
  adjustFontSize,
  setPriceFontSize,
  downloadPoster
}: PriceControlsProps) {
  return (
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
  );
}
