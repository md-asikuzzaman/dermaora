export const product: ProductDetails = {
  id: "1",
  slug: "advanced-snail-96-mucin-power-essence",
  name: "Advanced Snail 96 Mucin Power Essence",
  brand: "COSRX",
  category: "Skincare",
  rating: 4.8,
  reviews: 248,
  price: 1450,
  oldPrice: 1850,
  stock: 20,
  description:
    "A lightweight hydrating essence formulated with 96% snail secretion filtrate to deeply hydrate, repair and revitalize your skin.",
  images: [
    "/products/snail-essence-1.webp",
    "/products/snail-essence-2.webp",
    "/products/snail-essence-3.webp",
    "/products/snail-essence-4.webp",
  ],
  ingredients:
    "Snail Secretion Filtrate, Sodium Hyaluronate, Betaine and other skin-conditioning ingredients.",
  usage:
    "After cleansing and toning, apply an appropriate amount to your face. Gently pat until fully absorbed. Follow with moisturizer.",
};

export interface ProductDetails {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  stock: number;
  description: string;
  images: string[];
  ingredients: string;
  usage: string;
}
