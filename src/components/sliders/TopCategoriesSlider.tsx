"use client";

import "swiper/css";
import "swiper/css/navigation";

import { motion } from "motion/react";
import { useRef } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useWindowWidth } from "@/hooks/useWindowWidth";
import type { Category } from "@prisma/client";
import PopularCategoryCard from "../cards/TopCategoryCard";

interface Props {
  items: Category[];
}

export default function PopularCategoriesSlider({ items }: Props) {
  const ref = useRef(null);
  const width = useWindowWidth();

  let limit = 2;
  if (width >= 640 && width < 1024) limit = 4;
  if (width >= 1024) limit = 6;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 8 }, // small tablets
          768: { slidesPerView: 4, spaceBetween: 12 }, // medium tablets
          1024: { slidesPerView: 6, spaceBetween: 12 }, // large devices
        }}
        className="w-full"
        autoplay={false}
      >
        {items.map((slide, i) => (
          <SwiperSlide key={i}>
            {i < limit ? (
              <motion.div
                ref={ref}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0 }}
              >
                <PopularCategoryCard {...slide} />
              </motion.div>
            ) : (
              <PopularCategoryCard {...slide} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
