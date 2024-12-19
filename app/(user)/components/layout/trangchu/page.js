"use client";
import React, { useEffect, useState } from "react";
import styles from "./trangchu.module.css";
import Slider from "react-slick";
import VoucherModal from "../dieukien/page";
import Banner from "../banner/page";
import Link from "next/link";
import classNames from "classnames/bind";
import { toast,ToastContainer } from 'react-toastify';
const cx = classNames.bind(styles);

export default function Main() {
  const [activeTab, setActiveTab] = useState("tab1");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [firstSlider, setFirstSlider] = useState(null);
  const [secondSlider, setSecondSlider] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const firstSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const secondSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const nextFirst = () => {
    if (firstSlider) {
      firstSlider.slickNext();
    }
  };

  const prevFirst = () => {
    if (firstSlider) {
      firstSlider.slickPrev();
    }
  };

  const nextSecond = () => {
    if (secondSlider) {
      secondSlider.slickNext();
    }
  };

  const prevSecond = () => {
    if (secondSlider) {
      secondSlider.slickPrev();
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (firstSlider) {
        nextFirst();
      }
      if (secondSlider) {
        nextSecond();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [firstSlider, secondSlider]);

  const [productsNam, setProductsNam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/product/allsp/gioitinh-nam10sp"
      );
      const data = await response.json();
      setProductsNam(data.products);
    };

    fetchData();
  }, []);

  const [productsNu, setProductsNu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/product/allsp/gioitinh-nu10sp"
      );
      const data = await response.json();
      setProductsNu(data.products);
    };

    fetchData();
  }, []);

  const [productsDoi, setProductsDoi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/product/allsp/doi10sp"
      );
      const data = await response.json();
      setProductsDoi(data.products);
    };

    fetchData();
  }, []);

  const [productsNewNam, setProductsNewNam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/product/limit/gioitinh-nam"
      );
      const data = await response.json();
      setProductsNewNam(data.products);
    };

    fetchData();
  }, []);

  const [productsNewNu, setProductsNewNu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/product/limit/gioitinh-nu"
      );
      const data = await response.json();
      setProductsNewNu(data.products);
    };

    fetchData();
  }, []);

  const [productsNewDoi, setProductsNewDoi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/product/limit/doi");
      const data = await response.json();
      setProductsNewDoi(data.products);
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/thuonghieu/allthuonghieu"
      );
      const data = await response.json();
      setCategory(data.th);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/voucher/getvoucher");
      const data = await response.json();
      setVouchers(data.vouchers);
    };
    fetchData();
  }, []);
  const [vouchers, setVouchers] = useState([]);
  // tính % sản phẩm
  const roundDiscount = (discountPercentage) => {
    const discountLevels = [10, 15, 20, 25, 30, 40, 50];
    return discountLevels.reduce((prev, curr) =>
      Math.abs(curr - discountPercentage) < Math.abs(prev - discountPercentage)
        ? curr
        : prev
    );
  };
  const handleCopy = (voucherCode) => {
    navigator.clipboard
      .writeText(voucherCode)
      .then(() => {
        toast.success(`Mã ${voucherCode} đã được sao chép thành công!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch(() => {
        toast.error("Không thể sao chép mã. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };
  return (
    <>
      <Banner />
       <ToastContainer />
      <section className={cx("max-w-[1170px")}>
        <div className={cx("w-[80%] lg:w-[1170px] mx-auto mt-[40px] mb-[5px]")}>
        <p className="text-center text-2xl md:text-3xl">ƯU ĐÃI</p> <br />{" "}
          <br />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vouchers.map((voucher) => (
              <div
                key={voucher._id}
                className="bg-white border border-gray-300 rounded-lg p-2 shadow-md text-center"
              >
                <h4 className="text-[16px] text-red-600 font-semibold p-2">
                  VOUCHER
                </h4>
                <p className="text-sm text-gray-600 p-2">
                  Nhập mã{" "}
                  <span className={styles.code}>{voucher.ma_voucher}</span>
                  <br />
                  <span className={styles.textClamp}>{voucher.mo_ta}₫</span>
                  
                </p>
                <div className="flex justify-between items-center mt-4">
                  {voucher.so_luong > 0 ? (
                    <button
                      className={styles.copyBtn}
                      onClick={() => handleCopy(voucher.ma_voucher)}
                    >
                      Copy
                    </button>
                  ) : (
                    <button className={`${styles.copyBtn} ${styles.disabled} `}>
                      Hết Voucher
                    </button>
                  )}
                  <a
                    onClick={() => {
                      setSelectedVoucherId(voucher._id);
                      setModalOpen(true);
                    }}
                    className={styles.conditions}
                  >
                    Điều kiện
                  </a>
                </div>
                <VoucherModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setModalOpen(false)}
                  voucherId={selectedVoucherId}
                />
              </div>
            ))}
          </div>
          <br /> <br /> <br />
          <p
            className={cx(
              "text-center text-[16px] sm:text-[18px] md:text-[22px] lg:text-[30px] max-w-[1170px]"
            )}
          >
            TẤT CẢ SẢN PHẨM
          </p>
          <div
            className={cx(
              "overflow-hidden mb-[20px]   sm:mb-[40px] md:mb-[60px] text-center flex items-center justify-center gap-[3%] uppercase  text-[10px] md:text-[14px] "
            )}
          >
            <p
              className={
                activeTab === "tab1"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px]  mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px]   transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab1")}
            >
              ĐỒNG HỒ NAM
            </p>

            <p
              className={
                activeTab === "tab2"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px]  text-[10px] md:text-[14px] mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px]  text-[10px] md:text-[14px] mx-[5px] transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab2")}
            >
              ĐỒNG HỒ NỮ
            </p>

            <p
              className={
                activeTab === "tab3"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px]  transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab3")}
            >
              ĐỒNG HỒ ĐÔI
            </p>
            <span className={cx("mb-[-60px] absolute border-t border-gray-300 lg:block hidden lg:w-full w-[80%] opacity-50 mx-auto max-w-[1170px]")}/>
          </div>
          
          <div>
            {activeTab === "tab1" && (
              
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                )}
              >
                {productsNam.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                  {item.gia_giam > 0 && (<div
                    className={cx(
                      "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                    )}
                  >
                    -{" "}
                    {roundDiscount(
                      Math.round(
                        ((item.gia_san_pham - item.gia_giam) /
                          item.gia_san_pham) *
                          100
                      )
                    )}
                    %
                  </div>)}
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      {item.gia_giam > 0 ? (
                        <>
                          <small
                            className={cx(
                              "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                            )}
                            style={{
                              textDecoration: "line-through",
                              color: "#B1B1B1",
                              fontSize: "15px",
                            }}
                          >
                            Giá: {formatCurrency(item.gia_san_pham)}
                          </small>
                          <br />
                          <span className={cx("text-red-600 font-bold text-[16px]")}>
                            Giá KM: {formatCurrency(item.gia_giam)}
                          </span>
                        </>
                      ) : (
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_san_pham)}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center my-[50px] relative hidden lg:flex left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78]  w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonam">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NAM
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "p-[5px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonam">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NAM
                      </b>
                    </Link>
                  </p>
                </div>
                
              </div>
            )}
            {activeTab === "tab2" && (
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                )}
              >
                {productsNu.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                    {item.gia_giam > 0 && (<div
                      className={cx(
                        "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                      )}
                    >
                      -{" "}
                      {roundDiscount(
                        Math.round(
                          ((item.gia_san_pham - item.gia_giam) /
                            item.gia_san_pham) *
                            100
                        )
                      )}
                      %
                    </div>)}
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                    {item.gia_giam > 0 ? (
                      <>
                        <small
                          className={cx(
                            "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                          )}
                          style={{
                            textDecoration: "line-through",
                            color: "#B1B1B1",
                            fontSize: "15px",
                          }}
                        >
                          Giá: {formatCurrency(item.gia_san_pham)}
                        </small>
                        <br />
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_giam)}
                        </span>
                      </>
                    ) : (
                      <span className={cx("text-red-600 font-bold text-[16px]")}>
                        Giá KM: {formatCurrency(item.gia_san_pham)}
                      </span>
                    )}
                     
                    </p>
                    
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center hidden lg:flex my-[50px] relative  left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px] mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78] w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonu">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NỮ
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "p-[5px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonu">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NỮ
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            )}
            {activeTab === "tab3" && (
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                )}
              >
                {productsDoi.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                    {item.gia_giam > 0 && (<div
                      className={cx(
                        "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                      )}
                    >
                      -{" "}
                      {roundDiscount(
                        Math.round(
                          ((item.gia_san_pham - item.gia_giam) /
                            item.gia_san_pham) *
                            100
                        )
                      )}
                      %
                    </div>)}
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                    {item.gia_giam > 0 ? (
                      <>
                        <small
                          className={cx(
                            "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                          )}
                          style={{
                            textDecoration: "line-through",
                            color: "#B1B1B1",
                            fontSize: "15px",
                          }}
                        >
                          Giá: {formatCurrency(item.gia_san_pham)}
                        </small>
                        <br />
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_giam)}
                        </span>
                      </>
                    ) : (
                      <span className={cx("text-red-600 font-bold text-[16px]")}>
                        Giá KM: {formatCurrency(item.gia_san_pham)}
                      </span>
                    )}
                     
                    </p>
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center hidden lg:flex my-[50px] relative  left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px] mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78] w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghodoi">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ ĐÔI
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "p-[5px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghodoi">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ ĐÔI
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section>
        <div className={cx("w-[80%] lg:w-[1170px] mx-auto mt-[40px] mb-[5px]")}>
          <p
            className={cx(
              "text-center text-[16px] sm:text-[18px] md:text-[22px] lg:text-[30px]"
            )}
          >
            SẢN PHẨM MỚI
          </p>
          <div
            className={cx(
              "overflow-hidden mb-[20px]  sm:mb-[40px] md:mb-[60px] text-center flex items-center justify-center gap-[3%] uppercase  text-[10px] md:text-[14px] "
            )}
          >
            <p
              className={
                activeTab === "tab1"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px]  mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px]   transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab1")}
            >
              ĐỒNG HỒ NAM
            </p>

            <p
              className={
                activeTab === "tab2"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px]  text-[10px] md:text-[14px] mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px]  text-[10px] md:text-[14px] mx-[5px] transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab2")}
            >
              ĐỒNG HỒ NỮ
            </p>

            <p
              className={
                activeTab === "tab3"
                  ? "text-[#796752] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px] border-b-2 border-[#796752]"
                  : "text-[#777777] relative cursor-pointer pt-[30px] pb-[10px] text-[10px] md:text-[14px] mx-[5px] transition-all duration-300 ease-in"
              }
              onClick={() => handleTabClick("tab3")}
            >
              ĐỒNG HỒ ĐÔI
            </p>
            <span className={cx("mb-[-60px] absolute border-t border-gray-300 lg:block hidden lg:w-full w-[80%] opacity-50 mx-auto max-w-[1170px]")}/>
          </div>
          
          <div>
            {activeTab === "tab1" && (
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                )}
              >
                {productsNewNam.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                    {item.gia_giam > 0 && (<div
                      className={cx(
                        "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                      )}
                    >
                      -{" "}
                      {roundDiscount(
                        Math.round(
                          ((item.gia_san_pham - item.gia_giam) /
                            item.gia_san_pham) *
                            100
                        )
                      )}
                      %
                    </div>)}
                    <div className={cx("relative")}>
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <div
                      className={cx(
                        "absolute lg:right-[10px] right-0 bottom-0 mr-[0px] text-white bg-red-500 px-[10px] py-[2px] rounded-[2px] z-[2] mb-2"
                      )}
                    >
                      New
                    </div>
                    </div>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                    {item.gia_giam > 0 ? (
                      <>
                        <small
                          className={cx(
                            "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                          )}
                          style={{
                            textDecoration: "line-through",
                            color: "#B1B1B1",
                            fontSize: "15px",
                          }}
                        >
                          Giá: {formatCurrency(item.gia_san_pham)}
                        </small>
                        <br />
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_giam)}
                        </span>
                      </>
                    ) : (
                      <span className={cx("text-red-600 font-bold text-[16px]")}>
                        Giá KM: {formatCurrency(item.gia_san_pham)}
                      </span>
                    )}
                     
                    </p>
                   
                    
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center hidden lg:flex my-[50px] relative  left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px] mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78] w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nam">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NAM MỚI
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "p-[5px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nam">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NAM MỚI
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            )}
            {activeTab === "tab2" && (
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                )}
              >
                {productsNewNu.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                    {item.gia_giam > 0 && (<div
                      className={cx(
                        "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                      )}
                    >
                      -{" "}
                      {roundDiscount(
                        Math.round(
                          ((item.gia_san_pham - item.gia_giam) /
                            item.gia_san_pham) *
                            100
                        )
                      )}
                      %
                    </div>)}
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                    {item.gia_giam > 0 ? (
                      <>
                        <small
                          className={cx(
                            "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                          )}
                          style={{
                            textDecoration: "line-through",
                            color: "#B1B1B1",
                            fontSize: "15px",
                          }}
                        >
                          Giá: {formatCurrency(item.gia_san_pham)}
                        </small>
                        <br />
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_giam)}
                        </span>
                      </>
                    ) : (
                      <span className={cx("text-red-600 font-bold text-[16px]")}>
                        Giá KM: {formatCurrency(item.gia_san_pham)}
                      </span>
                    )}
                     
                    </p>
                    
                    <div
                      className={cx(
                        "absolute mb-2 right-[18px] top-[260px] mr-[0px] text-white bg-red-500 px-[10px] py-[2px] rounded-[2px] z-[2]"
                      )}
                    >
                      New
                    </div>
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center hidden lg:flex  my-[50px] relative  left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px] mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78] w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nữ">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NỮ MỚI
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "p-[5px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Nữ">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ NỮ MỚI
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            )}
            {activeTab === "tab3" && (
              <div
                className={cx(
                  "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px]  mx-auto gap-y-[30px]"
                )}
              >
                {productsNewDoi.map((item) => (
                  <div key={item._id} className={cx("text-center relative")}>
                    {item.gia_giam > 0 && (<div
                      className={cx(
                        "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                      )}
                    >
                      -{" "}
                      {roundDiscount(
                        Math.round(
                          ((item.gia_san_pham - item.gia_giam) /
                            item.gia_san_pham) *
                            100
                        )
                      )}
                      %
                    </div>)}
                    <Link href={`/components/product-detail/${item._id}`}>
                      <img
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt={item.ten_san_pham}
                        className={cx(
                          "relative transition-transform duration-500 ease-in-out z-[1] mx-auto"
                        )}
                      />
                    </Link>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <h3 className={cx("text-gray-500 text-[14px]")}>
                        {item.ten_san_pham}
                      </h3>
                    </p>
                    <br />
                    <b
                      className={cx(
                        "text-black font-semibold text-[17px] mb-2"
                      )}
                    >
                      {item.ma_san_pham}
                    </b>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                      <small
                        className={cx(
                          "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                        )}
                      >
                        {item.loai} | {item.duong_kinh}
                      </small>
                    </p>
                    <p
                      className={cx(
                        "text-black no-underline transition-colors duration-300 text-center text-[14px] leading-[25px]"
                      )}
                    >
                    {item.gia_giam > 0 ? (
                      <>
                        <small
                          className={cx(
                            "text-[12px] uppercase text-gray-500 mb-1 inline-block"
                          )}
                          style={{
                            textDecoration: "line-through",
                            color: "#B1B1B1",
                            fontSize: "15px",
                          }}
                        >
                          Giá: {formatCurrency(item.gia_san_pham)}
                        </small>
                        <br />
                        <span className={cx("text-red-600 font-bold text-[16px]")}>
                          Giá KM: {formatCurrency(item.gia_giam)}
                        </span>
                      </>
                    ) : (
                      <span className={cx("text-red-600 font-bold text-[16px]")}>
                        Giá KM: {formatCurrency(item.gia_san_pham)}
                      </span>
                    )}
                    </p>
                    
                    <div
                      className={cx(
                        "absolute mb-2 right-[18px] top-[260px] mr-[0px] text-white bg-red-500 px-[10px] py-[2px] rounded-[2px] z-[2]"
                      )}
                    >
                      New
                    </div>
                  </div>
                ))}
                <div
                  className={cx(
                    " justify-center items-center hidden lg:flex my-[50px] relative  left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[1170px] mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78] w-[600px] h-[35px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                    <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Đồng Hồ Đôi">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ ĐÔI MỚI
                      </b>
                    </Link>
                  </p>
                </div>
                <div
                  className={cx(
                    " justify-center md:col-span-3 col-span-2 items-center my-[50px] relative flex  lg:hidden left-0 right-0 border-t-2 border-[rgba(161,147,142,0.881)] transform -translate-y-1/2 w-[100%]  mx-auto"
                  )}
                >
                  <p
                    className={cx(
                      "pt-[10px] bg-[#9c8e78]  w-[60%] md:text-[18px]  h-[auto] sm:text-[14px] border border-[#777777] rounded-[20px] absolute text-center z-[999] flex justify-center hover:bg-[#946d49]"
                    )}
                  >
                     <Link href="/components/components-thuonghieu/donghonew?query=gioi_tinh=Đồng Hồ Đôi">
                      <b className={cx("relative z-[1] text-white")}>
                        XEM THÊM ĐỒNG HỒ ĐÔI MỚI
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <div
        className={cx(
          "lg:max-w-[1170px] max-w-[80%] lg:mt-[20px] mt-[40px] mx-auto"
        )}
      >
        <div
          className={cx(
            "title",
            "flex justify-between items-center  mb-[20px]"
          )}
        >
          <h3
            className={cx(
              "ss",
              "m-0 lg:text-[24px] md:text-[20px] sm:text-[16px] text-[10px] font-bold"
            )}
          >
            THƯƠNG HIỆU
          </h3>
          <p className={cx("text-[#000000] m-0 cursor-pointer")}>
            <Link href="/components/components-thuonghieu/thuonghieu">
              Xem tất cả &raquo;{" "}
            </Link>
          </p>
        </div>
        <div className={cx("owlItem", "relative ")}>
          <Slider ref={setFirstSlider} {...firstSettings}>
            {category.filter((item) => item.thuong_hieu !== "RHYTHM").map((item) => (
              <div key={item._id} className={cx("lg:p-[2%] md:p-[2%] p-[1px]")}>
                <div className={cx("w-[100%]")}>
                  <Link
                    href={`/components/components-thuonghieu/chitietthuonghieu/${item.thuong_hieu}`}
                    title={item.thuong_hieu}
                  >
                    <img
                      alt={item.thuong_hieu}
                      src={`http://localhost:5000/images/${item.hinh_anh2}`}
                      className={cx("")}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
          <button
            onClick={prevFirst}
            className={cx(
              "prevButton",
              "absolute left-[-10px] top-[40%] -translate-y-[50%]  bg-white hover:bg-slate-700 text-white border-none py-[5px] mx-[10px] cursor-pointer rounded-[5px] transition-all duration-300 z-[9]"
            )}
          >
            <img src="/image/item/icons/left.png" width="40px" height="30px" />
          </button>

          <button
            onClick={nextFirst}
            className={cx(
              "nextButton",
              "absolute right-[-10px] top-[40%] -translate-y-[50%]  bg-white hover:bg-slate-700 text-white border-none py-[5px] mx-[10px] cursor-pointer rounded-[5px] transition-all duration-300 z-[9]"
            )}
          >
            <img src="/image/item/icons/right.png" width="40px" height="30px" />
          </button>
        </div>
      </div>

      <div className={cx("text-center mx-auto max-w-[1170px] mt-12")}>
        <p
          className={cx(
            "uppercase lg:text-[30px] md:text-[18px]  text-[12px] max-w-[40%] mx-auto overflow-hidden  p-[10px] z-10 bg-white relative mt-5 mb-4"
          )}
        >
          Vì sao nên chọn chúng tôi
        </p>
        <p
          className={cx(
            " border-t-[3px] border-[#796752]  max-w-[60%] mx-auto relative z-0 mt-[-35px] "
          )}
        ></p>
        <div className={cx("mt-[60px]")}>
          <div
            className={`${styles.blockStrengths} ${styles.strengths0} ${styles.blocksStrengths} ${styles.blocks0} lg:max-w-[1170px] max-w-[80%] mx-auto my-auto`}
          >
            <div
              className={`${styles.strengthsRectangle4Block} ${styles.cls} grid-cols-4 gap-4 lg:text-[26px] md:text-[18px] text-[12px]`}
            >
              <div className={cx("item")}>
                <div className={cx("itemInner ")}>
                  <div className={styles.item1}>
                    <div className={styles.isvg}>
                      <Link href="#" title="100% hàng chính hãng">
                        <svg
                          x="0px"
                          y="0px"
                          viewBox="0 0 405.075 405.075"
                          style={{
                            enableBackground: "new 0 0 405.075 405.075",
                          }}
                        >
                          <g>
                            <g>
                              <g>
                                <path d="M373.488,337.075l-59.2-104c6-2.8,9.6-9.2,9.2-16.4l-4.4-36.8l25.2-26.4c5.6-5.6,6-15.2,0.4-22l-25.2-27.2l5.2-37.2     c0.8-8-4.8-16-12.8-17.6l-36.4-7.2l-17.6-32.4c-3.6-7.6-12.4-10.8-20.4-7.6h-0.4l-33.6,15.6l-32.8-16c-3.6-2-8-2.4-12-1.2     c-4,1.2-7.2,4-9.2,7.6l-18,32.4l-36.4,6.4c-8.4,1.6-14,9.2-13.2,18l4.4,36.8l-25.2,26.4c-5.6,5.6-6,15.2-0.4,22l25.2,27.2     l-5.2,37.2c-0.8,7.2,3.6,14,10.4,16.8l-59.6,105.6c-1.6,2.4-1.2,5.6,0,8c1.6,2.4,4,4,6.8,4h64l29.2,50.8c1.6,2.4,4,4,6.8,4     s5.6-1.6,6.8-4l57.2-97.6l57.2,98.8c1.6,2.4,4,4,6.8,4s5.6-1.6,6.8-4l29.2-52h64c2.8,0,5.6-1.6,6.8-4     C375.088,342.675,375.088,339.475,373.488,337.075z M138.688,379.875l-24.8-42.8c-1.6-2.4-4-4-6.8-4h-55.2l55.2-97.6l22.8,4     l17.6,32.4c3.6,7.6,12.4,10.8,20.4,7.6h0.4l16.4-7.6l8,14L138.688,379.875z M161.888,265.075c-0.4,0-0.4,0-0.4,0l-17.6-33.2     c-2.4-4-6.4-7.2-11.2-7.6l-36.8-6.8l5.2-36.8c0.8-4.8-0.8-10-4-13.2l-24.8-27.2l25.2-26.4c3.6-3.6,5.2-8.4,4.4-13.2l-4.4-36.4     c0,0,0-0.4,0.4-0.8l36.4-6.4c4.4-0.8,8.8-3.6,11.2-8l18-32.4l32.8,16c4.4,2.4,10,2.4,14.4,0l33.2-15.2c0.4,0,0.4,0,0.4,0     l17.6,33.2c2.4,4,6.4,7.2,10.8,7.6l36.4,7.2l-5.2,36.8c-0.8,4.8,0.8,10,4,13.2l25.2,27.2l-25.6,26.4c-3.6,3.6-5.2,8.4-4.4,13.2     l4.4,36.8l-36,6c-4.4,0.8-8.8,3.6-11.2,8l-18,32.4l-32.8-16c-4.4-2.4-10-2.4-14.4,0L161.888,265.075z M297.888,333.075     c-2.8,0-5.6,1.6-6.8,4l-24.8,44l-56.4-97.6c-0.4-1.2-0.8-2-1.6-2.8l-8.8-15.6l2.8-1.2l32.8,16c2.4,1.2,4.8,1.6,7.2,1.6     c5.6,0,11.2-2.8,14-8l18-32.4l24-4.4l54.8,96.4H297.888z"></path>
                                <path d="M282.288,141.075c0-44-36-80-80-80s-80,36-80,80s36,80,80,80S282.288,185.075,282.288,141.075z M202.288,205.075     c-35.2,0-64-28.8-64-64s28.8-64,64-64s64,28.8,64,64S237.488,205.075,202.288,205.075z"></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.itemR}>
                    <Link href="#" title="100% hàng chính hãng">
                      100% hàng chính hãng
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.itemBreak}></div>
              {/* <!--  --> */}
              <div className={`${styles.item} ${styles.item2}`}>
                <div className={styles.itemInner}>
                  <div className={styles.item1}>
                    <div className={styles.isvg}>
                      <Link href="#" title="Miễn phí vận chuyển">
                        <svg
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          style={{ enableBackground: " new 0 0 512 512" }}
                        >
                          <g>
                            <g>
                              <path d="M476.158,231.363l-13.259-53.035c3.625-0.77,6.345-3.986,6.345-7.839v-8.551c0-18.566-15.105-33.67-33.67-33.67h-60.392 			V110.63c0-9.136-7.432-16.568-16.568-16.568H50.772c-9.136,0-16.568,7.432-16.568,16.568V256c0,4.427,3.589,8.017,8.017,8.017 			c4.427,0,8.017-3.589,8.017-8.017V110.63c0-0.295,0.239-0.534,0.534-0.534h307.841c0.295,0,0.534,0.239,0.534,0.534v145.372 			c0,4.427,3.589,8.017,8.017,8.017c4.427,0,8.017-3.589,8.017-8.017v-9.088h94.569c0.008,0,0.014,0.002,0.021,0.002 			c0.008,0,0.015-0.001,0.022-0.001c11.637,0.008,21.518,7.646,24.912,18.171h-24.928c-4.427,0-8.017,3.589-8.017,8.017v17.102 			c0,13.851,11.268,25.119,25.119,25.119h9.086v35.273h-20.962c-6.886-19.883-25.787-34.205-47.982-34.205 			s-41.097,14.322-47.982,34.205h-3.86v-60.393c0-4.427-3.589-8.017-8.017-8.017c-4.427,0-8.017,3.589-8.017,8.017v60.391H192.817 			c-6.886-19.883-25.787-34.205-47.982-34.205s-41.097,14.322-47.982,34.205H50.772c-0.295,0-0.534-0.239-0.534-0.534v-17.637 			h34.739c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017H8.017c-4.427,0-8.017,3.589-8.017,8.017 			s3.589,8.017,8.017,8.017h26.188v17.637c0,9.136,7.432,16.568,16.568,16.568h43.304c-0.002,0.178-0.014,0.355-0.014,0.534 			c0,27.996,22.777,50.772,50.772,50.772s50.772-22.776,50.772-50.772c0-0.18-0.012-0.356-0.014-0.534h180.67 			c-0.002,0.178-0.014,0.355-0.014,0.534c0,27.996,22.777,50.772,50.772,50.772c27.995,0,50.772-22.776,50.772-50.772 			c0-0.18-0.012-0.356-0.014-0.534h26.203c4.427,0,8.017-3.589,8.017-8.017v-85.511C512,251.989,496.423,234.448,476.158,231.363z 			 M375.182,144.301h60.392c9.725,0,17.637,7.912,17.637,17.637v0.534h-78.029V144.301z M375.182,230.881v-52.376h71.235 			l13.094,52.376H375.182z M144.835,401.904c-19.155,0-34.739-15.583-34.739-34.739s15.584-34.739,34.739-34.739 			c19.155,0,34.739,15.583,34.739,34.739S163.99,401.904,144.835,401.904z M427.023,401.904c-19.155,0-34.739-15.583-34.739-34.739 			s15.584-34.739,34.739-34.739c19.155,0,34.739,15.583,34.739,34.739S446.178,401.904,427.023,401.904z M495.967,299.29h-9.086 			c-5.01,0-9.086-4.076-9.086-9.086v-9.086h18.171V299.29z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M144.835,350.597c-9.136,0-16.568,7.432-16.568,16.568c0,9.136,7.432,16.568,16.568,16.568 			c9.136,0,16.568-7.432,16.568-16.568C161.403,358.029,153.971,350.597,144.835,350.597z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M427.023,350.597c-9.136,0-16.568,7.432-16.568,16.568c0,9.136,7.432,16.568,16.568,16.568 			c9.136,0,16.568-7.432,16.568-16.568C443.591,358.029,436.159,350.597,427.023,350.597z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M332.96,316.393H213.244c-4.427,0-8.017,3.589-8.017,8.017s3.589,8.017,8.017,8.017H332.96 			c4.427,0,8.017-3.589,8.017-8.017S337.388,316.393,332.96,316.393z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M127.733,282.188H25.119c-4.427,0-8.017,3.589-8.017,8.017s3.589,8.017,8.017,8.017h102.614 			c4.427,0,8.017-3.589,8.017-8.017S132.16,282.188,127.733,282.188z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M278.771,173.37c-3.13-3.13-8.207-3.13-11.337,0.001l-71.292,71.291l-37.087-37.087c-3.131-3.131-8.207-3.131-11.337,0 			c-3.131,3.131-3.131,8.206,0,11.337l42.756,42.756c1.565,1.566,3.617,2.348,5.668,2.348s4.104-0.782,5.668-2.348l76.96-76.96 			C281.901,181.576,281.901,176.501,278.771,173.37z"></path>
                            </g>
                          </g>
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.itemR}>
                    <Link href="#" title="Miễn phí vận chuyển">
                      Miễn phí vận chuyển
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.itemBreak}></div>
              {/* <!--  --> */}
              <div className={`${styles.item} ${styles.item3}`}>
                <div className={styles.itemInner}>
                  <div className={styles.item1}>
                    <div className={styles.isvg}>
                      <Link href="#" title="Bảo hành 5 năm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="40px"
                          viewBox="-65 0 511 511.99875"
                          width="40px"
                        >
                          <path d="m60.5 207c0 5.523438-4.476562 10-10 10s-10-4.476562-10-10 4.476562-10 10-10 10 4.476562 10 10zm0 0"></path>
                          <path d="m184.953125 510.320312c1.679687 1.117188 3.613281 1.679688 5.546875 1.679688s3.867188-.5625 5.546875-1.679688l90.941406-60.632812c58.554688-39.03125 93.511719-104.351562 93.511719-174.730469v-204.679687c0-4.296875-2.75-8.117188-6.824219-9.480469l-180-60.28125c-2.0625-.6875-4.292969-.6875-6.351562 0l-180 60.28125c-4.078125 1.363281-6.824219 5.183594-6.824219 9.480469v204.679687c0 70.378907 34.957031 135.699219 93.511719 174.730469zm-164.453125-235.363281v-197.480469l170-56.933593 170 56.933593v197.480469c0 63.675781-31.628906 122.773438-84.605469 158.089844l-85.394531 56.933594-85.394531-56.933594c-52.976563-35.3125-84.605469-94.414063-84.605469-158.089844zm0 0"></path>
                          <path d="m184.953125 462.25c1.679687 1.117188 3.613281 1.679688 5.546875 1.679688s3.867188-.5625 5.546875-1.679688l68.75-45.839844c47.402344-31.597656 75.703125-84.472656 75.703125-141.441406v-175.859375c0-4.296875-2.746094-8.117187-6.820312-9.480469l-140-46.941406c-2.0625-.691406-4.296876-.691406-6.359376 0l-140 46.941406c-4.074218 1.363282-6.820312 5.183594-6.820312 9.480469v67.890625c0 5.519531 4.476562 10 10 10 5.519531 0 10-4.480469 10-10v-60.695312l130-43.589844 130 43.589844v168.664062c0 50.269531-24.972656 96.921875-66.796875 124.800781l-63.203125 42.140625-63.203125-42.144531c-41.828125-27.875-66.796875-74.53125-66.796875-124.796875v-27.96875c0-5.523438-4.480469-10-10-10-5.523438 0-10 4.476562-10 10v27.96875c0 56.972656 28.300781 109.847656 75.703125 141.441406zm0 0"></path>
                          <path d="m149.289062 328.207031c5.664063 5.667969 13.199219 8.789063 21.210938 8.789063s15.542969-3.121094 21.210938-8.789063l80-80c11.722656-11.722656 11.726562-30.695312 0-42.417969-11.722657-11.722656-30.695313-11.726562-42.421876-.003906l-58.789062 58.792969-18.789062-18.789063c-11.71875-11.722656-30.695313-11.726562-42.421876 0-11.726562 11.722657-11.726562 30.695313 0 42.421876zm-25.859374-68.277343c3.910156-3.90625 10.230468-3.90625 14.136718 0l25.859375 25.859374c3.90625 3.902344 10.238281 3.902344 14.144531 0l65.859376-65.859374c3.910156-3.90625 10.226562-3.90625 14.140624 0 3.90625 3.90625 3.90625 10.226562-.003906 14.136718l-80 80c-1.890625 1.890625-4.398437 2.933594-7.066406 2.933594s-5.179688-1.042969-7.070312-2.933594l-40-40c-3.90625-3.90625-3.910157-10.226562 0-14.136718zm0 0"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.itemR}>
                    <Link href="#" title="Bảo hành 5 năm">
                      Bảo hành 5 năm
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.itemBreak}></div>
              {/* <!--  --> */}
              <div className={`${styles.item} ${styles.item4}`}>
                <div className={styles.itemInner}>
                  <div className={styles.item1}>
                    <div className={styles.isvg}>
                      <Link href="#" title="Đổi hàng trong 7 ngày">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          style={{ enableBackground: "new 0 0 512 512" }}
                        >
                          <g>
                            <g>
                              <path d="M504.5,0H7.5C3.358,0,0,3.358,0,7.5v497c0,4.142,3.358,7.5,7.5,7.5h497c4.142,0,7.5-3.358,7.5-7.5V7.5    C512,3.358,508.642,0,504.5,0z M497,497H15V15h482V497z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M474.5,30h-437c-4.142,0-7.5,3.358-7.5,7.5v45c0,4.142,3.358,7.5,7.5,7.5c4.142,0,7.5-3.358,7.5-7.5V45h422v422H45V112.5    c0-4.142-3.358-7.5-7.5-7.5c-4.142,0-7.5,3.358-7.5,7.5v362c0,4.142,3.358,7.5,7.5,7.5h437c4.142,0,7.5-3.358,7.5-7.5v-437    C482,33.358,478.642,30,474.5,30z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M305.5,228.501h-7.794l33.07-77.167c3.652-8.522,2.786-18.231-2.318-25.971C323.354,117.621,314.772,113,305.5,113h-99    c-15.164,0-27.5,12.336-27.5,27.5s12.336,27.5,27.5,27.5h57.295l-25.928,60.5H206.5c-15.164,0-27.5,12.336-27.5,27.5    s12.336,27.5,27.5,27.5h7.797l-33.068,77.163c-5.973,13.937,0.506,30.136,14.444,36.109c3.45,1.479,7.091,2.229,10.82,2.229    c11.023,0,20.949-6.544,25.289-16.672l42.354-98.828H305.5c15.164,0,27.5-12.336,27.5-27.5S320.664,228.501,305.5,228.501z     M305.5,268.501h-36.311c-3,0-5.712,1.788-6.894,4.546l-44.302,103.374c-1.974,4.605-6.487,7.581-11.5,7.581l-0.002,7.5V384    c-1.687,0-3.339-0.342-4.911-1.016c-6.335-2.715-9.28-10.078-6.565-16.414l37.549-87.617c0.993-2.317,0.755-4.978-0.632-7.083    c-1.388-2.104-3.74-3.371-6.261-3.371H206.5c-6.893,0-12.5-5.607-12.5-12.5s5.607-12.5,12.5-12.5h36.313    c3.001,0.001,5.712-1.787,6.894-4.545l32.356-75.5c0.993-2.317,0.755-4.978-0.632-7.083c-1.388-2.104-3.74-3.371-6.261-3.371    H206.5c-6.893,0-12.5-5.607-12.5-12.5s5.607-12.5,12.5-12.5h99c4.214,0,8.116,2.101,10.436,5.619    c2.32,3.519,2.714,7.932,1.054,11.806l-37.551,87.622c-0.993,2.317-0.755,4.978,0.632,7.083c1.388,2.104,3.74,3.371,6.261,3.371    H305.5c6.893,0,12.5,5.607,12.5,12.5S312.393,268.501,305.5,268.501z"></path>
                            </g>
                          </g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                          <g></g>
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.itemR}>
                    <Link href="#" title="Đổi hàng trong 7 ngày">
                      Đổi hàng trong 7 ngày
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.itemBreak}></div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            "lg:grid-cols-2 grid-cols-1   items-center  pt-[70px] lg:max-w-[1170px] max-w-[80%] mx-auto  relative grid"
          )}
        >
          <div className={cx("text mx-auto  w-full")}>
            <h3
              className={cx(
                "text-title text-left  w-full uppercase text-[20px] mb-[10px] leading-[36px] font-bold"
              )}
            >
              Đại lý ủy quyền chính thức các thương hiệu lớn
            </h3>
            <p className={cx("xtc uppercase text-right mt-10  relative")}>
              <Link href="/components/components-thuonghieu/thuonghieu">
                Xem tất cả
              </Link>
              <span className="block absolute top-[50px]  w-full h-[0.5px] bg-gray-600"></span>
            </p>

            <p
              className={cx(
                "text-brand w-full  pt-[120px] font-bold text-left text-[18px] pb-[60px] leading-[22px]"
              )}
            >
              Chứng nhận Wristly Watch là đại lý ủy quyền chính thức của thương
              hiệu LONGINES tại Việt Nam.
              {/* (
              <Link href="#" className={cx("text-red-500")}>
                Xem ngay
              </Link>
              ). */}
            </p>

            <div className={cx("section-brand  w-[70%] ml-auto h-auto")}>
              <div className={cx("item-slide1 overflow-hidden ")}>
                <Slider ref={setSecondSlider} {...secondSettings}>
                  {category.filter((item) => item.thuong_hieu !== "RHYTHM").map((item) => (
                    <div className={cx("item ")} key={item._id}>
                      <img
                        alt={item.thuong_hieu}
                        width="100"
                        height="50"
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div className={cx(" mx-auto")}>
            <img
              src="/image/item/icons/longines_1616385184.jpg.webp"
              alt="Chứng nhận"
              className={cx("imgChungnhan  pt-[20px]")}
            />
          </div>
        </div>
      </div>
      <div
        className={cx("container-news lg:block hidden mx-auto max-w-[1170px] lg:max-h-[700px]")}
      >
        <h2 className={cx("title-unline")}>
          <p>TIN TỨC - VIDEO</p>
        </h2>
        <div className={cx("section-news")}>
          {/* Phần tin tức */}
          <div className={cx("news-section")}>
            <div className={cx("item-left ")}>
              <div className={cx("item-1")}>
                <div className={cx("news-item")}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      maxWidth: "290px",
                      fontSize: "14px",
                      color: "#000",
                      lineHeight: "18px",
                    }}
                  >
                    Mạnh mẽ, tươi trẻ cùng đồng hồ quataz mặt xanh lá
                  </h4>
                  <p style={{ maxWidth: "290px" }}>
                    Xanh lá - màu sắc của sự sống và hy vọng, là biểu tượng hoàn
                    hảo cho mùa lễ hội. Đồng hồ mặt xanh lá cây không chỉ là...
                  </p>
                  <p>
                    <i className="fa-solid fa-calendar-days"></i>
                    <small style={{ paddingLeft: "15px" }}>23/11/2024</small>
                  </p>
                </div>
                <img src="/image/item/icons/12_1732510594.jpg.webp" alt="" />
              </div>

              <div className={cx("item-1")}>
                <div className={cx("news-item")}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      maxWidth: "290px",
                      fontSize: "14px",
                      color: "#000",
                      lineHeight: "18px",
                    }}
                  >
                    Giáng sinh thêm phần rực rỡ với top 10 mẫu đồng hồ cơ mặt
                    xanh lá
                  </h4>
                  <p style={{ maxWidth: "290px" }}>
                    Đồng hồ cơ mặt số màu xanh lá cây, một màu sắc của sự tươi
                    trẻ, hy vọng và tràn đầy năng lượng, rất phù hợp với
                    không...
                  </p>
                  <p>
                    <i className="fa-solid fa-calendar-days"></i>
                    <small style={{ paddingLeft: "15px" }}>23/11/2024</small>
                  </p>
                </div>
                <img src="/image/item/icons/11_1732510806.jpg.webp" alt="" />
              </div>

              <div className={cx("item-1")}>
                <div className={cx("news-item")}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      maxWidth: "290px",
                      fontSize: "14px",
                      color: "#000",
                      lineHeight: "18px",
                    }}
                  >
                    Lựa chòn màu mặt đồng hồ theo nguyên tắc phong thủy{" "}
                  </h4>
                  <p style={{ maxWidth: "290px" }}>
                    Lựa chọn màu mặt đồng hồ theo nguyên tắc phong thủy để giúp
                    giúp tăng cường năng lượng và sức khỏe cũng như những vấn
                    đề...
                  </p>
                  <p>
                    <i className="fa-solid fa-calendar-days"></i>
                    <small style={{ paddingLeft: "15px" }}>25/11/2024</small>
                  </p>
                </div>
                <img
                  src="/image/item/icons/26_1732525206-copy.jpg.webp"
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* Phần video */}
          <div className={cx("video-section")}>
            <div className={cx("video-title")}>
              <img src="/image/item/icons/youtube.png" alt="YouTube Icon" />
              <p>Review Đồng Hồ Hamilton Jazzmaster Gmt Auto H32605581</p>
            </div>

            {/* Video chính */}
            <div className={cx("video-wrapper")}>
              <iframe
                src="https://www.youtube.com/embed/LiE0xipwl2I?si=ANkzcG22yghBN08r"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <h4 className={cx("title-video")}>
              Review Đồng Hồ Hamilton Jazzmaster GMT Auto H32605581
            </h4>

            {/* Video liên quan */}
            <div className={cx("related-videos")}>
              <div className={cx("related-video")}>
                <iframe
                  src="https://www.youtube.com/embed/LiE0xipwl2I?si=ANkzcG22yghBN08r"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p className={cx("title-videos")}>Hamilton</p>
              </div>
              <div className={cx("related-video")}>
                <iframe
                  src="https://www.youtube.com/embed/_UJ3h-G0pn4?si=In0FlUgsrfiT2glH"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p className={cx("title-videos")}>Mido</p>
              </div>
              <div className={cx("related-video")}>
                <iframe
                  src="https://www.youtube.com/embed/BEISZyun0rU?si=xOC6s2Pa7KCi9Are"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p className={cx("title-videos")}>Titoni Airmaster</p>
              </div>
              <div className={cx("related-video")}>
                <iframe
                  src="https://www.youtube.com/embed/33cvhTzmb2M?si=wFO3GqTy37A1IAxz"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p className={cx("title-videos")}>Longines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}