"use client";

import "swiper/css";
import "swiper/css/navigation";

import { motion } from "motion/react";
import { useRef } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import PopularBrandCard from "../cards/PopularBrandCard";
import { Brand } from "@prisma/client";
import { useWindowWidth } from "@/hooks/useWindowWidth";

interface Props {
  items: Brand[];
}

export default function PopularBrandSlider({ items }: Props) {
  const ref = useRef(null);
  const width = useWindowWidth();

  /** Animation slide settings */
  let limit = 3;
  if (width >= 640 && width < 1024) limit = 3;
  if (width >= 1024) limit = 4;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={6}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 2.2, spaceBetween: 6 },
          768: { slidesPerView: 3, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
        autoplay={false}
        className="h-auto w-full"
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
                <PopularBrandCard {...slide} />
              </motion.div>
            ) : (
              <PopularBrandCard {...slide} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
