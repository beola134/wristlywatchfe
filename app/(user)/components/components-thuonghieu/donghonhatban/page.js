"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../donghonu/donghonu.module.css";
import Loading from "../../loading/page";
import cx from "classnames";

export default function Donghonu() {
  // State quản lý dữ liệu và trạng thái chung
  const [products, setProducts] = useState([]); // Danh sách sản phẩm hiện tại
  const [categoryName, setCategoryName] = useState("Đồng hồ Nhật Bản"); // Tiêu đề danh mục
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
    gioi_tinh: "",
    thuong_hieu: "",
    muc_gia: "",
    khuyenmai: "",
    loai_may: "",
    duong_kinh: "",
    chat_lieu_day: "",
    chat_lieu_vo: "",
    mat_kinh: "",
    mau_mat: "",
    phong_cach: "",
    kieu_dang: "",
    xuat_xu: "Nhật Bản",
  });
  // 1. Hàm gọi API để lấy danh sách sản phẩm dựa vào bộ lọc và phân trang
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
        `http://localhost:5000/product/filtersanphamdongho?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products); // Cập nhật danh sách sản phẩm
      setTotalPages(data.totalPages || 1); // Cập nhật tổng số trang
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
    setCurrentPage(1);

    // Đặt lại danh mục khi chọn một danh mục khác
    if (filterType === "thuong_hieu") {
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
    if (filterType === "thuong_hieu") {
      setCategoryName("Đồng hồ nữ");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

  // 7. Hàm sắp xếp sản phẩm theo giá
  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_giam - b.gia_giam); // Giá từ thấp đến cao
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_giam - a.gia_giam); // Giá từ cao đến thấp
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
  const displayedProducts = sortProducts(products); // sắp xếp sản phẩm trước khi hiển thị
  return (
    <>
      <div className={styles["container-header"]}>
        <div id="main-container" className={styles.mt20}>
          <div className={styles["main-column"]}>
            <div className={styles["center-1col"]}>
              <div className={styles.clear}></div>
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
                  ĐỒNG HỒ NHẬT BẢN
                </Link>
              </span>
            </div>
                <div className={styles.clear}></div>
                <div className="relative">
                  <div
                    className="mt-[25px] mb-[20px] overflow-hidden relative view-more-content"
                    style={{
                      height: isExpanded ? "auto" : "75px",
                      overflow: isExpanded ? "visible" : "hidden",
                    }}>
                    <p className="sm:text-[16px] text-[14px] italic leading-[24px] mb-[10px]">
                      Bước lên chuyến tàu thời gian{" "}
                      <strong>đồng hồ Nhật Bản</strong>, WRISTLY Watch sẽ dẫn
                      dắt bạn đến với hành trình giải mã sức hút trên từng mẫu
                      đồng hồ chính hãng đến từ “Bộ tứ” lừng danh của sứ xở Hoa
                      Anh Đào: Seiko, Citizen, Orient, Casio. Với thế mạnh về
                      phân khúc giá dễ tiếp cận,{" "}
                      <strong>đồng hồ Nhật Bản</strong> sẽ gửi đến “người người,
                      nhà nhà” danh mục sản phẩm bắt mắt, độ bền ấn tượng mà
                      ngay cả sinh viên hay những người mới ra trường vẫn có thể
                      thoải mái sở hữu.
                    </p>
                  </div>
                  <div
                    className={`${styles.viewMore} sm:block sm:h-auto lg:hidden `}
                    onClick={toggleDescription}>
                    <span onClick={toggleDescription}>
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </span>
                  </div>
                </div>
                {selectedFilter.length > 0 && (
                  <div className="mb-[20px]">
                    {selectedFilter.map((filter, index) => (
                      <Link
                        className="bg-[#e88f38] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px] after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
                        key={index}
                        rel="nofollow"
                        href="#"
                        onClick={() => handleRemoveFilter(filter)}>
                        {filter.split("=")[1]} {/*Hiển thị các bộ lọc đã chọn*/}
                      </Link>
                    ))}
                    <Link
                      className="bg-[red] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px]  after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
                      rel="nofollow"
                      href="#"
                      onClick={handleClearFilters}>
                      Xoá hết
                    </Link>
                  </div>
                )}
                <div className={styles.clear}></div>
                <div className={styles["products-cat"]}>
                  <div className="border-t border-[#e5e5e5] border-b mt-[15px] mb-[5px]">
                    {/*block-products-filter*/}
                    <div className="phone-sm:grid phone-sm:grid-cols-2 phone-sm:gap-x-4    sm:grid sm:grid-cols-2  lg:flex lg:space-x-4">
                      {/*block-product-filter*/}
                      {/* Giới tính */}
                      <div
                        className={`${
                          styles["field-item"]
                        } ${"phone-sm:ml-[5px]"} `}>
                        {/*field-item*/}
                        <div
                          className="cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          onClick={toggleDropdown}>
                          Giới tính
                        </div>{" "}
                        {/*field-name*/}
                        {isDropdownVisible && (
                          <div
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[400px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] `}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            {/*close*/}
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {" "}
                              {/*filters-in-field-inner*/}
                              {/*cls*/}
                              <Link
                                rel="nofollow"
                                href="/components/components-thuonghieu/donghonam"
                                title="Đồng hồ nam">
                                <span>Đồng hồ nam</span>
                              </Link>
                              <Link
                                rel="nofollow"
                                href="/components/components-thuonghieu/donghonu"
                                title="Đồng hồ nữ">
                                <span>Đồng hồ nữ</span>
                              </Link>
                              <Link
                                rel="nofollow"
                                href="/components/components-thuonghieu/donghodoi"
                                title="Đồng hồ đôi">
                                <span>Đồng hồ đôi</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Thương hiệu  */}
                      <div className={`${styles["field-item"]}   `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"}`}
                          onClick={toggleDropdown}>
                          Thương hiệu
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="brand"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[600px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[11px] sm:text-[14px] ${styles["filters-in-field-3-column"]}`}>
                            {/**/}
                            {/*filters-in-field-3-column*/}
                            {/*filter-brand*/}
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="LONGINES"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "LONGINES"
                                    )
                                  }>
                                  LONGINES
                                </Link>
                              </div>
                              {/* item2*/}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="TISSOT"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "TISSOT")
                                  }>
                                  TISSOT
                                </Link>
                              </div>
                              {/* item3*/}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="MIDO"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "MIDO")
                                  }>
                                  MIDO
                                </Link>
                              </div>
                              {/* item4 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="CERTINA"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "CERTINA")
                                  }>
                                  CERTINA
                                </Link>
                              </div>
                              {/* item5 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="HAMILTON"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "HAMILTON"
                                    )
                                  }>
                                  HAMILTON
                                </Link>
                              </div>
                              {/* item6 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="TITONI"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "TITONI")
                                  }>
                                  TITONI
                                </Link>
                              </div>
                              {/* item7 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="FREDERIQUECONSTANT"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "FREDERIQUECONSTANT"
                                    )
                                  }>
                                  FREDERIQUE CONSTANT
                                </Link>
                              </div>
                              {/* item8*/}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="CALVINKLEIN"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "CALVINKLEIN"
                                    )
                                  }>
                                  CALVIN KLEIN
                                </Link>
                              </div>
                              {/* item9*/}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="EDOX"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "EDOX")
                                  }>
                                  EDOX
                                </Link>
                              </div>
                              {/* item10 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="CLAUDEBERNARD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "CLAUDEBERNARD"
                                    )
                                  }>
                                  CLAUDE BERNARD
                                </Link>
                              </div>
                              {/* item11 */}
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
                              {/* item12 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="CITIZEN"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "CITIZEN")
                                  }>
                                  CITIZEN
                                </Link>
                              </div>
                              {/* item13 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="ORIENT"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "ORIENT")
                                  }>
                                  ORIENT
                                </Link>
                              </div>
                              {/* item14 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="CASIO"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "CASIO")
                                  }>
                                  CASIO
                                </Link>
                              </div>
                              {/* item15 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="OLYMPIANUS"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "OLYMPIANUS"
                                    )
                                  }>
                                  OLYM PIANUS
                                </Link>
                              </div>
                              {/* item16 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="DANIELWELLINGTON"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "DANIELWELLINGTON"
                                    )
                                  }>
                                  DANIEL WELLINGTON
                                </Link>
                              </div>
                              {/* item17 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="FOSSIL"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "FOSSIL")
                                  }>
                                  FOSSIL
                                </Link>
                              </div>
                              {/* item18 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="SKAGEN"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "SKAGEN")
                                  }>
                                  SKAGEN
                                </Link>
                              </div>
                              {/* item19 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="MICHAELKORS"
                                  onClick={() =>
                                    handleFilterChange(
                                      "thuong_hieu",
                                      "MICHAELKORS"
                                    )
                                  }>
                                  MICHAEL KORS
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mức giá */}
                      <div
                        className={`${
                          styles["field-item"]
                        } ${"phone-sm:ml-[5px]"}  `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                          onClick={toggleDropdown}>
                          Mức giá
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="price"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]  `}>
                            {/*filters-in-field-1-column*/}
                            {/*filter-4-price*/}
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dưới 2 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Dưới 2 triệu"
                                    )
                                  }>
                                  Dưới 2 triệu
                                </Link>
                              </div>
                              {/* item2 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 2 triệu đến 5 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 2 triệu đến 5 triệu"
                                    )
                                  }>
                                  Từ 2 triệu đến 5 triệu
                                </Link>
                              </div>
                              {/* item3 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 5 triệu đến 10 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 5 triệu đến 10 triệu"
                                    )
                                  }>
                                  Từ 5 triệu đến 10 triệu
                                </Link>
                              </div>
                              {/* item4 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 10 triệu đến 20 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 10 triệu đến 20 triệu"
                                    )
                                  }>
                                  Từ 10 triệu đến 20 triệu
                                </Link>
                              </div>
                              {/* item5 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 20 triệu đến 30 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 20 triệu đến 30 triệu"
                                    )
                                  }>
                                  Từ 20 triệu đến 30 triệu
                                </Link>
                              </div>
                              {/* item6 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 30 triệu đến 50 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 30 triệu đến 50 triệu"
                                    )
                                  }>
                                  Từ 30 triệu đến 50 triệu
                                </Link>
                              </div>
                              {/* item7*/}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 50 triệu đến 100 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 50 triệu đến 100 triệu"
                                    )
                                  }>
                                  Từ 50 triệu đến 100 triệu
                                </Link>
                              </div>
                              {/* item8 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Trên 100 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Trên 100 triệu"
                                    )
                                  }>
                                  Trên 100 triệu
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Khuyến mãi */}
                      <div className={`${styles["field-item"]}  `}>
                        <div
                          className="cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          onClick={toggleDropdown}>
                          Khuyến mại
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="discount"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}>
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
                                  title="Giảm 10%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 10%")
                                  }>
                                  Giảm 10%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 15%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 15%")
                                  }>
                                  Giảm 15%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 20%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 20%")
                                  }>
                                  Giảm 20%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 25%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 25%")
                                  }>
                                  Giảm 25%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 30%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 30%")
                                  }>
                                  Giảm 30%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 40%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 40%")
                                  }>
                                  Giảm 40%
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Giảm 50%"
                                  onClick={() =>
                                    handleFilterChange("khuyenmai", "Giảm 50%")
                                  }>
                                  Giảm 50%
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Loại máy */}
                      <div
                        className={`${styles["field-area"]} ${
                          styles["field-item"]
                        } ${"phone-sm:ml-[5px]"}`}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                            styles.normal
                          } ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-loai-may"
                          onClick={toggleDropdown}>
                          Loại máy
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="loai-may"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}>
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
                                  title="Automatic (Máy cơ tự động)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Automatic (Máy cơ tự động)"
                                    )
                                  }>
                                  Automatic (Máy cơ tự động)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quartz (Máy pin - điện tử)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Quartz (Máy pin - điện tử)"
                                    )
                                  }>
                                  Quartz (Máy pin - điện tử)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Eco-Drive (Năng lượng ánh sáng)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Eco-Drive (Năng lượng ánh sáng)"
                                    )
                                  }>
                                  Eco-Drive (Năng lượng ánh sáng)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quartz Chronograph (Máy pin bấm giờ thể thao)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Quartz Chronograph (Máy pin bấm giờ thể thao)"
                                    )
                                  }>
                                  Quartz Chronograph (Máy pin bấm giờ thể thao)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                                    )
                                  }>
                                  Automatic Chronometer (Máy cơ tự động chuẩn
                                  COSC)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quartz Chronometer (Máy pin chuẩn COSC)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Quartz Chronometer (Máy pin chuẩn COSC)"
                                    )
                                  }>
                                  Quartz Chronometer (Máy pin chuẩn COSC)
                                </Link>
                              </div>
                              <div
                                className={`${styles.cls} ${styles.item}`}
                                onClick={() =>
                                  handleFilterChange(
                                    "loai_may",
                                    "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)"
                                  )
                                }>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)">
                                  Automatic Chronograph (Máy cơ tự động bấm giờ
                                  thể thao)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quartz Solar (Năng lượng ánh sáng)"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Quartz Solar (Năng lượng ánh sáng)"
                                    )
                                  }>
                                  Quartz Solar (Năng lượng ánh sáng)
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                                  onClick={() =>
                                    handleFilterChange(
                                      "loai_may",
                                      "Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                                    )
                                  }>
                                  Đồng hồ cơ lên giây cót bằng tay ( Manual
                                  winding )
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Đường kính */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}`}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                            styles.normal
                          } ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-duong-kinh"
                          onClick={toggleDropdown}>
                          Đường kính
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="duong-kinh"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filter-4-duong-kinh"]}`}>
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
                                  title="Dưới 25mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "Dưới 25mm"
                                    )
                                  }>
                                  Dưới 25mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="25mm đến 30mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "25mm đến 30mm"
                                    )
                                  }>
                                  25mm đến 30mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="30mm đến 35mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "30mm đến 35mm"
                                    )
                                  }>
                                  30mm đến 35mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="35mm đến 38mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "35mm đến 38mm"
                                    )
                                  }>
                                  35mm đến 38mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="38mm đến 40mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "38mm đến 40mm"
                                    )
                                  }>
                                  38mm đến 40mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="40mm đến 42mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "40mm đến 42mm"
                                    )
                                  }>
                                  40mm đến 42mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="42mm đến 45mm"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "42mm đến 45mm"
                                    )
                                  }>
                                  42mm đến 45mm
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 45mm trở lên"
                                  onClick={() =>
                                    handleFilterChange(
                                      "duong_kinh",
                                      "Từ 45mm trở lên"
                                    )
                                  }>
                                  Từ 45mm trở lên
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Chất liệu dây  */}
                      <div
                        className={`${styles["field-area"]} ${styles["field-item"]}  `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"}`}
                          onClick={toggleDropdown}>
                          Chất liệu đây
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="duong-kinh"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]} `}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>

                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dây da"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "Dây da"
                                    )
                                  }>
                                  Dây da
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "Thép không gỉ 316L"
                                    )
                                  }>
                                  Thép không gỉ 316L
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L mạ vàng công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "Thép không gỉ 316L mạ vàng công nghệ PVD"
                                    )
                                  }>
                                  Thép không gỉ 316L mạ vàng công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L dạng lưới"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "Thép không gỉ 316L dạng lưới"
                                    )
                                  }>
                                  Thép không gỉ 316L dạng lưới
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L dạng lắc"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Thép không gỉ 316L dạng lắc"
                                    )
                                  }>
                                  Thép không gỉ 316L dạng lắc
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dây vải"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Dây vải"
                                    )
                                  }>
                                  Dây vải
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L/ Vàng 18K"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Thép không gỉ 316L/ Vàng 18K"
                                    )
                                  }>
                                  Thép không gỉ 316L/ Vàng 18K
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L/ Ceramic"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Thép không gỉ 316L/ Ceramic"
                                    )
                                  }>
                                  Thép không gỉ 316L/ Ceramic
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ mạ công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "Thép không gỉ mạ công nghệ PVD"
                                    )
                                  }>
                                  Thép không gỉ mạ công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dây cao su"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Dây cao su"
                                    )
                                  }>
                                  Dây cao su
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dây dù"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "  Dây dù"
                                    )
                                  }>
                                  Dây dù
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Titanium"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      " Titanium"
                                    )
                                  }>
                                  Titanium
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Titanium mạ vàng công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "itanium mạ vàng công nghệ PVD"
                                    )
                                  }>
                                  Titanium mạ vàng công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nhựa"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_day",
                                      "  Nhựa"
                                    )
                                  }>
                                  Nhựa
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Chất liệu vỏ */}
                      <div className={`${styles["field-item"]} `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300 "} `}
                          onClick={toggleDropdown}>
                          Chất liệu vỏ
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="chat-lieu-vo"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]}`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thép không gỉ 316L"
                                    )
                                  }>
                                  Thép không gỉ 316L
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ mạ vàng công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thép không gỉ mạ vàng công nghệ PVD"
                                    )
                                  }>
                                  Thép không gỉ mạ vàng công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Vàng 18K"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Vàng 18K"
                                    )
                                  }>
                                  Vàng 18K
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L/ Vàng 18K"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thép không gỉ 316L/ Vàng 18K"
                                    )
                                  }>
                                  Thép không gỉ 316L/ Vàng 18K
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Titanium"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Titanium"
                                    )
                                  }>
                                  Titanium
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Titanium mạ công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Titanium mạ công nghệ PVD"
                                    )
                                  }>
                                  Titanium mạ công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Ceramic"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Ceramic"
                                    )
                                  }>
                                  Ceramic
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ 316L/ Ceramic"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thép không gỉ 316L/ Ceramic"
                                    )
                                  }>
                                  Thép không gỉ 316L/ Ceramic
                                </Link>
                              </div>
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thép không gỉ mạ công nghệ PVD"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thép không gỉ mạ công nghệ PVD"
                                    )
                                  }>
                                  Thép không gỉ mạ công nghệ PVD
                                </Link>
                              </div>
                              {/*item1 */}
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
                              {/*item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Titanium/ Vàng 18K"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Titanium/ Vàng 18K"
                                    )
                                  }>
                                  Titanium/ Vàng 18K
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mặt kính */}
                      <div
                        className={`${
                          styles["field-item"]
                        } ${"phone-sm:ml-[5px]"}${" "} `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                          data-id="id-field-mat-kinh"
                          onClick={toggleDropdown}>
                          Mặt kính
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="mat-kinh"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] `}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>

                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Sapphire"
                                  onClick={() =>
                                    handleFilterChange("mat_kinh", "Sapphire")
                                  }>
                                  Sapphire
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt kính cứng"
                                  onClick={() =>
                                    handleFilterChange(
                                      "mat_kinh",
                                      "Mặt kính cứng"
                                    )
                                  }>
                                  Mặt kính cứng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Hardlex Crystal"
                                  onClick={() =>
                                    handleFilterChange(
                                      "mat_kinh",
                                      "Hardlex Crystal"
                                    )
                                  }>
                                  Hardlex Crystal
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mica"
                                  onClick={() =>
                                    handleFilterChange("mat_kinh", "Mica")
                                  }>
                                  Mica
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Kinh Nhựa"
                                  onClick={() =>
                                    handleFilterChange("mat_kinh", "Kinh Nhựa")
                                  }>
                                  Kinh Nhựa
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Màu mặt */}
                      <div className={`${styles["field-item"]}  `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                          onClick={toggleDropdown}>
                          Màu mặt
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="mau-mat"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]}`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>

                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Trắng"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Trắng")
                                  }>
                                  Trắng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Hồng"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Hồng")
                                  }>
                                  Hồng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Xám"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Xám")
                                  }>
                                  Xám
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Đen"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Đen")
                                  }>
                                  Đen
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Xanh lam"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Xanh lam")
                                  }>
                                  Xanh lam
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Vàng"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Vàng")
                                  }>
                                  Vàng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Khảm trai"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Khảm trai")
                                  }>
                                  Khảm trai
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Đỏ"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Đỏ")
                                  }>
                                  Đỏ
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Da Cam"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Da Cam")
                                  }>
                                  Da Cam
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Xanh Lá"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Xanh Lá")
                                  }>
                                  Xanh Lá
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nâu"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Nâu")
                                  }>
                                  Nâu
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Phong cách */}
                      <div
                        className={`${
                          styles["field-item"]
                        } ${"phone-sm:ml-[5px]"}${" "} `}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                          data-id="id-field-phong-cach"
                          onClick={toggleDropdown}>
                          Phong cách
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="phong-cach"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>

                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Sang trọng"
                                  onClick={() =>
                                    handleFilterChange(
                                      "phong_cach",
                                      "Sang trọng"
                                    )
                                  }>
                                  Sang trọng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thể thao"
                                  onClick={() =>
                                    handleFilterChange("phong_cach", "Thể thao")
                                  }>
                                  Thể thao
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thể thao sang trọng"
                                  onClick={() =>
                                    handleFilterChange(
                                      "phong_cach",
                                      "Thể thao sang trọng"
                                    )
                                  }>
                                  Thể thao sang trọng
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quân đội"
                                  onClick={() =>
                                    handleFilterChange("phong_cach", "Quân đội")
                                  }>
                                  Quân đội
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thời trang"
                                  onClick={() =>
                                    handleFilterChange(
                                      "phong_cach",
                                      "Thời trang"
                                    )
                                  }>
                                  Thời trang
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Hiện đại"
                                  onClick={() =>
                                    handleFilterChange("phong_cach", "Hiện đại")
                                  }>
                                  Hiện đại
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Kiểu dáng */}
                      <div className={`${styles["field-item"]} `}>
                        <div
                        className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                        onClick={toggleDropdown}>
                          Kiểu dáng
                        </div>{" "}
                        {isDropdownVisible && (
                          <div
                            id="kieu-dang"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} w-full phone-sm:w-full sm:w-full phone-sm:text-[12px] sm:text-[14px]`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>

                            <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px]  w-40 border-t-0 border-r border-b border-l"} ${
                                styles.descript
                              } ${styles.cls}`}>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt vuông"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt vuông")
                                  }>
                                  Mặt vuông
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt tròn"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt tròn")
                                  }>
                                  Mặt tròn
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt chữ nhật"
                                  onClick={() =>
                                    handleFilterChange(
                                      "kieu_dang",
                                      "Mặt chữ nhật"
                                    )
                                  }>
                                  Mặt chữ nhật
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt Oval"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt Oval")
                                  }>
                                  Mặt Oval
                                </Link>
                              </div>
                              {/* item1 */}
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Khác"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Khác")
                                  }>
                                  Khác
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Xuất xứ thương hiệu */}
                      <div
                        className={`${styles["field-area"]} ${
                          styles["field-item"]
                        } ${" "}`}>
                        <div
                          className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                            styles.normal
                          } ${styles.field} ${styles["field-opened"]}`}
                          data-id="id-field-xuat-xu-thuong-hieu"
                          onClick={toggleDropdown}>
                          Xuất xứ thương hiệu
                        </div>
                        {isDropdownVisible && (
                          <div
                            id="xuat-xu-thuong-hieu"
                            className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filter-4-xuat-xu-thuong-hieu"]}`}>
                            <span
                              className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                              onClick={toggleDropdown}>
                              x
                            </span>
                            <div
                              className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                                styles.cls
                              }`}>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nhật Bản"
                                  onClick={() =>
                                    handleFilterChange("xuat_xu", "Nhật Bản")
                                  }>
                                  Nhật Bản
                                </Link>
                              </div>
                              <div className={`${styles.cls} ${styles.item}`}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thụy Sỹ"
                                  onClick={() =>
                                    handleFilterChange("xuat_xu", "Thụy Sỹ")
                                  }>
                                  Thụy Sỹ
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/*Menu-Đồng hồ Nhật Bản */}
                  <div className="relative text-center bg-[#f3f3f3] text-[11px] uppercase pt-[14px] px-[0px] pb-[12px] mb-[33px] ">
                    <div className={styles["title-name"]}>
                      <div className={styles["cat-title"]}>
                        <div
                          className={styles["cat-title-main"]}
                          id="cat-dong-ho">
                          <div className={styles["title-icon"]}>
                            <h1 className=" text-[20px]">Đồng hồ Nhật Bản</h1>
                          </div>
                        </div>
                        <div className={styles.clear}></div>
                      </div>
                    </div>

                    <select
                      className="absolute lg:top-2 lg:right-3 top-[100%] right-[0px] sm:border sm:border-[#e6e6e6] lg:border-none  sm:bg-[#f3f3f3] py-[8px] text-[#5d5d5d] cursor-pointer"
                      name="order-select"
                      onChange={handleSortChange}>
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                    </select>
                    <div className={styles.clear}></div>
                  </div>

                  <div className={styles.clear}></div>
                  {/*Danh sách sản phẩm */}

                  <section className={styles["products-cat-frame"]}>
                    <div className={styles["products-cat-frame-inner"]}>
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
                                  <Link
                                    href={`/components/product-detail/${_id}`}
                                  >
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
                                <span className="inline-block text-[12px] uppercase text-gray-500 mb-1.5">
                                  {loai}
                                </span>
                                <span className="px-1.5 text-gray-500 text-[13px]">
                                  |
                                </span>
                                <span className="inline-block text-[12px] uppercase text-gray-500 mb-1.5">
                                  {duong_kinh}
                                </span>
                                <div className={styles["price-area"]}>
                                  {gia_giam > 0 ? (
                                    <>
                                      <div className="text-[15px] text-gray-400 mb-2 line-through">
                                        Giá:{" "}
                                        <span>
                                          {gia_san_pham.toLocaleString("vi-VN")}
                                          ₫
                                        </span>
                                      </div>
                                      <div className="text-[18px] text-red-600 font-semibold">
                                        Giá KM:{" "}
                                        {gia_giam.toLocaleString("vi-VN")} ₫
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-[18px] text-red-600 font-semibold">
                                      Giá:{" "}
                                      {gia_san_pham.toLocaleString("vi-VN")}₫
                                    </div>
                                  )}
                                </div>
                                {gia_giam > 0 && (
                                  <div className="absolute top-0 left-1.25 bg-red-600 text-white text-sm w-11 h-11 leading-[2.875rem] box-border rounded-full">
                                    <span>
                                      -
                                      {roundDiscount(
                                        Math.round(
                                          ((gia_san_pham - gia_giam) /
                                            gia_san_pham) *
                                            100
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
                    </div>
                  </section>

                  {/* phân trang*/}
                  <div className={styles.pagination}>
                    {/* Prev trang đâù */}
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
                    {/* Prev 1 trang */}
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
                    {/* Trang hiện tại */}
                    <span
                      className={styles.currentPage}>{`Trang ${currentPage} / ${
                      totalPages || 1
                    }`}</span>
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
                      }>
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
                      }>
                      ››
                    </span>
                  </div>
                </div>
                <div className={styles.clear}></div>
                {/* mô tả*/}
                <div
                  className={`${styles.summaryContentCat} ${styles.description} `}
                  style={{
                    height: isExpanded ? "auto" : "360px",
                    overflow: isExpanded ? "visible" : "hidden",
                  }}>
                  <p dir="ltr" style={{ textAlign: "justify" }}>
                    Nhật Bản là một gã khổng lồ trong ngành sản xuất đồng hồ,
                    với một số mẫu đồng hồ tốt nhất thế giới ở mọi chủng loại và
                    mức giá đến từ Đất nước Mặt trời mọc.
                  </p>
                  <p dir="ltr" style={{ textAlign: "justify" }}>
                    Khi bạn nghĩ về <strong>đồng hồ Nhật Bản</strong>, bạn có
                    thể hướng đến các lựa chọn đồng hồ thạch anh và{" "}
                    <strong>đồng hồ cơ Nhật Bản</strong> từ các thương hiệu như
                    Casio, Seiko và Citizen... Nhật Bản có lẽ là nước dẫn đầu về
                    giá trị trong ngành công nghiệp đồng hồ toàn cầu, một vị thế
                    có được nhờ những chiếc đồng hồ như bộ sưu tập Casio G-Shock
                    và đồng hồ thợ lặn Seiko SKX.{" "}
                  </p>
                  <p dir="ltr" style={{ textAlign: "justify" }}>
                    Bên cạnh đó, Nhật Bản cũng là một nguồn cung cấp tuyệt vời{" "}
                    <strong style={{ color: "#3498db" }}>
                      đồng hồ cao cấp
                    </strong>
                    , tầm trung và <strong>đồng hồ Nhật Bản giá rẻ</strong> từ
                    các tập đoàn lớn cũng như một số thương hiệu độc lập mới
                    nổi. Dưới đây là một số thương hiệu tốt nhất đến từ Nhật
                    Bản:
                  </p>
                  <h2 dir="ltr" style={{ textAlign: "justify" }}>
                    <strong>
                      1. Giới thiệu các thương hiệu đồng hồ Nhật Bản nổi tiếng
                    </strong>
                  </h2>
                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.1&nbsp;Casio</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Rất có thể chiếc đồng hồ đầu tiên của bạn là{" "}
                    <strong style={{ color: "#3498db" }}>Casio</strong>. Casio
                    được thành lập vào năm 1946 bởi Tadao Kashio, thế nhưng phải
                    đến những năm 70, Casio mới sản xuất chiếc đồng hồ đầu tiên
                    của mình. Kể từ đó, Casio đã thành công và bắt đầu giới
                    thiệu nhiều mẫu đồng hồ đa dạng hơn với đủ loại chức năng
                    khác nhau. Những chiếc đồng hồ này chính xác, cứng cáp và
                    giá cả phải chăng.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb1.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    Ngày nay, có lẽ nổi bật nhất là bộ sưu tập{" "}
                    <strong style={{ color: "#3498db" }}>Casio G Shock</strong>.
                    Được giới thiệu vào năm 1983, G-Shocks đã phát triển trở
                    thành biểu tượng văn hóa và đồng hồ. Và trong thập kỷ qua,
                    Casio bắt đầu giới thiệu những chiếc G-Shocks cao cấp hơn
                    với cấu tạo bằng thép không gỉ, vỏ bằng sợi carbon, cảm biến
                    tiên tiến như GPS và kết nối Bluetooth. Đặc biệt, dòng MR-G
                    của G-Shocks cũng tôn vinh lịch sử Nhật Bản bằng cách giới
                    thiệu những chiếc đồng hồ được trang trí bởi những người thợ
                    thủ công truyền thống của Nhật Bản. , đồng hồ nam hay nữ,
                    Longines vẫn mang đến hàng loạt phiên bản nổi tiếng đáp ứng
                    nhiều thị hiếu khác nhau.
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.2 Citizen</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Vào những năm 70,{" "}
                    <strong style={{ color: "#3498db" }}>Citizen</strong> bắt
                    đầu sản xuất hàng loạt đồng hồ thạch anh giá rẻ nhưng có độ
                    chính xác cao. Năm 1976, Citizen đã tiến xa hơn công nghệ
                    thạch anh với việc tạo ra chiếc đồng hồ thạch anh tương tự
                    chạy bằng năng lượng mặt trời đầu tiên trên thế giới, dẫn
                    đến sự phát triển của công nghệ Eco-Drive, công nghệ hiện
                    đang cung cấp năng lượng cho nhiều đồng hồ của Citizen và là
                    một đề xuất giá trị mạnh mẽ cho thương hiệu.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam rolex"
                      height="375"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb2.jpg"
                    />
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Citizen cũng được biết đến với những chiếc{" "}
                    <strong>đồng hồ nữ Nhật Bản </strong>
                    có kiểu dáng đẹp và được phái nữ ưa chuộng.
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.3 Grand Seiko</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Chiếc Grand Seiko đầu tiên được ra mắt vào năm 1960 như cách
                    nói của Seiko rằng hãng có thể sản xuất những chiếc đồng hồ
                    tốt như bất kỳ sản phẩm xa xỉ nào từ Thụy Sĩ. Vào năm 2017,
                    Seiko đã tạo nên thương hiệu riêng của Grand Seiko, với
                    phương án sản xuất, thiết kế hoàn toàn riêng biệt.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb3.jpg"
                    />
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Grand Seiko hiện nay thường được công nhận là đã mang lại
                    hiệu quả to lớn cho
                    <strong> đồng hồ Nhật Bản chính hãng</strong> khi nói đến
                    tay nghề thủ công.
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.4 Orient</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>Orient</span>
                        </Link>
                      </strong>
                    </em>{" "}
                    là công ty con của Tập đoàn Seiko Epson, với lĩnh vực kinh
                    doanh chính là máy in và các thiết bị liên quan đến hình
                    ảnh.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam omega"
                      height="675"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb4.jpg"
                    />
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Orient đang dẫn đầu trong lĩnh vực{" "}
                    <strong>đồng hồ cơ Nhật Bản</strong> giá cả phải chăng. Bộ
                    sưu tập đồng hồ phổ biến nhất của là{" "}
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>
                            Orient Bambino
                          </span>
                        </Link>
                      </strong>
                    </em>
                    - một chiếc đồng hồ đeo tay mang phong cách cổ điển. Orient
                    cũng nổi tiếng với những chiếc đồng hồ lặn và Kamasu.
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.5 Seiko</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Công ty được thành lập vào năm 1881 bởi Kintaro Hattori và
                    bắt đầu bằng việc bán và sửa chữa đồng hồ và{" "}
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>
                            đồng hồ đeo tay
                          </span>
                        </Link>
                      </strong>
                    </em>
                    . Chỉ 11 năm sau, Hattori bắt đầu sản xuất đồng hồ và sau đó
                    là đồng hồ bỏ túi, tiếp theo là chiếc đồng hồ đeo tay đầu
                    tiên của Nhật Bản vào năm 1913. Những năm 1960 là thời kỳ
                    phát triển nhanh chóng của công ty.{" "}
                    <em>
                      <strong>
                        <Link href="#">
                          <span className={styles.highlightText}>Seiko </span>
                        </Link>
                      </strong>
                    </em>{" "}
                    còn đạt được sự công nhận quốc tế trên cả mong đợi khi so
                    sánh với các thương hiệu Thụy Sĩ tại cuộc thi Neuchatel
                    Observatory. Vào năm 1969, Seiko không chỉ là một trong
                    những công ty đầu tiên giới thiệu đồng hồ chronograph tự lên
                    dây cót mà còn cho ra mắt chiếc đồng hồ thạch anh đầu tiên
                    trên thế giới, Astron.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam Hamilton Ventura Edge Dune Limited Edition H24624330"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb5.jpg"
                    />
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Một trong những thành tựu lớn nhất của thương hiệu là bộ
                    chuyển động Spring Drive là một chuyển động cơ điện hỗn hợp,
                    đặc biệt với kim giây trượt mượt mà, và độ chính xác vượt
                    trội của nó là +1 / -1 giây mỗi ngày. Có lẽ đây là một trong
                    những bộ máy đồng hồ ấn tượng và thú vị nhất còn tồn tại cho
                    đến ngày nay xuất phát từ Nhật Bản.
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.6 Credo</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Credor là một trong những bí mật được giữ kín nhất của ngành
                    sản xuất đồng hồ Nhật Bản. Hầu hết mọi người chưa bao giờ
                    nghe nói về Credor, ít biết hơn về những chiếc đồng hồ đáng
                    kinh ngạc mà thương hiệu sản xuất hoàn toàn in-house. Thương
                    hiệu được hình thành vào những năm bảy mươi để đại diện cho
                    đỉnh cao của bí quyết và tay nghề thủ công của Seiko. Ngày
                    nay, nhiều chiếc <strong>đồng hồ Nhật Bản cao cấp</strong>{" "}
                    của Credor có bộ chuyển động Spring Drive của Seiko, nhưng
                    với những cải tiến kỹ thuật và mức độ hoàn thiện bằng tay
                    cao hơn.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam mido"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb6.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.7 Hajime Asaoka</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Nhật Bản là quê hương của một số thương hiệu ấn tượng nếu ít
                    được biết đến, bao gồm Hajime Asaoka, một trong những nhà
                    sản xuất <strong>đồng hồ Nhật Bản</strong> độc lập nổi tiếng
                    nhất của Nhật Bản. Giống như nhiều người khác trong lĩnh vực
                    kinh doanh của mình, người sáng lập cùng tên với Hajime
                    Asaoka là người tự học, đã thu thập được nhiều kỹ năng và
                    kiến ​​thức của mình bằng cách đọc “Kỹ thuật đồng hồ nổi
                    tiếng của George Daniels” và xem các video trên YouTube.
                  </p>

                  <p className={styles.imageContainer}>
                    <img
                      alt="đồng hồ nam seiko 5 sport"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb7.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.8 Minase</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Mặc dù Minase là một công ty tương đối mới trong ngành, được
                    thành lập vào năm 2005, nhưng công ty mẹ của nó, Kyowa and
                    Co., đã hoạt động trong lĩnh vực sản xuất lâu hơn. Kyowa and
                    Co., một công ty liên quan đến cơ khí và gia công được thành
                    lập vào năm 1963. Với khả năng gia công chính xác, một trong
                    những điểm đặc biệt của nó là vỏ đồng hồ và dây đeo. Cuối
                    cùng, công ty quyết định thành lập và tạo ra những chiếc
                    đồng hồ hoàn chỉnh của riêng mình và Minase đã ra đời.
                  </p>

                  <p className={styles.imageCenter}>
                    <img
                      alt="dong-ho-casio"
                      height="510"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb8.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.9 Masahiro Kikuno</strong>
                  </h3>
                  <p dir="ltr" className={styles.justifyText}>
                    Người thợ đồng hồ bậc thầy Masahiro Kikuno chế tác những
                    chiếc đồng hồ của mình gần như hoàn toàn bằng tay. Từ thiết
                    kế, sản xuất đến lắp ráp, Masahiro Kikuno là một trong số
                    khoảng 30 người duy nhất trên thế giới có đủ kỹ năng để sản
                    xuất ra những chiếc đồng hồ được hoàn thiện vô cùng phức
                    tạp, và được thiết kế chu đáo. Nổi bật là chiếc{" "}
                    <strong>đồng hồ nam Nhật Bản</strong> Tourbillon của Kikuno
                    có vỏ bằng vàng đỏ 18k.
                  </p>
                  <p className={styles.imageCenter}>
                    <img
                      alt="đồng hồ nam citizen"
                      height="800"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb9.jpg"
                    />
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h3 dir="ltr" className={styles.justifyText}>
                    <strong>1.10 Knot</strong>
                  </h3>

                  <p dir="ltr" className={styles.justifyText}>
                    Ở Nhật Bản khá coi trọng chủ nghĩa tối giản. Nhưng với Knot,
                    một thương hiệu mới ra mắt gần đây sử dụng các chi tiết lựa
                    chọn, sự phức tạp cổ điển và vật liệu cao cấp để tạo ấn
                    tượng mạnh mẽ về sự tối giản. Ở thương hiệu này bạn có thể
                    tìm thấy nhiều mẫu <strong>đồng hồ nam Nhật Bản</strong>{" "}
                    khác nhau hoặc đặt làm theo yêu cầu của bạn và có một mức
                    giá tuyệt vời.
                  </p>

                  <p className={styles.imageCenter}>
                    <img
                      alt="đồng hồ nam orient"
                      height="675"
                      className={styles.lazy}
                      width="1200"
                      src="/image/item/nb10.jpg"
                    />
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Về độ chính xác và độ bền, <strong>đồng hồ Nhật Bản</strong>{" "}
                    luôn là một trong những lựa chọn đáng giá cho khách hàng!
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    Một chiếc đồng hồ sang trọng chính hãng là một món phụ kiện
                    hoàn hảo cho bộ trang phục của bạn, hơn thế nữa, nó còn là
                    sự tuyên bố về phong cách của người đeo. Vì vậy đầu tư vào
                    món đồ này cần có sự suy nghĩ kỹ lưỡng và lựa chọn địa chỉ
                    mua đồng hồ uy tín để có được sản phẩm chính hãng từ các
                    thương hiệu đồng hồ Nhật Bản hàng đầu.
                  </p>
                  <p dir="ltr" className={styles.justifyText}>
                    &nbsp;
                  </p>

                  <h2 dir="ltr" className={styles.justifyText}>
                    <strong>2. Địa chỉ mua đồng hồ Nhật Bản chính hãng</strong>
                  </h2>

                  <p dir="ltr" className={styles.justifyText}>
                    WRISTLY Watch là đại lý ủy quyền chính thức của một số
                    thương hiệu Nhật Bản, cung cấp cho khách hàng những mẫu đồng
                    hồ chính hãng của các thương hiệu Nhật Bản như Seiko,
                    Citizen, Casio, Orient…
                  </p>

                  <p dir="ltr" className={styles.justifyText}>
                    Tìm kiếm một chiếc đồng hồ ưng ý đã khó, và khi chọn mua ở
                    một cửa hàng uy tín còn khó hơn để chắc chắn không mua phải
                    hàng giả, hàng nhái. Chính vì vậy WRISTLY Watch cam kết với
                    khách hàng về sự tin tưởng vào sản phẩm và giá trị đồng tiền
                    bỏ ra khi bạn đến với chúng tôi.
                  </p>

                  <p className={styles.justifyText}>
                    Tại mỗi cửa hàng của Đồng hồ WRISTLY, mức{" "}
                    <strong>giá đồng hồ Nhật Bản</strong> luôn được niêm yết rõ
                    ràng, kèm theo đó là chế độ bảo hành chính hãng, dịch vụ hậu
                    mãi chu đáo để bạn có thể yên tâm lựa chọn khi đến với chúng
                    tôi.
                  </p>

                  <p className={styles.justifyText}>&nbsp;</p>

                  <div className={styles.clear}></div>
                </div>{" "}
                <div className={styles.summaryContent}>
                  <span onClick={toggleDescription}>
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
