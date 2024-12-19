"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./thuonghieu.module.css";
import Loading from "../../loading/page";
import cx from "classnames";

export default function Thuonghieu() {
  const [cates, setCates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Số lượng sản phẩm trên mỗi trang, mặc định cho màn hình lớn nhất.

  // Fetch dữ liệu thương hiệu
  useEffect(() => {
    const fetchCates = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/thuonghieu/allthuonghieu"
        );
        const data = await res.json();
        setCates(data.th);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCates();
  }, []);

  // Xác định số lượng sản phẩm hiển thị theo kích thước màn hình
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4); 
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(3); 
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(2); 
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage < cates.length ? prevIndex + itemsPerPage : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage >= 0
        ? prevIndex - itemsPerPage
        : cates.length - itemsPerPage
    );
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto  ">
        <div
          className={cx(
            "flex",
            "items-center uppercase  md:text-[16px] text-[10px] mb-5 mt-6"
          )}
        >
          <span className={cx("")}>
            <Link
              href="/"
              className={cx(" text-gray-800", "hover:text-[#796752]")}
            >
              Trang chủ
            </Link>
          </span>
          <span className={cx("separator", "mx-3", "text-stone-400")}>
            {" "}
            &gt;{" "}
          </span>

          <span className={cx("", "text-red-500")}>
            <Link
              href="/components/components-thuonghieu/donghonam"
              className={cx("link", "text-red-500")}
            >
              THƯƠNG HIỆU
            </Link>
          </span>
        </div>
        <br />
        <h3 className="text-[20px]">THƯƠNG HIỆU</h3>
        <br />
        <div className="relative">
          <button onClick={prevSlide} className={`${styles.arrowLeft}`}>
            ‹
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {cates
              .filter((item) => item.thuong_hieu !== "RHYTHM")
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((item) => {
                const { _id, hinh_anh2 } = item;
                return (
                  <div className="flex flex-col" key={_id}>
                    <Link
                      href={`/components/components-thuonghieu/chitietthuonghieu/${item.thuong_hieu}`}
                    >
                      <img
                        className="w-full h-250px lg:h-[275px] sm:h-[250px] md:h-[250px] object-cover"
                        src={`http://localhost:5000/images/${hinh_anh2}`}
                        alt={`Hình ảnh thương hiệu ${item.thuong_hieu}`}
                      />
                    </Link>
                  </div>
                );
              })}
          </div>
          <button onClick={nextSlide} className={`${styles.arrowRight}`}>
            ›
          </button>
        </div>

        <br />
        <h3 className=" text-[20px]"> TẤT CẢ THƯƠNG HIỆU</h3>
        <br />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cates
            .filter((item) => item.thuong_hieu !== "RHYTHM")
            .map((item) => {
              const { _id, hinh_anh2 } = item;
              return (
                <div className="flex flex-col" key={_id}>
                  <Link
                    href={`/components/components-thuonghieu/chitietthuonghieu/${item.thuong_hieu}`}
                  >
                    <img
                      className="w-full h-250px lg:h-[275px] sm:h-[250px] md:h-[250px] object-cover"
                      src={`http://localhost:5000/images/${hinh_anh2}`}
                      alt={`Hình ảnh thương hiệu ${item.thuong_hieu}`}
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
