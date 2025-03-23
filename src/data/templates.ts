
import { Template } from '../types';

export const defaultTemplates: Template[] = [
  {
    name: "Oferta",
    thumbnail: "/src/1.png",
    overlay: "/src/1.svg",
    width: 1080,
    height: 1920,
    priceArea: { x: 540, y: 960, fontSize: 80 }
  },
  {
    name: "Nuevo",
    thumbnail: "/src/2.png", 
    overlay: "/src/2.svg",
    width: 1080,
    height: 1920,
    priceArea: { x: 540, y: 960, fontSize: 80 }
  },
  {
    name: "Descuento",
    thumbnail: "/src/3.png",
    overlay: "/src/3.svg",
    width: 1080,
    height: 1920,
    priceArea: { x: 540, y: 960, fontSize: 80 }
  }
];
