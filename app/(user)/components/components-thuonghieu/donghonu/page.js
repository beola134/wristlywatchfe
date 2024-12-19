"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../donghonu/donghonu.module.css";
import Loading from "../../loading/page";
import cx from "classnames";
export default function Donghonu() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Đồng hồ nữ"); // Tiêu đề danh mục
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
    gioi_tinh: "Nữ",
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
    xuat_xu: "",
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

  // 9. Hiển thị mô tả

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
          ĐỒNG HỒ NỮ
        </Link>
      </span>
    </div>
        {/*container*/}
        <div className={styles.clear}></div>
        {/* mô tả đồng hồ nữ */}
        <div className="relative">
          {" "}
          {/*all-summary*/}
          <div
            className="mt-[25px] mb-[20px] overflow-hidden relative view-more-content"
            style={{
              height: isExpanded ? "auto" : "75px",
              overflow: isExpanded ? "visible" : "hidden",
            }}>
            {" "}
            {/*summary-content-filter*/}
            <p className="sm:text-[16px] text-[14px] italic leading-[24px] mb-[10px]">
              Đến với thế giới <strong>đồng hồ nữ</strong> của Wristly Watch,
              bạn sẽ được sở hữu hàng nghìn sản phẩm chất lượng, thiết kế bắt
              mắt đến từ các thương hiệu&nbsp;
              <em>
                <strong>
                  <Link href="#" target="_blank">
                    đồng hồ&nbsp;Thụy Sỹ
                  </Link>
                </strong>
              </em>
              , Nhật Bản, Pháp, Mỹ…danh tiếng trên thế giới. Mọi sản phẩm đều
              đảm bảo
              <strong>100% hàng chính hãng</strong> kèm theo{" "}
              <strong>chế độ bảo hành chính hãng</strong> đặc biệt với mức giá
              hợp lý sẽ đem đến cho bạn phụ kiện hoàn hảo nhất; khẳng định đẳng
              cấp, phong cách riêng của bản thân
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
        <br />
        {/* end-mô tả đồng hồ nữ */}
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
            {/*reset*/}
          </div>
        )}
        <div className={styles.clear}></div>
        <div>
          <div className="border-t border-[#e5e5e5] border-b mt-[15px] mb-[5px]">
            {/*block-products-filter*/}
            <div className="phone-sm:grid phone-sm:grid-cols-2 phone-sm:gap-x-4    sm:grid sm:grid-cols-2  lg:flex lg:space-x-4">
              {/*block-product-filter*/}
              {/* Giới tính */}
              <div
                className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"} `}>
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
                            handleFilterChange("thuong_hieu", "LONGINES")
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
                            handleFilterChange("thuong_hieu", "HAMILTON")
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
                            handleFilterChange("thuong_hieu", "CALVINKLEIN")
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
                            handleFilterChange("thuong_hieu", "CLAUDEBERNARD")
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
                            handleFilterChange("thuong_hieu", "OLYMPIANUS")
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
                            handleFilterChange("thuong_hieu", "MICHAELKORS")
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
                className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"}  `}>
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
                            handleFilterChange("muc_gia", "Dưới 2 triệu")
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
                            handleFilterChange("muc_gia", "Trên 100 triệu")
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
                          Automatic Chronometer (Máy cơ tự động chuẩn COSC)
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
                          Automatic Chronograph (Máy cơ tự động bấm giờ thể
                          thao)
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
                          Đồng hồ cơ lên giây cót bằng tay ( Manual winding )
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
                            handleFilterChange("duong_kinh", "Dưới 25mm")
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
                            handleFilterChange("duong_kinh", "25mm đến 30mm")
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
                            handleFilterChange("duong_kinh", "30mm đến 35mm")
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
                            handleFilterChange("duong_kinh", "35mm đến 38mm")
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
                            handleFilterChange("duong_kinh", "38mm đến 40mm")
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
                            handleFilterChange("duong_kinh", "40mm đến 42mm")
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
                            handleFilterChange("duong_kinh", "42mm đến 45mm")
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
                            handleFilterChange("duong_kinh", "Từ 45mm trở lên")
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
                            handleFilterChange("chat_lieu_day", "Dây da")
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
                            handleFilterChange("chat_lieu_day", " Dây vải")
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
                            handleFilterChange("chat_lieu_day", " Dây cao su")
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
                            handleFilterChange("chat_lieu_day", "  Dây dù")
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
                            handleFilterChange("chat_lieu_day", " Titanium")
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
                            handleFilterChange("chat_lieu_day", "  Nhựa")
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
                            handleFilterChange("chat_lieu_vo", "Vàng 18K")
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
                            handleFilterChange("chat_lieu_vo", "Titanium")
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
                            handleFilterChange("chat_lieu_vo", "Ceramic")
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
                            handleFilterChange("mat_kinh", "Mặt kính cứng")
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
                            handleFilterChange("mat_kinh", "Hardlex Crystal")
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
                          onClick={() => handleFilterChange("mau_mat", "Hồng")}>
                          Hồng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xám"
                          onClick={() => handleFilterChange("mau_mat", "Xám")}>
                          Xám
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Đen"
                          onClick={() => handleFilterChange("mau_mat", "Đen")}>
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
                          onClick={() => handleFilterChange("mau_mat", "Vàng")}>
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
                          onClick={() => handleFilterChange("mau_mat", "Đỏ")}>
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
                          onClick={() => handleFilterChange("mau_mat", "Nâu")}>
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
                            handleFilterChange("phong_cach", "Sang trọng")
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
                            handleFilterChange("phong_cach", "Thời trang")
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
                            handleFilterChange("kieu_dang", "Mặt chữ nhật")
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
          {/*Menu-Đồng hồ nữ */}
          <div className="relative text-center bg-[#f3f3f3] text-[11px] uppercase pt-[14px] px-[0px] pb-[12px] mb-[33px] ">
            {/*field-title*/}
            <div className={styles["title-name"]}>
              {/*title-name*/}
              <h1 className=" text-[20px]">
                {categoryName === "Đồng hồ nữ"
                  ? categoryName
                  : `Đồng hồ ${categoryName}`}
              </h1>
              <div className={styles.clear}></div>
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

          <div className={styles.clear}></div>
          {/*Danh sách sản phẩm */}

          <section>
            <div>
              {/* show sản phẩm */}
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
                currentPage === 1 ? styles.disabled : styles["other-page"]
              }
              onClick={() => currentPage > 1 && handlePageChange(1)}>
              ‹‹
            </span>
            {/* Prev 1 trang */}
            <span
              className={
                currentPage === 1 ? styles.disabled : styles["other-page"]
              }
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }>
              ‹
            </span>
            {/* Trang hiện tại */}
            <span className={styles.currentPage}>{`Trang ${currentPage} / ${
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
                currentPage < totalPages && handlePageChange(currentPage + 1)
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
          <h2 dir="ltr" style={{ textAlign: "center", fontSize: "30px" }}>
            <strong>TƯ VẤN LỰA CHỌN ĐỒNG HỒ NỮ TỪ A - Z</strong>
          </h2>

          <p dir="ltr" style={{ textAlign: "justify" }}>
            Bạn đang tìm kiếm một chiếc đồng hồ nữ hàng hiệu hoàn hảo để tôn lên
            phong cách thời trang và khẳng định đẳng cấp của bản thân? Thế giới
            đồng hồ đeo tay nữ vô cùng đa dạng với vô số thương hiệu, kiểu dáng
            và mức giá, khiến bạn băn khoăn không biết lựa chọn thế nào? Đừng lo
            lắng, Duy Anh Watch sẽ giúp bạn tìm được chiếc{" "}
            <strong>đồng hồ nữ đẹp</strong> và phù hợp nhất!
          </p>
          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nữ"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonu-hinh1.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h2 dir="ltr" className={styles.justifyText}>
            <strong>1. CÁC THƯƠNG HIỆU ĐỒNG HỒ NỮ ĐƯỢC ƯA CHUỘNG NHẤT</strong>
          </h2>

          <p dir="ltr" className={styles.justifyText}>
            Thế giới <strong>đồng hồ nữ chính hãng</strong> luôn đa dạng, phong
            phú với sự cạnh tranh gay gắt của hàng trăm thương hiệu nổi tiếng
            trên thế giới từ Nhật Bản, Thụy Sỹ, Mỹ, Thụy Điển…khiến cho phái nữ
            sẽ bị “nhiễu loạn” khi không biết phải lựa chọn cái tên nào.
          </p>
          <p dir="ltr" className={styles.justifyText}>
            Hiện nay, thương hiệu <strong>đồng hồ nữ được ưa chuộng</strong> bao
            gồm: <strong>MIDO,</strong>
            <strong>Tissot</strong>, <strong>Seiko</strong>,{" "}
            <strong>Citizen</strong>, <strong>Orient</strong>,{" "}
            <strong>Daniel Wellington (DW)</strong>,{" "}
            <strong>Calvin Klein</strong>, <strong>Olympia Star</strong>,{" "}
            <strong>Olym Pianus</strong>…với mức giá khá dễ tiếp cận mang thiết
            kế rất trẻ trung, năng động hoặc đầy đủ các phong cách mà phái đẹp
            theo đuổi. Đồng hồ nữ cao cấp hơn cho sự lựa chọn của phái đẹp chính
            là thương hiệu{" "}
            <strong style={{ color: "#3498db" }}>đồng hồ Longines</strong> - một
            trong những hãng sản xuất đồng hồ rất được ưa chuộng trên thị trường
            Việt Nam nói riêng và thế giới nói chung khi luôn mang đến các thiết
            kế sang trọng nhưng không kém phần thanh lịch dành cho phái đẹp
          </p>
          <br />
          <h2 dir="ltr" className={styles.justifyText}>
            <strong>2. TƯ VẤN LỰA CHỌN ĐỒNG HỒ NỮ PHÙ HỢP:</strong>
          </h2>
          <br />
          <h3 dir="ltr" className={styles.justifyText}>
            <strong>2.1. Lựa chọn đồng hồ đeo tay nữ theo nghề nghiệp:</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            <strong>- Đối với nữ doanh nhân:</strong> Lý tưởng nhất đối với nữ
            doanh nhân là những mẫu <strong>đồng hồ nữ đẳng cấp</strong>, sang
            trọng, lịch sự ở phân khúc giá cao cấp hơn, có sự xuất hiện của
            những trang bị đắt giá như đá quý, kim cương hay vàng 18K.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nữ rolex"
              height="375"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonu-hinh3.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <p dir="ltr" className={styles.justifyText}>
            <strong>- Đối với dân công sở:</strong> Phái nữ nên chọn những mẫu
            đồng Dress Watch với những đường nét tinh tế, đơn giản, lịch sự và
            hoàn toàn không cần để tâm đến chất liệu dây cũng như độ chịu nước
            của đồng hồ. Có khá nhiều hãng để lựa chọn cho phong cách công sở
            này như MIDO, Tissot, Seiko, Citizen, Orient, Daniel Wellington,
            Calvin Klein, Olympia Star, Olym Pianus
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nữ tissot"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonu-hinh4.jpg"
            />
          </p>
          <br />
          <p dir="ltr" className={styles.justifyText}>
            <strong>
              - Đối với cô nàng hoạt động trong lĩnh vực thể thao hoặc môi
              trường ngoài trời:
            </strong>{" "}
            Trong những môi trường như vậy, mẫu phụ kiện đồng hành cùng mỗi cô
            gái phải có khả năng chống chịu lực tốt và phải thật bền trong những
            điều kiện bụi bẩn, mưa gió, nắng cháy. Đáp ứng điều này thì một mẫu
            <strong>đồng hồ nữ thể thao</strong> năng động, chắc chắn, dây kim
            loại, dây cao su, nhựa, mẫu đồng hồ có khả năng chống sốc, chống va
            chạm mạnh sẽ là lựa chọn lý tưởng số 1. Điển hình là các dòng{" "}
            <strong>đồng hồ nữ phong cách thể thao</strong>, Tissot Seastar
            Wilson WNBA T120.807.17.051.00, T120.410.17.011.00 của hãng Tissot,
            hay đồng nữ hồ G-Shock của hãng đồng hồ Casio....
          </p>
          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nữ tissot"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonu-hinh4.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <h2 className={styles.heading}>
            <strong>3. ĐỊA CHỈ MUA ĐỒNG HỒ NAM CHÍNH HÃNG UY TÍN</strong>
          </h2>

          <p className={styles.justifyText}>
            Cuối cùng, lựa chọn một
            <strong>
              <em>cửa hàng đồng hồ nữ uy tín</em>
            </strong>
            &nbsp;để mua chiếc đồng hồ ưng ý nhất cũng là vấn đề quan trọng.
          </p>

          <p dir="ltr" className={styles.justifyText}>
            <strong className={styles.strongText}>Wristly Watch</strong> là nhà
            phân phối được ủy quyền chính thức của các thương hiệu đồng hồ hàng
            đầu thế giới của Thụy Sĩ:
            <em>
              <strong>
                <Link href="#">Longines</Link>, <Link href="#">Tissot</Link>,{" "}
                <Link href="#">Mido</Link>, <Link href="#">Hamilton</Link>,
                <Link href="#">Certina</Link>, <Link href="#">Titoni</Link>,{" "}
                <Link href="#">Frederique Constant</Link>
              </strong>
            </em>
            … thương hiệu đồng hồ thời trang
            <em>
              <strong>
                <Link href="#">Daniel Wellington (DW)</Link>
              </strong>
            </em>
            &nbsp;của Thụy Điển do Filip Tysander thành lập năm 2011 nhưng đã có
            bước tăng trưởng thần kỳ vào năm 2015 (với hơn 4700% doanh
            thu)&nbsp;và các thương hiệu đồng hồ Nhật Bản nổi tiếng về chất
            lượng và độ bền&nbsp;như
            <em>
              <strong>
                <Link href="#">Seiko</Link>, <Link href="#">Citizen</Link>,{" "}
                <Link href="#">Orient</Link>,<Link href="#">Casio</Link>
              </strong>
            </em>
            … Với hệ thống cửa hàng nằm ở những vị trí đắc địa, cơ sở vật chất
            đẳng cấp cho phép khách hàng đánh giá cao trải nghiệm mua sắm đồng
            hồ, đồng thời được hưởng lợi từ dịch vụ chuyên nghiệp và xuất sắc.
          </p>

          <p dir="ltr" className={styles.justifyText}>
            Tất cả các sản phẩm hiện có trong hệ thống cửa hàng của chúng tôi
            đều được bảo hành chính hãng từ 1 đến 3 năm tùy theo mặt hàng và
            điều kiện riêng của thương hiệu. Bên cạnh đó bạn còn nhận được gói
            bảo hành 5 năm cùng nhiều quyền lợi hấp dẫn tại
            <Link href="#">
              <strong className={styles.strongText}>Đồng hồ Wristly</strong>
            </Link>
            .
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <hr />

          <hr />

          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
        </div>
        {/* Xem thêm   */}
        <div className={styles.summaryContent}>
          <span onClick={toggleDescription}>
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </span>
        </div>
        <div className={styles.clear}></div>
        <div className={`${styles.aq_relates} ${styles.content_li}`}></div>
      </div>

      {/* end đồng hồ nữ   */}
      <div className={styles.clear}></div>
    </>
  );
}
