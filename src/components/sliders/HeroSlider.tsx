"use client";

import "swiper/css";
import "swiper/css/pagination";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SafeImage from "../SafeImage";
import { HeroSliderPuckSlideItem } from "../puck-ui/hero-slider.puck";

interface Props {
  data: HeroSliderPuckSlideItem[];
}

export default function HeroSlider({ data: slides }: Props) {
  return (
    <div className="group relative w-full">
      {/* LEFT ARROW */}
      <button
        className="swiper-prev border-site-gray-100 absolute top-1/2 -left-5 z-20 hidden -translate-y-1/2 cursor-pointer rounded-full border bg-white p-2 transition md:block"
        aria-label="Previous slide"
      >
        <ArrowRightIcon aria-hidden="true" />
      </button>

      {/* RIGHT ARROW */}
      <button
        className="swiper-next border-site-gray-100 absolute top-1/2 -right-5 z-20 hidden -translate-y-1/2 rotate-180 cursor-pointer rounded-full border bg-white p-2 transition md:block"
        aria-label="Next slide"
      >
        <ArrowLeftIcon aria-hidden="true" />
      </button>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        className="mySwiper rounded-md md:rounded-2xl"
      >
        {/* Responsive Hero Slider */}
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.url || "/"} className="block w-full">
              <div className="w-full">
                <SafeImage
                  src={slide.photo}
                  alt={`Slide image ${index + 1}`}
                  width={1600}
                  height={640}
                  sizes="100vw"
                  className="h-auto w-full rounded-sm object-contain md:rounded-md"
                  unoptimized
                  preload
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
