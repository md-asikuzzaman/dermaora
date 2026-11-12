"use client";

import { motion } from "motion/react";

interface Props {
  title: string;
  description: string;
}

const AnimatedHeader = ({ title, description }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-center"
    >
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
    </motion.div>
  );
};

export default AnimatedHeader;
