"use client";

import "swiper/css";
import "swiper/css/navigation";

import { motion } from "motion/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../ProductCard";
import { Product } from "@prisma/client";

interface Props {
  data: Product[];
}

export default function ProductShowSlider({ data }: Props) {
  //   const sessionContext = useOptionalSession();
  //   const user = sessionContext?.session;
  //   const { guestId } = useGuestUserId();
  //   const userId = user?.id ? user?.id : guestId;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={8}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 8 },
          768: { slidesPerView: 4, spaceBetween: 9 },
          1024: { slidesPerView: 5, spaceBetween: 10 },
        }}
        className="w-full"
        autoplay={false}
      >
        {data.map((slide, i) => (
          <SwiperSlide key={i} style={{ height: "auto" }}>
            {i < 5 ? (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <ProductCard {...slide} />
              </motion.div>
            ) : (
              <ProductCard {...slide} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
