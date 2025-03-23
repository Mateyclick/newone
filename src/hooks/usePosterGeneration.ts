
import { useRef } from 'react';
import { Template, Position } from '../types';

interface UsePosterGenerationProps {
  selectedTemplate: Template | null;
  backgroundImage: string;
  price: string;
  pricePosition: Position;
  priceColor: string;
  priceFontSize: number;
  bgPosition: Position;
  bgScale: number;
  showTemplate: boolean;
}

export function usePosterGeneration({
  selectedTemplate,
  backgroundImage,
  price,
  pricePosition,
  priceColor,
  priceFontSize,
  bgPosition,
  bgScale,
  showTemplate
}: UsePosterGenerationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function to generate the poster on canvas
  const generatePoster = () => {
    if (!selectedTemplate || !backgroundImage || !canvasRef.current) {
      console.log("Missing required elements for poster generation");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

    // Set canvas dimensions
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;
    console.log(`Canvas set to ${canvas.width}x${canvas.height}`);

    // Create and load background image
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous"; // Add this to handle CORS
    bgImg.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw with proper position and scaling
      console.log(`Drawing background image with position: ${bgPosition.x},${bgPosition.y} and scale: ${bgScale}`);
      
      // Calculate scaled dimensions
      const scaledWidth = bgImg.width * bgScale;
      const scaledHeight = bgImg.height * bgScale;
      
      // Draw image with position and scale
      ctx.drawImage(
        bgImg, 
        bgPosition.x, bgPosition.y, 
        scaledWidth, scaledHeight
      );
      
      // Draw overlay if visible
      if (showTemplate && selectedTemplate.overlay) {
        const overlay = new window.Image();
        overlay.crossOrigin = "anonymous"; // Add this to handle CORS
        overlay.onload = () => {
          console.log("Drawing template overlay");
          ctx.drawImage(overlay, 0, 0, selectedTemplate.width, selectedTemplate.height);
          
          // Draw price text
          if (price) {
            drawPriceText();
          }
        };
        overlay.src = selectedTemplate.overlay;
        overlay.onerror = (e) => {
          console.error("Error loading overlay:", e);
          // Still draw price if overlay fails
          if (price) {
            drawPriceText();
          }
        };
      } else if (price) {
        // If template is hidden but there's a price, draw it anyway
        drawPriceText();
      }
    };
    
    const drawPriceText = () => {
      console.log(`Drawing price "${price}" at position: ${pricePosition.x},${pricePosition.y} with color: ${priceColor}`);
      ctx.fillStyle = priceColor;
      ctx.font = `bold ${priceFontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; // Add this for better vertical alignment
      ctx.fillText(price, pricePosition.x, pricePosition.y);
    };
    
    bgImg.src = backgroundImage;
    bgImg.onerror = (e) => {
      console.error("Error loading background image:", e);
    };
  };

  // Function to download the generated poster
  const downloadPoster = () => {
    console.log("Generating and downloading poster");
    // First generate the poster
    generatePoster();
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      try {
        const link = document.createElement('a');
        link.download = 'poster.png';
        link.href = canvas.toDataURL('image/png');
        console.log("Poster generated, triggering download");
        link.click();
      } catch (error) {
        console.error("Error during download:", error);
      }
    }, 500); // Small delay to ensure canvas is ready
  };
  
  return {
    canvasRef,
    generatePoster,
    downloadPoster
  };
}
