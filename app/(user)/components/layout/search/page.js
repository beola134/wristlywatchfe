"use client";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import classNames from "classnames/bind";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Hiển thị 20 mục mỗi trang

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);

      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/product/timkiem",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query }),
            }
          );

          const data = await response.json();
          setResults(data.products);
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu:", error);
        }
      };

      fetchData();
    }
  }, [searchParams]);

  // Tính số trang
  const totalPages = Math.ceil(results.length / itemsPerPage);

  // Lấy kết quả của trang hiện tại
  const currentResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={cx("search-results"," lg:max-w-[1170px] max-w-[80%]")}>
      <h2>
        Có <b>{results.length}</b> sản phẩm với từ khóa: <b>{searchQuery}</b>
      </h2>
      {results.length > 0 ? (
        <>
          <div
            className={cx(
              "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 lg:max-w-[1170px] max-w-[80%] mx-auto gap-y-[30px]"
            )}
          >
            {currentResults.map((item) => (
              <div key={item._id} className={cx("text-center relative")}>
                {item.gia_giam > 0 && (
                  <div
                    className={cx(
                      "absolute top-[-15px] left-[10px] bg-[#ed1c24] text-white rounded-full text-[13px] w-[44px] h-[44px] box-border z-[9] tracking-[-0.7px] pt-[13px]"
                    )}
                  >
                    -{" "}
                    {Math.floor(
                      ((item.gia_san_pham - item.gia_giam) / item.gia_san_pham) * 100
                    )}
                    %
                  </div>
                )}
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
                    {item.loai}
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
          </div>

          {/* Điều khiển phân trang */}
          <div className={styles.pagination}>
                    {/* Prev trang đâù */}
                    <span
                      title="First page"
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>
                    {/* Prev 1 trang */}
                    <span
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      ‹
                    </span>
                    {/* Trang hiện tại */}
                    <span
                      className={styles.currentPage}
                    >{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                    {/* Next 1 trang*/}
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      ›
                    </span>
                    {/* Next tới trang cuối */}
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>
        </>
      ) : (
        <p>Không tìm thấy sản phẩm nào</p>
      )}
    </div>
  );
}
