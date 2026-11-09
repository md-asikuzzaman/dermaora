"use client";

import { motion } from "motion/react";
import Link from "next/link";
import SafeImage from "../SafeImage";
import { BannerAdsPuckBannerItem } from "../puck-ui/banner-ads.puck";

interface Props extends BannerAdsPuckBannerItem {
  i: number;
}

const FeaturedCard = ({ photo, url, i }: Props) => {
  return (
    <Link prefetch={false} href={url} className="w-full">
      <motion.div
        className="group relative flex flex-col items-center justify-between"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        viewport={{ once: true, amount: 0 }}
      >
        {/* Card Image */}
        <SafeImage
          src={photo as string}
          alt="Category"
          width={382}
          height={452}
          className="h-auto w-full transform rounded-lg object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 md:rounded-2xl"
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
        />
      </motion.div>
    </Link>
  );
};

export default FeaturedCard;
