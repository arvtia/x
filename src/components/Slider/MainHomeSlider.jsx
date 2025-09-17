import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
// import "./styles.css"; // only if you create it

export default function MainHomeSlider() {
  return (
    <div className="max-w-4xl mx-auto p-2.5 bg-neutral-100 overflow-clip">
        <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="https://i.pinimg.com/1200x/87/b1/d1/87b1d17bb072e98281415bf24e6abf99.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://i.pinimg.com/1200x/87/b1/d1/87b1d17bb072e98281415bf24e6abf99.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://i.pinimg.com/1200x/87/b1/d1/87b1d17bb072e98281415bf24e6abf99.jpg" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}