export interface CartProductInput {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  thumbnail: string | null;
  stock: number;
}

export interface CartItem extends CartProductInput {
  quantity: number;
}

export interface WishlistProductInput {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  thumbnail: string | null;
  rating: number | null;
}

export type WishlistItem = WishlistProductInput;
