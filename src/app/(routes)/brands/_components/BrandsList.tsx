"use client";

import SafeImage from "@/components/SafeImage";
import { Brand } from "@prisma/client";
import { motion } from "motion/react";
import Link from "next/link";

interface BrandsListProps {
  brands: Brand[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const BrandsList = ({ brands }: BrandsListProps) => {
  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {brands.map((brand) => (
          <motion.div
            key={brand.id}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Link
              href={`/brands/${brand.slug}`}
              className="group flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
            >
              <SafeImage
                src={brand.logo as string}
                alt={brand.name}
                width={180}
                height={100}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {brands.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No brands available.
        </div>
      )}
    </div>
  );
};

export default BrandsList;
