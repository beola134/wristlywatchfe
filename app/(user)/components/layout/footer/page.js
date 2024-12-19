import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./footer.module.css";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDonghoOpen, setDonghoOpen] = useState(false);
  const [isCustomerCareOpen, setCustomerCareOpen] = useState(false);
  const [isUtilitiesOpen, setUtilitiesOpen] = useState(false);

  // Hàm xử lý sự kiện cuộn
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <>
      <footer>
        {/* Footer Top */}
        <div className="bg-[#796752] py-6 mt-10">
          <div className="container">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
              {/* Mua hàng Online */}
              <div className="relative pl-20 w-full sm:w-1/2 lg:w-[45%]  text-left mb-6 sm:mb-0 ">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 border border-white rounded-full flex items-center justify-center">
                  <i className="fa-regular fa-clock text-white text-lg"></i>
                </div>
                <div className="uppercase text-sm text-white mb-1">Mua hàng Online</div>
                <div className="text-sm text-white">Tất cả các ngày trong tuần</div>
              </div>

              <div className="hidden lg:block absolute left-[37.5%] transform -translate-x-1/2 w-px h-12 bg-[#ada090a1]"></div>

              {/* Hỗ trợ bán hàng và kỹ thuật */}
              <div className="relative pl-20 w-full sm:w-1/2  text-left mb-6 sm:mb-0">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 border border-white rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-phone text-white text-lg"></i>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  {/* Hỗ trợ bán hàng */}
                  <div className="w-full sm:w-1/2 text-left mb-4 sm:mb-0">
                    <div className="uppercase text-sm text-white mb-1">Hỗ trợ bán hàng</div>
                    <div className="text-sm text-white">084.5487.339</div>
                  </div>

                  {/* Hỗ trợ kỹ thuật */}
                  <div className="w-full sm:w-1/2 text-left">
                    <div className="uppercase text-sm text-white mb-1">Hỗ trợ kỹ thuật</div>
                    <div className="text-sm text-white">070.4434.597</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[30%] transform translate-x-1/2 w-px h-12 bg-[#ada090a1]"></div>

              {/* Email */}
              <div className="relative pl-20 w-full sm:w-1/2 lg:w-1/4 text-left">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 border border-white rounded-full flex items-center justify-center">
                  <i className="fa-regular fa-envelope text-white text-lg"></i>
                </div>
                <div className="uppercase text-sm text-white mb-1">Email</div>
                <div className="text-sm text-white">watchwristly@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="clear-both"></div>

        {/* Footer Center */}

        <div className="container">
          <div className="mt-10">
            <div className="lg:w-[calc(100%-300px)] w-full float-none lg:float-left md:float-left md:w-[100%]">
              <ul className="flex lg:flex-nowrap flex-wrap sm:justify-between">
                {/* Column 1 */}
                <li className=" lg:w-1/3 pr-2 mb-6 lg:mb-0 box-border">
                  <span
                    className="absolute hidden cursor-pointer p-4 right-0 top-0 bg-transparent bg-center bg-no-repeat"
                    style={{ backgroundImage: `url("/image/item/icon-click.png")` }}
                  ></span>
                  <Link className="block mb-4 text-[16px] font-bold uppercase text-[#796752]" href="#">
                    Về donghowristly
                  </Link>
                  <ul className="mt-1">
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Giới thiệu về donghowristly
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Triết lý kinh doanh
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Giấy chứng nhận và giải thưởng
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Khách hàng nói gì về chúng tôi
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Column 2 */}
                <li className=" lg:w-1/3 pr-2 mb-6 lg:mb-0 box-border">
                  <Link className="block mb-4 text-[16px] font-bold uppercase text-[#796752]" href="#">
                    Chăm sóc khách hàng
                  </Link>
                  <ul className="mt-1">
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Hướng dẫn mua hàng
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Chính sách đổi trả
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Chính sách bảo hành
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Dịch vụ và sửa chữa
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Hướng dẫn sử dụng đồng hồ
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Chính sách Khách hàng thân thiết
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Column 3 */}
                <li className="lg:w-1/3 pr-2 mb-6 lg:mb-0 box-border">
                  <Link className="block mb-4 text-[16px] font-bold uppercase text-[#796752]" href="#">
                    Tiện ích
                  </Link>
                  <ul className="mt-1">
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Tin Tức Và Sự Kiện
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Tuyển dụng
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Thanh Toán
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Mua hàng online
                      </Link>
                    </li>
                    <li>
                      <Link className="text-[15px] leading-[26px] text-[#796752]" href="#">
                        Mua Hàng Trả Góp
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="lg:w-[300px] w-full float-none lg:float-right mb-9">
              <div
                className="fb-page"
                data-href="https://www.facebook.com/profile.php?id=61566364566665"
                data-tabs="timeline"
                data-width="300"
                data-height="70"
                data-small-header="false"
                data-adapt-container-width="false"
                data-hide-cover="false"
                data-show-facepile="false"
              >
                <blockquote
                  cite="https://www.facebook.com/profile.php?id=61566364566665"
                  className="fb-xfbml-parse-ignore"
                >
                  <Link href="https://www.facebook.com/profile.php?id=61566364566665">Đồng Hồ Wristly</Link>
                </blockquote>
              </div>
              <div className="mt-[10px]">
                <div className="inline-block font-bold uppercase text-[#796752] text-[16px] mt-2 mr-5 phone-sm:hidden md:hidden">
                  Liên kết
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    className="phone-sm:hidden md:hidden w-[33px] h-[33px] flex items-center justify-center rounded-full bg-[#79675240] text-white"
                    href=""
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </Link>
                  <Link
                    className="phone-sm:hidden md:hidden w-[33px] h-[33px] flex items-center justify-center rounded-full bg-[#79675240] text-white"
                    href=""
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="clear-both"></div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-[#796752] text-[#f3f3f3] py-6 mt-9">
          <div className="container mx-auto flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2">
              <h3 className="font-semibold mb-3">CÔNG TY TNHH PHÁT TRIỂN WRISTLY</h3>
              <ul className="text-sm leading-6">
                <li>VPGD: Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Quận 12, TP.HCM</li>
                <li>Điện thoại: (08)4.5487.399</li>
                <li>MST: 0105545498 Cấp ngày: 03/10/2011 Nơi cấp: TP. Hồ Chí Minh</li>
              </ul>
            </div>

            <div className="md:w-2/5 mt-6 md:mt-0">
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <Link href="#" className="block w-36">
                  <img src="/image/item/dathongbao.png" alt="Bộ công thương chứng nhận" className="w-full" />
                </Link>
                <div className="text-right text-sm mt-5">&copy; WristlyWatch-All rights reserved</div>
              </div>

              <div className="mt-4">
                <Link
                  href="https://www.dmca.com/Protection/Status.aspx?ID=5cdfd6b9-54ac-4fa8-953f-524e3520dffa&refurl=https://donghoduyanh.com/"
                  className="block w-36 mx-auto md:mx-0"
                >
                  <img src="/image/item/dmca_protected_sml_120l.png" alt="" className="w-full" />
                </Link>
              </div>

              <div className="mt-6 text-center md:text-right text-sm">
                <div>
                  <Link href="#" className="text-white">
                    Longines
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    Tissot
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    MIDO
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    Frederique Constant
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    Seiko
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    Citizen
                  </Link>
                  <span className="mx-1">|</span>
                  <Link href="#" className="text-white">
                    Orient
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div id="fixedBar" style={{ position: "fixed", bottom: "168px", display: isVisible ? "block" : "none" }}>
            <div id="barInner">
              <button className={styles.goTop} href="" onClick={scrollToTop}>
                <i className="fa-solid fa-angles-up"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
