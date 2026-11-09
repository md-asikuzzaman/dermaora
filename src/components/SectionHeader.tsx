"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import Heading from "./Heading";

interface Props extends React.ComponentProps<"div"> {
  title: string;
  subTitle?: string;
  link?: string;
  buttonText?: string;
  icon?: string;
  className?: string;
  linkStyle?: string;
}

const SectionHeader = ({
  title,
  link,
  icon,
  className,
  linkStyle,
  buttonText,
}: Props) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={cn(
        "mb-5 flex w-full flex-wrap items-center justify-between gap-3 md:mb-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        {icon && (
          <div className="relative h-6 w-6 md:h-10 md:w-10">
            <Image
              src={icon}
              alt={title}
              fill
              loading="lazy"
              unoptimized
              sizes="(min-width: 768px) 40px, 24px"
            />
          </div>
        )}

        <Heading level="h4" variant="semibold">
          {title}
        </Heading>
      </div>
      {buttonText && (
        <Link
          prefetch={false}
          href={link || ""}
          className={cn(
            "text-site-primary-500 hover:bg-site-primary-50/80 dark:hover:bg-site-primary-100 group flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors md:text-sm",
            linkStyle,
          )}
        >
          {buttonText ?? "View All"}
          <GoArrowRight
            className="h-2.5 w-2.5 transition-all group-hover:translate-x-1 md:h-6 md:w-6"
            strokeWidth={0.3}
          />
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeader;
