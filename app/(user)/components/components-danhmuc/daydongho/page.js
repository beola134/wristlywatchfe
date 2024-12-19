"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./daydongho.module.css";
import Loading from "../../loading/page";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
export default function Daydongho() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("Dây đồng hồ");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    size_day: "",
    mau_day: "",
    thuong_hieu: "",
    chat_lieu_day: "",
    danh_muc: "",
  });
  const laySanPham = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filterDayDongHo/d3906bb8-4728-460e-8280-230deb79178c?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    laySanPham();
  }, [filter, currentPage]);
  const thayDoiTrang = (page) => {
    setCurrentPage(page);
  };
  const capNhatBoLoc = (filterType, value) => {
    const newFilters = [...selectedFilter];
    const newFilter = { ...filter, [filterType]: value };
    const filterIndex = newFilters.findIndex((filter) =>
      filter.startsWith(`${filterType}=`)
    );
    if (filterIndex !== -1) {
      newFilters[filterIndex] = `${filterType}=${value}`;
    } else {
      newFilters.push(`${filterType}=${value}`);
    }

    setSelectedFilter(newFilters);
    setFilter(newFilter);

    if (filterType === "danh_muc") {
      setCategoryName(value);
    }
    setCurrentPage(1);
  };
  const xoaTatCaBoLoc = () => {
    setSelectedFilter([]);
    setFilter({
      danh_muc: "Dây đồng hồ",
    });
    setCurrentPage(1);
    setCategoryName("Dây đồng hồ");
    laySanPham();
  };
  const xoaBoLoc = (filterToRemove) => {
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" };
    if (filterType === "danh_muc") {
      setCategoryName("Dây đồng hồ");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    laySanPham();
  };
  const sapXepSanPham = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_san_pham - b.gia_san_pham);
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_san_pham - a.gia_san_pham);
    }
    return products;
  };
  const capNhatSapXep = (e) => {
    setSortOption(e.target.value);
  };
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  const sanPhamHienThi = sapXepSanPham(products);
  return (
    <>
      <div className={styles["container-header"]}>
        <div id="main-container" className={styles["mt20"]}>
          <div className={styles["main-column"]}>
            <div className={styles["center-1col"]}>
              <div className={styles.clear}></div>
              <div className={styles.container}>
                <div className={styles.clear}></div>
                <div className={styles["all-summary"]}>
                  <div
                    className={`${styles["summary-content-filter"]} ${styles.description}`}
                  >
                    <div className={styles["banner-cat-manuf"]}>
                      <div
                          className={cx(
                            
                            "flex",
                            "items-center uppercase mb-5 "
                          )}
                        >
                          <span className={cx( "text-sm")}>
                            <Link
                              href="/"
                              className={cx(
                                
                                " text-gray-800",
                                "hover:text-[#796752]"
                              )}
                            >
                              Trang chủ
                            </Link>
                          </span>
                          <span className={cx("separator", "mx-3", "text-stone-400")}>
                            {" "}
                            &gt;{" "}
                          </span>
                          
                          
                          <span className={cx( "text-sm", "text-red-500")}>
                            <Link
                              href="/components/components-danhmuc/daydongho"
                              className={cx("link", "text-red-500")}
                            >
                              
                              Dây đồng hồ
                            </Link>
                          </span>
                        </div>
                    
                      <img src="/image/item/banner-daydongho.jpg" alt="" />
                    </div>
                  </div>
                </div>
                <div className={styles.clear}></div>
                {selectedFilter.length > 0 && (
                  <div className={styles.choosedfilter}>
                    {selectedFilter.map((filter, index) => (
                      <Link
                        key={index}
                        rel="nofollow"
                        href="#"
                        onClick={() => xoaBoLoc(filter)}
                      >
                        {filter.split("=")[1]}
                      </Link>
                    ))}
                    <Link
                      rel="nofollow"
                      className={styles.reset}
                      href="#"
                      onClick={xoaTatCaBoLoc}
                    >
                      Xoá hết
                    </Link>
                  </div>
                )}
                <div className={styles.clear}></div>
                <div className={styles["products-cat"]}>
                  <div className={styles["block-products-filter"]}>
                    <div
                      className={`${styles["block-product-filter"]} ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal}`}
                          data-id="id-field-size-day"
                        >
                          Kích thước dây
                        </div>
                        <div
                          id="size-day"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-2-column"]} ${styles["filter-4-size-day"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 26-24mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 26-24mm")
                                }
                              >
                                Kích thước 26-24mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 26-22mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 26-22mm")
                                }
                              >
                                Kích thước 26-22mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 24-22mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 24-22mm")
                                }
                              >
                                Kích thước 24-22mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 24-20mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 24-20mm")
                                }
                              >
                                Kích thước 24-20mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 22-20mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 22-20mm")
                                }
                              >
                                Kích thước 22-20mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 21-18mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 21-18mm")
                                }
                              >
                                Kích thước 21-18mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 20-18mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 20-18mm")
                                }
                              >
                                Kích thước 20-18mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 19-18mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 19-18mm")
                                }
                              >
                                Kích thước 19-18mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 18-16mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 18-16mm")
                                }
                              >
                                Kích thước 18-16mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 16-14mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 16-14mm")
                                }
                              >
                                Kích thước 16-14mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 14-12mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 14-12mm")
                                }
                              >
                                Kích thước 14-12mm
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Size 12-10mm"
                                onClick={() =>
                                  capNhatBoLoc("size_day", "Size 12-10mm")
                                }
                              >
                                Kích thước 12-10mm
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal}`}
                          data-id="id-field-mau-day"
                        >
                          Màu Dây
                        </div>
                        <div
                          id="mau-day"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-mau-day"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nâu (Brown)"
                                onClick={() =>
                                  capNhatBoLoc("mau_day", "Nâu (Brown)")
                                }
                              >
                                Nâu (Brown)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Nâu (Tan)"
                                onClick={() =>
                                  capNhatBoLoc("mau_day", "Nâu (Tan)")
                                }
                              >
                                Nâu (Tan)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Xanh (Green)"
                                onClick={() =>
                                  capNhatBoLoc("mau_day", "Xanh (Green)")
                                }
                              >
                                Xanh (Green)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Xanh (Navy)"
                                onClick={() =>
                                  capNhatBoLoc("mau_day", "Xanh (Navy)")
                                }
                              >
                                Xanh (Navy)
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Đen"
                                onClick={() => capNhatBoLoc("mau_day", "Đen")}
                              >
                                Đen
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal}`}
                          data-id="id-field-thuong-hieu"
                        >
                          Thương hiệu
                        </div>
                        <div
                          id="thuong-hieu"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-1-column"]} ${styles["filter-4-thuong-hieu"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="ZRC-Rochet"
                                onClick={() =>
                                  capNhatBoLoc("thuong_hieu", "ZRC-Rochet")
                                }
                              >
                                ZRC-Rochet
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Longines"
                                onClick={() =>
                                  capNhatBoLoc("thuong_hieu", "Longines")
                                }
                              >
                                Longines
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Seiko"
                                onClick={() =>
                                  capNhatBoLoc("thuong_hieu", "Seiko")
                                }
                              >
                                Seiko
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Tissot"
                                onClick={() =>
                                  capNhatBoLoc("thuong_hieu", "Tissot")
                                }
                              >
                                Tissot
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Daniel Wellington"
                                onClick={() =>
                                  capNhatBoLoc(
                                    "thuong_hieu",
                                    "Daniel Wellington"
                                  )
                                }
                              >
                                Daniel Wellington
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}
                      >
                        <div
                          className={`${styles["field-name"]} ${styles.normal}`}
                          data-id="id-field-chat-lieu"
                        >
                          Chất Liệu
                        </div>
                        <div
                          id="chat-lieu"
                          className={`${styles["field-label"]} ${styles["filters-in-field"]} ${styles["filters-in-field-0-column"]} ${styles["filter-4-chat-lieu"]}`}
                        >
                          <span className={styles.close}>x</span>
                          <div
                            className={`${styles["filters-in-field-inner"]} ${styles.cls}`}
                          >
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây cao su"
                                onClick={() =>
                                  capNhatBoLoc("chat_lieu_day", "Dây cao su")
                                }
                              >
                                Dây cao su
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây da"
                                onClick={() =>
                                  capNhatBoLoc("chat_lieu_day", "Dây da")
                                }
                              >
                                Dây da
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây Silicone"
                                onClick={() =>
                                  capNhatBoLoc("chat_lieu_day", "Dây Silicone")
                                }
                              >
                                Dây Silicone
                              </Link>
                            </div>
                            <div className={`${styles.cls} ${styles.item}`}>
                              <Link
                                rel="nofollow"
                                href="#"
                                title="Dây dù"
                                onClick={() =>
                                  capNhatBoLoc("chat_lieu_day", "Dây dù")
                                }
                              >
                                Dây dù
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative text-center bg-[#f3f3f3] text-[11px] uppercase pt-[14px] px-[0px] pb-[12px] mb-[33px] ">
            {/*field-title*/}
            <div className={styles["title-name"]}>
              {/*title-name*/}
              <h1 className=" text-[20px]">
               Dây đồng hồ
              </h1>
              <div className={styles.clear}></div>
            </div>

            <select
              className="absolute lg:top-2 lg:right-3 top-[100%] right-[0px] sm:border sm:border-[#e6e6e6] lg:border-none  sm:bg-[#f3f3f3] py-[8px] text-[#5d5d5d] cursor-pointer"
              name="order-select"
              onChange={capNhatSapXep}>
              {/*order-select*/}
              <option value="">Sắp xếp theo</option>
              <option value="asc">Giá từ thấp tới cao</option>
              <option value="desc">Giá từ cao tới thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
            <div className={styles.clear}></div>
          </div>

                  <div className={styles.clear}></div>

                  <section>
            <div>
              {/* show sản phẩm */}
              <div
                className={`${styles["product-grid"]} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-3`}>
                {sanPhamHienThi.map((product) => {
                  const {
                    _id,
                    ten,
                    ten_san_pham,
                    ma_san_pham,
                    gia_san_pham,
                    hinh_anh,
                    gia_giam
                  } = product;
                  const roundDiscount = (discountPercentage) => {
                    const discountLevels = [10, 15, 20, 25, 30, 40, 50];
                    return discountLevels.reduce((prev, curr) =>
                      Math.abs(curr - discountPercentage) <
                      Math.abs(prev - discountPercentage)
                        ? curr
                        : prev
                    );
                  };
                  return (
                    <div
                      key={_id}
                      className="border-box relative overflow-hidden text-center mb-10"
                    >
                      <div className="relative">
                        <figure className="relative mb-4 min-h-[230px]">
                          <Link href={`/components/product-detail/${_id}`}>
                            <img
                              className="max-h-[290px]"
                              src={`http://localhost:5000/images/${hinh_anh}`}
                              alt={ten}
                              width="300"
                              height="363"
                              style={{
                                display: "inline-block",
                                opacity: "1",
                              }}
                            />
                          </Link>
                        </figure>
                        <h3>
                          <Link
                            className="text-[17px] font-semibold mb-2"
                            href="#"
                            title={ten}
                          >
                            <span className="text-gray-500 block text-[14px] mt-1.5 mb-2 font-normal leading-relaxed">
                              {ten_san_pham}
                            </span>
                            {ma_san_pham}
                          </Link>
                        </h3>

                        <div className={styles["price-area"]}>
                          {gia_giam > 0 && (
                            <div className="absolute top-0 left-1.25 bg-red-600 text-white text-sm w-11 h-11 leading-[2.875rem] box-border rounded-full">
                              <span>
                                -
                                {roundDiscount(
                                  Math.round(
                                    ((gia_san_pham - gia_giam) / gia_san_pham) *
                                      100
                                  )
                                )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={styles["price-area"]}>
                          {gia_giam > 0 ? (
                            <>
                              <div className="text-[15px] text-gray-400 mb-2 line-through">
                                Giá:{" "}
                                <span>
                                  {gia_san_pham.toLocaleString("vi-VN")}₫
                                </span>
                              </div>
                              <div className="text-[18px] text-red-600 font-semibold">
                                Giá KM: {gia_giam.toLocaleString("vi-VN")} ₫
                              </div>
                            </>
                          ) : (
                            <div className="text-[18px] text-red-600 font-semibold">
                              Giá: {gia_san_pham.toLocaleString("vi-VN")}₫
                            </div>
                          )}
                        </div>

                        <div className={styles.clear}></div>
                      </div>
                      {/* end .frame-inner */}
                      <div className={styles.clear}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
                  <div className={styles.pagination}>
                    <span
                      title="First page"
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() => currentPage > 1 && thayDoiTrang(1)}
                    >
                      ‹‹
                    </span>
                    <span
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage > 1 && thayDoiTrang(currentPage - 1)
                      }
                    >
                      ‹
                    </span>
                    <span
                      className={styles.currentPage}
                    >{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages &&
                        thayDoiTrang(currentPage + 1)
                      }
                    >
                      ›
                    </span>

                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages && thayDoiTrang(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>
                </div>
                <div className={styles.clear}></div>
                <div className={styles.clear}></div>
                <div
                  className={`${styles.aq_relates} ${styles.content_li}`}
                ></div>
              </div>
            </div>
            <div className={styles.clear}></div>
          </div>
        </div>
      </div>
    </>
  );
}
