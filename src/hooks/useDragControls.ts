
import { useState, useRef, useCallback, useEffect } from 'react';
import { Position } from '../types';

export function useDragControls() {
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [pricePosition, setPricePosition] = useState<Position>({ x: 200, y: 700 });
  const [bgPosition, setBgPosition] = useState<Position>({ x: 0, y: 0 });
  
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  
  // Handler for starting drag
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

  // Handler for dragging movement
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

  // Handler for ending drag
  const endDrag = useCallback(() => {
    setIsDraggingPrice(false);
    setIsDraggingBg(false);
  }, []);
  
  // Set up and clean up event listeners
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
  
  return {
    isDraggingPrice,
    isDraggingBg,
    pricePosition,
    bgPosition,
    setPricePosition,
    setBgPosition,
    startDrag
  };
}
