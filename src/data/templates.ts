import { Template } from '../types';

export const defaultTemplates: Template[] = [
  {
    name: "Template 1",
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&h=200&fit=crop",
    overlay: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=800&fit=crop",
    width: 600,
    height: 800,
    priceArea: { x: 300, y: 720, fontSize: 40 }
  },
  {
    name: "Template 2",
    thumbnail: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=200&h=200&fit=crop",
    overlay: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=600&h=800&fit=crop",
    width: 600,
    height: 800,
    priceArea: { x: 300, y: 80, fontSize: 40 }
  }
];