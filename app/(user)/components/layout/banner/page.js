"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import styles from "./banner.module.css";
import classNames from "classnames/bind";
import Script from "next/script";
import BannerSlide1 from "../bannerslide1/page";
import BannerSlide2 from "../bannerslide2/page";
import Link from "next/link";

const cx = classNames.bind(styles);
export default function Banner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
    autoplaySpeed: 3000,
  };
  const [slider, setSlider] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (slider) {
        next();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [slider]);
  const [thuongHieu, setThuonghieu] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/thuonghieu/allthuonghieu"
      );
      const data = await response.json();
      setThuonghieu(data.th);
    };

    fetchData();
  }, []);
  return (
    <>
      <BannerSlide1 />
      <section
        className={cx(
          "section-banner",
          "bg-cover bg-center text-center text-white relative mt-[-5px] mb-[-20px] ",
          "h-[80px] sm:h-[120px] md:h-[140px] lg:h-[200px]"
        )}
        style={{ backgroundImage: "url(/image/item/background_banner.jpg)" }}
      >
        <div
          className={cx(
            "typewriter",
            "inline-block font-bold lg:mt-[40px] mt-5  "
          )}
        >
          <p
            className={cx(
              "typewriter1",
              "whitespace-nowrap text-[6px] sm:text-[12px] md:text-[18px] lg:text-[22px] overflow-hidden inline-block"
            )}
          >
            WRISTLY - SỐ LƯỢNG ĐỒNG HỒ ĐA DẠNG
          </p>
        </div>
      </section>

      <section
        className={cx(
          "icon-section",
          "relative lg:max-w-[1170px] max-w-[80%]  lg:top-[-60px]  sm:top-[-20px] top-[-2px] mx-auto flex justify-center gap-[4%]"
        )}
      >
        <div
          className={cx(
            "icon-container",
            "w-[33%]  transition-transform duration-300 ease-in-out",
            "hover:translate-y-[-10px] hover:text-[#98792c]"
          )}
        >
          <div
            className={cx(
              "icon1",
              "lg:border-[10px] md:border-[8px] sm:border-[6px] border-[4px] border-[#777] lg:w-[140px] lg:h-[140px] w-[40%] aspect-square  bg-black rounded-full flex justify-center items-center mx-auto",
              "hover:bg-[#baa773]"
            )}
          >
            <img
              src="/image/item/icons/icons_1.png"
              alt="Icon 1"
              className={cx("w-[70%] h-[70%]")}
              loading="lazy"
            />
          </div>
          <div className={cx("text-center mt-[30px] text-title")}>
            <p className={cx("font-bold md:block hidden")}>PHÒNG BẢO HÀNH</p>
            <small>ĐẠT TIÊU CHUẨN THỤY SĨ</small>
          </div>
        </div>

        <div
          className={cx(
            "icon-container",
            "w-[33%]  transition-transform duration-300 ease-in-out",
            "hover:translate-y-[-10px] hover:text-[#98792c]"
          )}
        >
          <div
            className={cx(
              "icon1",
              "lg:border-[10px] md:border-[8px] sm:border-[6px] border-[4px]  bg-[#D0A738] border-[#777] lg:w-[140px] lg:h-[140px] w-[40%] aspect-square  rounded-full flex justify-center items-center mx-auto",
              "hover:bg-[#baa773]"
            )}
          >
            <img
              src="/image/item/icons/icon_2.png"
              alt="Icon 2"
              className={cx("w-[70%] h-[70%]")}
              loading="lazy"
            />
          </div>
          <div className={cx("text-center mt-[30px] ")}>
            <p className={cx("font-bold  md:block hidden")}>
              THƯƠNG HIỆU UY TÍN
            </p>
            <small>LÂU ĐỜI 70 NĂM</small>
          </div>
        </div>

        <div
          className={cx(
            "icon-container",
            "w-[33%] transition-transform duration-300 ease-in-out",
            "hover:translate-y-[-10px] hover:text-[#98792c]"
          )}
        >
          <div
            className={cx(
              "icon1",
              "lg:border-[10px] md:border-[8px] sm:border-[6px] border-[4px] border-[#777] lg:w-[140px] lg:h-[140px]  w-[40%] aspect-square  bg-black rounded-full flex justify-center items-center mx-auto",
              "hover:bg-[#baa773]"
            )}
          >
            <img
              src="/image/item/icons/icon_3.png"
              alt="Icon 3"
              className={cx("w-[70%] h-[70%]")}
              loading="lazy"
            />
          </div>
          <div className={cx("text-center mt-[30px] uppercase ")}>
            <p className={cx("font-bold  md:block hidden ")}>Bán hàng fake</p>
            <small>Đền gấp 20 lần</small>
          </div>
        </div>
      </section>

      <section
        className={cx(
          "section-img",
          "flex justify-center items-center gap-[10px] lg:max-w-[1170px] max-w-[80%] lg:gap-[40px] mx-auto mt-[20px] mb-[30px]",
          "max-w-[1170px]"
        )}
      >
        <div className={cx("overflow-hidden")}>
          <img
            src="/image/banner/longines-sale_1.jpg"
            alt="Longines Sale Banner"
            loading="lazy"
            className={cx(
              "w-[600px] transition-transform duration-500 ease-in-out",
              "hover:scale-[1.05]"
            )}
          />
        </div>
        <div className={cx("overflow-hidden")}>
          <img
            src="/image/banner/tissot gentleman.jpg"
            alt="Tissot Banner"
            className={cx(
              "w-[600px] transition-transform duration-500 ease-in-out",
              "hover:scale-[1.05]"
            )}
            loading="lazy"
          />
        </div>
      </section>

      <section
        className={cx(
          "brand",
          " m-h-[120px] lg:max-w-[1170px] max-w-[80%] overflow-hidden my-[30px] justify-center items-center mx-auto border-t-[0.5px] border-b-[0.5px] border-[#bfb3b3]"
        )}
      >
        <div className={cx("pav-slide-content")}>
          <div
            className={cx(
              "fs-slider-home",
              "fs-slider-home-content",
              "brand-slider"
            )}
          >
            <Slider {...settings}>
              {thuongHieu.filter((item) => item.thuong_hieu !== "RHYTHM").map((item, index) => (
                <Link
                  href={`/components/components-thuonghieu/chitietthuonghieu/${item.thuong_hieu}`}
                >
                  <div
                    className={cx(
                      "item",
                      "p-[5%] flex justify-center items-center m-h-[60px]"
                    )}
                    key={item._id}
                  >
                    <img
                      src={`http://localhost:5000/images/${item.hinh_anh}`}
                      alt={item.thuong_hieu}
                      style={{
                        objectFit: "cover",
                        width: "70%",
                        height: "70%",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      <BannerSlide2 />

      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        strategy="lazyOnload"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
      />
    </>
  );
}
