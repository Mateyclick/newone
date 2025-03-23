// Types for the template configuration
export interface Template {
  name: string;
  thumbnail: string;
  overlay: string;
  width: number;
  height: number;
  priceArea: {
    x: number;
    y: number;
    fontSize: number;
  };
  logo?: string;
}

export interface Position {
  x: number;
  y: number;
}