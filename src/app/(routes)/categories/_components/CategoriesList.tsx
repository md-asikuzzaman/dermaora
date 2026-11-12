"use client";

import SafeImage from "@/components/SafeImage";
import { Category } from "@prisma/client";
import { motion } from "motion/react";
import Link from "next/link";

interface CategoriesListProps {
  categories: Category[];
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
    y: 25,
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

const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <Link
              href={`/categories/${category.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <SafeImage
                src={category.image as string}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-center text-sm font-medium tracking-wide text-white sm:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {categories.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No categories available.
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
