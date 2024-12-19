"use client";
import Link from "next/link";
import styles from "../../components-thuonghieu/donghonu/donghonu.module.css";
import { useEffect, useState } from "react";
import Loading from "../../loading/page";
import cx from "classnames";
export default function TrangsucCK() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // Tiêu đề danh mục
  const [selectedFilter, setSelectedFilter] = useState([]); // Lưu trữ các bộ lọc đã chọn
  const [sortOption, setSortOption] = useState(""); // Tuỳ chọn sắp xếp (tăng/giảm dần)
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mô tả
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bộ lọc mặc định cho đồng hồ nữ
  const [filter, setFilter] = useState({
    chat_lieu_vo: "",
  });
  // 1. Hàm gọi API để lấy danh sách sản phẩm dựa vào bộ lọc và phân trang
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filterDeBan/e9dd7461-30f5-42f4-9f69-512df6bdd51c?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products); // Cập nhật danh sách sản phẩm
      setTotalPages(data.totalPages); // Cập nhật tổng số trang
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gọi lại API khi bộ lọc hoặc trang hiện tại thay đổi
  useEffect(() => {
    fetchProducts();
  }, [filter, currentPage]);

  // 3. Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts();
  };

  // 4. Hàm cập nhật bộ lọc khi chọn mới
  const handleFilterChange = (filterType, value) => {
    const newFilters = [...selectedFilter];
    const newFilter = { ...filter, [filterType]: value };

    // Cập nhật hoặc thêm bộ lọc vào danh sách đã chọn
    const filterIndex = newFilters.findIndex((filter) =>
      filter.startsWith(`${filterType}=`)
    );
    if (filterIndex !== -1) {
      newFilters[filterIndex] = `${filterType}=${value}`;
    } else {
      newFilters.push(`${filterType}=${value}`);
    }
    // Cập nhật trạng thái bộ lọc
    setSelectedFilter(newFilters);
    setFilter(newFilter);

    // Đặt lại danh mục khi chọn một danh mục khác
    if (filterType === "danh_muc") {
      setCategoryName(value);
    }
  };

  // 5. Hàm xóa tất cả bộ lọc và đặt lại về trạng thái ban đầu
  const handleClearFilters = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "Nu",
    });
    setCurrentPage(1);
    setCategoryName("Đồng hồ nữ");
    fetchProducts();
  };

  // 6. Hàm xóa một bộ lọc cụ thể
  const handleRemoveFilter = (filterToRemove) => {
    // Loại bỏ bộ lọc cụ thể khỏi selectedFilter
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );

    // Cập nhật filter dựa trên các bộ lọc còn lại
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" }; // Xóa giá trị của bộ lọc bị xoá

    // Nếu xoá danh mục (brand), đặt lại tiêu đề về đồng hồ nam
    if (filterType === "danh_muc") {
      setCategoryName("Đồng hồ nữ");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

  // 7. Hàm sắp xếp sản phẩm theo giá
  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_san_pham - b.gia_san_pham); // Giá từ thấp đến cao
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_san_pham - a.gia_san_pham); // Giá từ cao đến thấp
    }
    return products; // Trả về danh sách gốc nếu không sắp xếp
  };
  // 8. Cập nhật tuỳ chọn sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  //dropdown menu
  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error:{error}</p>;
  }
  const displayedProducts = sortProducts(products);
  return (
    <>
      <div className={styles["container-header"]}>
        <div id="main-container" className={styles.mt20}>
          <div className={styles["main-column"]}>
            <div className={styles["center-1col"]}>
              <div className={styles.clear}></div>
              <div className="container">
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
                  {" "}
                  ĐỒNG HỒ ĐỂ BÀN
                </Link>
              </span>
            </div>
                <div className={styles.clear}></div>
                <div className="relative">
                  {" "}
                  {/*all-summary*/}
                  <div
                    className="mt-[25px] mb-[20px] overflow-hidden relative view-more-content"
                    style={{
                      height: isExpanded ? "auto" : "150px",
                      overflow: isExpanded ? "visible" : "hidden",
                    }}>
                    {" "}
                    {/*summary-content-filter*/}
                    <p className="sm:text-[16px] text-[14px] italic leading-[24px] mb-[10px] mt-[10px]">
                      Bạn đang tìm kiếm một chiếc{" "}
                      <strong style={{ color: "#3498db" }}>
                        đồng hồ để bàn
                      </strong>{" "}
                      vừa đẹp mắt vừa chất lượng cao để trang trí không gian làm
                      việc hay phòng khách của bạn?{" "}
                      <strong style={{ color: "#3498db" }}>
                        WRISTLY Watch
                      </strong>{" "}
                      chuyên cung cấp các mẫu mã
                      <strong> đồng hồ để bàn đẹp</strong>, đa dạng từ đồng hồ
                      gỗ cổ điển đến <strong>đồng hồ để bàn vỏ nhưa</strong>, vỏ
                      kim loại hiện đại, phù hợp với mọi phong cách nội thất.
                      Với độ chính xác cao và thiết kế tinh xảo, các mẫu{" "}
                      <strong>đồng hồ để bàn hiện đại</strong> của chúng tôi
                      không chỉ là vật dụng xem giờ mà còn là điểm nhấn ấn tượng
                      cho không gian sống của bạn.
                      <br />
                      Hãy mua <strong>đồng hồ để bàn</strong> giá cạnh tranh
                      nhưng chất lượng đảm bảo ngay tại WRISTLY Watch hôm
                      nay để được hưởng những chương trình ưu đãi hấp dẫn!
                    </p>
                    <br />
                  </div>
                  <div
                    className={`${styles.viewMore} sm:block sm:h-auto lg:hidden `}
                    onClick={toggleDescription}>
                    <span onClick={toggleDescription}>
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </span>
                  </div>
                </div>

                <div className={styles["products-cat"]}>
                  <div className="border-t border-[#e5e5e5] border-b mt-[15px] mb-[5px]">
                    <div className="phone-sm:grid phone-sm:grid-cols-2 phone-sm:gap-x-4    sm:grid sm:grid-cols-2  lg:flex lg:space-x-4">
                      {/* Thương hiệu  */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"}`}
                          onClick={toggleDropdown}>
                          Thương hiệu
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="brand"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[600px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[11px] sm:text-[14px] ${styles["filters-in-field-3-column"]} ${styles["filter-brand"]}`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="SEIKO"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "SEIKO")
                                  }>
                                  SEIKO
                                </Link>
                              </div>

                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="RHYTHM"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "RHYTHM")
                                  }>
                                  RHYTHM
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Chất liệu vỏ */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300 "} `}
                          onClick={toggleDropdown}>
                          Chất liệu vỏ
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="chat-lieu-vo"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]} ${styles["filter-4-chat-lieu-vo"]}`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nhựa"
                                  onClick={() =>
                                    handleFilterChange("chat_lieu_vo", "Nhựa")
                                  }>
                                  Nhựa
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Gỗ"
                                  onClick={() =>
                                    handleFilterChange("chat_lieu_vo", "Gỗ")
                                  }>
                                  Gỗ
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Gỗ tự nhiên"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Gỗ tự nhiên"
                                    )
                                  }>
                                  Gỗ tự nhiên
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nhôm"
                                  onClick={() =>
                                    handleFilterChange("chat_lieu_vo", "Nhôm")
                                  }>
                                  Nhôm
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <br />
                  {selectedFilter.length > 0 && (
                    <div className="mb-[20px]">
                      {" "}
                      {/*choosedfilter*/}
                      {selectedFilter.map((filter, index) => (
                        <Link
                          className="bg-[#e88f38] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px] after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
                          key={index}
                          rel="nofollow"
                          href="#"
                          onClick={() => handleRemoveFilter(filter)}>
                          {filter.split("=")[1]}{" "}
                          {/*Hiển thị các bộ lọc đã chọn*/}
                        </Link>
                      ))}
                      <Link
                        className="bg-[red] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px]  after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
                        rel="nofollow"
                        href="#"
                        onClick={handleClearFilters}>
                        Xoá hết
                      </Link>
                      {/*reset*/}
                    </div>
                  )}
                  <div className={styles.clear}></div>
                  <div className="relative text-center bg-[#f3f3f3] text-[11px] uppercase pt-[14px] px-[0px] pb-[12px] mb-[33px] ">
                    <div className={styles["title-name"]}>
                      <div className={styles["cat-title"]}>
                        <h1 className=" text-[20px]">ĐỒNG HỒ ĐỂ BÀN</h1>
                      </div>
                    </div>
                    <select
                      className="absolute lg:top-2 lg:right-3 top-[100%] right-[0px] sm:border sm:border-[#e6e6e6] lg:border-none  sm:bg-[#f3f3f3] py-[8px] text-[#5d5d5d] cursor-pointer"
                      name="order-select"
                      onChange={handleSortChange}>
                      {/*order-select*/}
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                    </select>
                    <div className={styles.clear}></div>
                  </div>

                  <section className={styles["products-cat-frame"]}>
                    <div className={styles["products-cat-frame-inner"]}>
                      {loading ? (
                        <p>Đang tải...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : (
                        <div
                          className={`${styles["product-grid"]} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-3`}>
                          {displayedProducts.map((product) => {
                            const {
                              _id,
                              ten,
                              ten_san_pham,
                              ma_san_pham,
                              gia_san_pham,
                              gia_giam,
                              hinh_anh,
                              loai,
                              duong_kinh,
                            } = product;
                            const roundDiscount = (discountPercentage) => {
                              const discountLevels = [
                                10, 15, 20, 25, 30, 40, 50,
                              ];
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
                                className="border-box relative overflow-hidden text-center mb-10">
                                <div className="relative">
                                  <figure className="relative mb-4 min-h-[230px]">
                                    <Link
                                      href={`/components/product-detail/${_id}`}>
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
                                      title={ten}>
                                      <span className="text-gray-500 block text-[14px] mt-1.5 mb-2 font-normal leading-relaxed">
                                        {ten_san_pham}
                                      </span>
                                      {ma_san_pham}
                                    </Link>
                                  </h3>
                                  
                                  <span className="inline-block text-[12px] uppercase text-gray-500 mb-1.5">
                                    {duong_kinh}
                                  </span>
                                  <div className={styles["price-area"]}>
                                  {gia_giam > 0 ? (
                                    <>
                                      <div className="text-[15px] text-gray-400 mb-2 line-through">
                                        Giá:{" "}
                                        <span>{gia_san_pham.toLocaleString("vi-VN")}₫</span>
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
                                {gia_giam > 0 && (
                                  <div className="absolute top-0 left-1.25 bg-red-600 text-white text-sm w-11 h-11 leading-[2.875rem] box-border rounded-full">
                                    <span>
                                      -
                                      {roundDiscount(
                                        Math.round(
                                          ((gia_san_pham - gia_giam) / gia_san_pham) * 100
                                        )
                                      )}
                                      %
                                    </span>
                                  </div>
                                )}

                                  <div className={styles.clear}></div>
                                </div>
                                {/* end .frame-inner */}
                                <div className={styles.clear}></div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Phân trang */}
                  <div className={styles.pagination}>
                    <span
                      title="First page"
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() => currentPage > 1 && handlePageChange(1)}>
                      ‹‹
                    </span>
                    <span
                      className={
                        currentPage === 1
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }>
                      ‹
                    </span>
                    <span className={styles.currentPage}>
                      {`Trang ${currentPage} / ${totalPages || 1}`}
                    </span>
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }>
                      ›
                    </span>
                    <span
                      className={
                        currentPage === totalPages
                          ? styles.disabled
                          : styles["other-page"]
                      }
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }>
                      ››
                    </span>
                  </div>
                </div>
                <div className={styles.clear}></div>
              </div>
            </div>
            <div className={styles.clear}></div>
          </div>
        </div>
      </div>
    </>
  );
}
