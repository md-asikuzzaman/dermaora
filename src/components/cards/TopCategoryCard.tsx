"use client";

import Link from "next/link";
import type { Category } from "@prisma/client";

import SafeImage from "../SafeImage";

type Props = Pick<Category, "name" | "image" | "slug">;

const PopularCategoryCard = ({ name, image, slug }: Props) => {
  return (
    <Link
      href={`/category/${slug}`}
      prefetch={false}
      aria-label={`Explore ${name}`}
      className="group flex flex-col items-center"
    >
      {/* Circular Image */}
      <div className="relative aspect-square w-[78%] overflow-hidden rounded-tr-[50px] rounded-bl-[50px] bg-primary transition-colors duration-300 group-hover:bg-primary/90">
        <SafeImage
          src={image ?? ""}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105 sm:p-3"
        />
      </div>

      {/* Category Name */}
      <h3 className="mt-5 line-clamp-1 w-full px-2 text-center text-xl font-semibold tracking-tight text-[#15191F] transition-colors duration-300 group-hover:text-[#8A765D] sm:mt-6 sm:text-2xl">
        {name}
      </h3>
    </Link>
  );
};

export default PopularCategoryCard;
