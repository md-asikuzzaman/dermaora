import { Prisma } from "@prisma/client";

export type ProductDetails = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    reviews: true;
  };
}>;
