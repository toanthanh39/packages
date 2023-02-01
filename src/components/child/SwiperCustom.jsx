import { Pagination } from "antd";
import React from "react";
import Swiper, { A11y, Autoplay, Navigation, Scrollbar } from "swiper";

const SwiperCustom = ({
  children,
  perView = 10,
  space = 16,
  className = "",
  isNavigation = true,
  isPavigation = true,
  isScrollBar = true,
  isAutoPlay = false,
  responsive = {
    xs: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={space}
        slidesPerView={perView}
        navigation={isNavigation}
        autoplay={
          isAutoPlay
            ? {
                delay: 1500,
                disableOnInteraction: true,
              }
            : false
        }
        // autoplay={{
        //   delay: 1500,
        //   disableOnInteraction: true,
        // }}
        pagination={isNavigation ? { clickable: true } : false}
        scrollbar={isScrollBar ? { draggable: true } : false}
        breakpoints={{
          325: {
            slidesPerView: responsive.xs,
            spaceBetween: space,
          },
          768: {
            slidesPerView: responsive.md,
            spaceBetween: space,
          },
          1024: {
            slidesPerView: responsive.lg,
            spaceBetween: space,
          },
          1500: {
            slidesPerView: responsive.xl,
            spaceBetween: space,
          },
        }}
      >
        {children}
      </Swiper>
    </div>
  );
};

export default SwiperCustom;
