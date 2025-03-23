
import { useState, useRef } from 'react';
import { Template } from '../types';
import { TemplatePicker } from './TemplatePicker';
import { defaultTemplates } from '../data/templates';
import { ImageControls } from './poster/ImageControls';
import { PriceControls } from './poster/PriceControls';
import { PosterPreview } from './poster/PosterPreview';
import { PosterInstructions } from './poster/PosterInstructions';
import { useDragControls } from '../hooks/useDragControls';
import { usePosterGeneration } from '../hooks/usePosterGeneration';
import { removeBackground as removeBackgroundUtil } from '../utils/backgroundRemover';

export function PosterGenerator() {
  // Template states
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0] || null);
  
  // Image and price states
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [priceColor, setPriceColor] = useState<string>('#ffffff');
  const [priceFontSize, setPriceFontSize] = useState<number>(40);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(true);
  const [bgScale, setBgScale] = useState<number>(1.0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Use custom hooks
  const { 
    isDraggingPrice, 
    isDraggingBg, 
    pricePosition, 
    bgPosition, 
    setBgPosition, 
    startDrag 
  } = useDragControls();
  
  const { canvasRef, downloadPoster } = usePosterGeneration({
    selectedTemplate,
    backgroundImage,
    price,
    pricePosition,
    priceColor,
    priceFontSize,
    bgPosition,
    bgScale,
    showTemplate
  });
  
  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageResult = e.target?.result as string;
        console.log("File uploaded successfully");
        setBackgroundImage(imageResult);
        // Reset position and scale when a new image is uploaded
        setBgPosition({ x: 0, y: 0 });
        setBgScale(1.0);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Background removal handler
  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    setError("");
    
    const result = await removeBackgroundUtil(backgroundImage, apiKey);
    
    if (result.success && result.data) {
      setBackgroundImage(result.data);
    } else if (result.error) {
      setError(result.error);
    }
    
    setIsProcessing(false);
  };
  
  // Image size adjustment
  const adjustImageSize = (factor: number) => {
    setBgScale(prev => {
      const newScale = prev * factor;
      // Limit zoom between 0.1 and 5
      return Math.max(0.1, Math.min(5, newScale));
    });
  };
  
  // Font size adjustment
  const adjustFontSize = (change: number) => {
    setPriceFontSize(prev => Math.max(10, Math.min(200, prev + change)));
  };
  
  // Center image
  const centerImage = () => {
    if (!selectedTemplate) return;
    
    setBgPosition({
      x: (selectedTemplate.width / 2) - (backgroundImage ? 250 : 0),
      y: (selectedTemplate.height / 2) - (backgroundImage ? 250 : 0)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 sm:mb-6">Generador de Carteles</h1>
        
        {/* Template selector */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl font-semibold mb-2 sm:mb-3">Selecciona una plantilla</h2>
          <TemplatePicker
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        </div>
        
        {/* Main controls */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Image panel */}
            <ImageControls
              backgroundImage={backgroundImage}
              apiKey={apiKey}
              isProcessing={isProcessing}
              error={error}
              setApiKey={setApiKey}
              removeBackground={handleRemoveBackground}
              adjustImageSize={adjustImageSize}
              centerImage={centerImage}
              setShowGrid={setShowGrid}
              showGrid={showGrid}
              setShowTemplate={setShowTemplate}
              showTemplate={showTemplate}
              handleFileUpload={handleFileUpload}
            />
            
            {/* Price panel */}
            <PriceControls
              price={price}
              priceColor={priceColor}
              priceFontSize={priceFontSize}
              backgroundImage={backgroundImage}
              setPrice={setPrice}
              setPriceColor={setPriceColor}
              adjustFontSize={adjustFontSize}
              setPriceFontSize={setPriceFontSize}
              downloadPoster={downloadPoster}
            />
          </div>
        </div>
        
        {/* Preview area */}
        <PosterPreview
          selectedTemplate={selectedTemplate}
          backgroundImage={backgroundImage}
          price={price}
          pricePosition={pricePosition}
          priceColor={priceColor}
          priceFontSize={priceFontSize}
          bgPosition={bgPosition}
          bgScale={bgScale}
          showGrid={showGrid}
          showTemplate={showTemplate}
          isDraggingPrice={isDraggingPrice}
          isDraggingBg={isDraggingBg}
          startDrag={startDrag}
        />
        
        {/* Instructions */}
        <PosterInstructions />
        
        {/* Hidden canvas for poster generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
