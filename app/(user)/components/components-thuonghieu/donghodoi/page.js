"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./donghodoi.module.css";
import Loading from "../../loading/page";
import cx from "classnames";
export default function DonghoDoi() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mô tả
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("Đồng hồ đôi");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    gioi_tinh: "Đồng Hồ Đôi",
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
  const laySanPham = async () => {
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
    laySanPham();
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
    setCurrentPage(1);
    if (filterType === "thuong_hieu") {
      setCategoryName(value);
    }
  };
  const xoaTatCaBoLoc = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "Đồng Hồ Đôi",
    });
    setCurrentPage(1);
    setCategoryName("Đồng hồ đôi");
    laySanPham();
  };
  const xoaBoLoc = (filterToRemove) => {
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" };
    if (filterType === "thuong_hieu") {
      setCategoryName("Đồng hồ đôi");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    laySanPham();
  };
  const sapXepSanPham = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_giam - b.gia_giam);
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_giam - a.gia_giam);
    }
    return products;
  };
  const capNhatSapXep = (e) => {
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
  const sanPhamHienThi = sapXepSanPham(products);
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
              ĐỒNG HỒ ĐÔI
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
            }}
          >
            {" "}
            {/*summary-content-filter*/}
            <p className="sm:text-[16px] text-[14px] italic leading-[24px] mb-[10px]">
              Tình yêu luôn là thứ cảm xúc đặc biệt hơn bao giờ hết. Đó là sự
              gắn kết hai trái tim nếm trải mọi cung bậc cảm xúc: đau khổ, buồn,
              vui, hạnh phúc để có một cái kết viên mãn. Đồng hành trên chặng
              đường yêu không thể thiếu đi đồng hồ đôi - vật chứng tình yêu vừa
              thiết thực vừa ý nghĩa. Đồng hồ đôi (đồng hồ cặp) với đầy đủ kiểu
              dáng từ đồng hồ cặp thiết kế mỏng nhẹ, thanh lịch, sang trọng hoặc
              cá tính, thời trang…sẽ đáp ứng mọi sở thích của đôi tình nhân.
            </p>
            <br />
          </div>
          <div
            className={`${styles.viewMore} sm:block sm:h-auto lg:hidden `}
            onClick={toggleDescription}
          >
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
                onClick={() => xoaBoLoc(filter)}
              >
                {filter.split("=")[1]} {/*Hiển thị các bộ lọc đã chọn*/}
              </Link>
            ))}
            <Link
              className="bg-[red] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px]  after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
              rel="nofollow"
              href="#"
              onClick={xoaTatCaBoLoc}
            >
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
                className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"} `}
              >
                {/*field-item*/}
                <div
                  className="cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                  onClick={toggleDropdown}
                >
                  Giới tính
                </div>{" "}
                {/*field-name*/}
                {isDropdownVisible && (
                  <div
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[400px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] `}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    {/*close*/}
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {" "}
                      {/*filters-in-field-inner*/}
                      {/*cls*/}
                      <Link
                        rel="nofollow"
                        href="/components/components-thuonghieu/donghonam"
                        title="Đồng hồ nam"
                      >
                        <span>Đồng hồ nam</span>
                      </Link>
                      <Link
                        rel="nofollow"
                        href="/components/components-thuonghieu/donghonu"
                        title="Đồng hồ nữ"
                      >
                        <span>Đồng hồ nữ</span>
                      </Link>
                      <Link
                        rel="nofollow"
                        href="/components/components-thuonghieu/donghodoi"
                        title="Đồng hồ đôi"
                      >
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
                  onClick={toggleDropdown}
                >
                  Thương hiệu
                </div>
                {isDropdownVisible && (
                  <div
                    id="brand"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[600px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[11px] sm:text-[14px] ${styles["filters-in-field-3-column"]}`}
                  >
                    {/**/}
                    {/*filters-in-field-3-column*/}
                    {/*filter-brand*/}
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="LONGINES"
                          onClick={() =>
                            capNhatBoLoc("thuong_hieu", "LONGINES")
                          }
                        >
                          LONGINES
                        </Link>
                      </div>
                      {/* item2*/}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="TISSOT"
                          onClick={() => capNhatBoLoc("thuong_hieu", "TISSOT")}
                        >
                          TISSOT
                        </Link>
                      </div>
                      {/* item3*/}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="MIDO"
                          onClick={() => capNhatBoLoc("thuong_hieu", "MIDO")}
                        >
                          MIDO
                        </Link>
                      </div>
                      {/* item4 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CERTINA"
                          onClick={() => capNhatBoLoc("thuong_hieu", "CERTINA")}
                        >
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
                            capNhatBoLoc("thuong_hieu", "HAMILTON")
                          }
                        >
                          HAMILTON
                        </Link>
                      </div>
                      {/* item6 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="TITONI"
                          onClick={() => capNhatBoLoc("thuong_hieu", "TITONI")}
                        >
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
                            capNhatBoLoc("thuong_hieu", "FREDERIQUECONSTANT")
                          }
                        >
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
                            capNhatBoLoc("thuong_hieu", "CALVINKLEIN")
                          }
                        >
                          CALVIN KLEIN
                        </Link>
                      </div>
                      {/* item9*/}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="EDOX"
                          onClick={() => capNhatBoLoc("thuong_hieu", "EDOX")}
                        >
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
                            capNhatBoLoc("thuong_hieu", "CLAUDEBERNARD")
                          }
                        >
                          CLAUDE BERNARD
                        </Link>
                      </div>
                      {/* item11 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="SEIKO"
                          onClick={() => capNhatBoLoc("thuong_hieu", "SEIKO")}
                        >
                          SEIKO
                        </Link>
                      </div>
                      {/* item12 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CITIZEN"
                          onClick={() => capNhatBoLoc("thuong_hieu", "CITIZEN")}
                        >
                          CITIZEN
                        </Link>
                      </div>
                      {/* item13 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="ORIENT"
                          onClick={() => capNhatBoLoc("thuong_hieu", "ORIENT")}
                        >
                          ORIENT
                        </Link>
                      </div>
                      {/* item14 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CASIO"
                          onClick={() => capNhatBoLoc("thuong_hieu", "CASIO")}
                        >
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
                            capNhatBoLoc("thuong_hieu", "OLYMPIANUS")
                          }
                        >
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
                            capNhatBoLoc("thuong_hieu", "DANIELWELLINGTON")
                          }
                        >
                          DANIEL WELLINGTON
                        </Link>
                      </div>
                      {/* item17 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="FOSSIL"
                          onClick={() => capNhatBoLoc("thuong_hieu", "FOSSIL")}
                        >
                          FOSSIL
                        </Link>
                      </div>
                      {/* item18 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="SKAGEN"
                          onClick={() => capNhatBoLoc("thuong_hieu", "SKAGEN")}
                        >
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
                            capNhatBoLoc("thuong_hieu", "MICHAELKORS")
                          }
                        >
                          MICHAEL KORS
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mức giá */}
              <div
                className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"}  `}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                  onClick={toggleDropdown}
                >
                  Mức giá
                </div>
                {isDropdownVisible && (
                  <div
                    id="price"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]  `}
                  >
                    {/*filters-in-field-1-column*/}
                    {/*filter-4-price*/}
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Dưới 2 triệu"
                          onClick={() =>
                            capNhatBoLoc("muc_gia", "Dưới 2 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 2 triệu đến 5 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 5 triệu đến 10 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 10 triệu đến 20 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 20 triệu đến 30 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 30 triệu đến 50 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Từ 50 triệu đến 100 triệu")
                          }
                        >
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
                            capNhatBoLoc("muc_gia", "Trên 100 triệu")
                          }
                        >
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
                  onClick={toggleDropdown}
                >
                  Khuyến mại
                </div>
                {isDropdownVisible && (
                  <div
                    id="discount"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 10%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 10%")}
                        >
                          Giảm 10%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 15%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 15%")}
                        >
                          Giảm 15%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 20%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 20%")}
                        >
                          Giảm 20%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 25%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 25%")}
                        >
                          Giảm 25%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 30%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 30%")}
                        >
                          Giảm 30%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 40%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 40%")}
                        >
                          Giảm 40%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 50%"
                          onClick={() => capNhatBoLoc("khuyenmai", "Giảm 50%")}
                        >
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
                } ${"phone-sm:ml-[5px]"}`}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                    styles.normal
                  } ${styles.field} ${styles["field-opened"]}`}
                  data-id="id-field-loai-may"
                  onClick={toggleDropdown}
                >
                  Loại máy
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="loai-may"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Automatic (Máy cơ tự động)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Automatic (Máy cơ tự động)"
                            )
                          }
                        >
                          Automatic (Máy cơ tự động)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quartz (Máy pin - điện tử)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Quartz (Máy pin - điện tử)"
                            )
                          }
                        >
                          Quartz (Máy pin - điện tử)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Eco-Drive (Năng lượng ánh sáng)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Eco-Drive (Năng lượng ánh sáng)"
                            )
                          }
                        >
                          Eco-Drive (Năng lượng ánh sáng)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quartz Chronograph (Máy pin bấm giờ thể thao)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Quartz Chronograph (Máy pin bấm giờ thể thao)"
                            )
                          }
                        >
                          Quartz Chronograph (Máy pin bấm giờ thể thao)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Automatic Chronometer (Máy cơ tự động chuẩn COSC)"
                            )
                          }
                        >
                          Automatic Chronometer (Máy cơ tự động chuẩn COSC)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quartz Chronometer (Máy pin chuẩn COSC)"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Quartz Chronometer (Máy pin chuẩn COSC)"
                            )
                          }
                        >
                          Quartz Chronometer (Máy pin chuẩn COSC)
                        </Link>
                      </div>
                      <div
                        className={`${styles.cls} ${styles.item}`}
                        onClick={() =>
                          capNhatBoLoc(
                            "loai_may",
                            "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)"
                          )
                        }
                      >
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)"
                        >
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
                            capNhatBoLoc(
                              "loai_may",
                              "Quartz Solar (Năng lượng ánh sáng)"
                            )
                          }
                        >
                          Quartz Solar (Năng lượng ánh sáng)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                          onClick={() =>
                            capNhatBoLoc(
                              "loai_may",
                              "Đồng hồ cơ lên giây cót bằng tay ( Manual winding )"
                            )
                          }
                        >
                          Đồng hồ cơ lên giây cót bằng tay ( Manual winding )
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*Đường kính */}
              <div
                className={`${styles["field-area"]} ${styles["field-item"]}`}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                    styles.normal
                  } ${styles.field} ${styles["field-opened"]}`}
                  data-id="id-field-duong-kinh"
                  onClick={toggleDropdown}
                >
                  Đường kính
                </div>
                {isDropdownVisible && (
                  <div
                    id="duong-kinh"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filter-4-duong-kinh"]}`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Dưới 25mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "Dưới 25mm")
                          }
                        >
                          Dưới 25mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="25mm đến 30mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "25mm đến 30mm")
                          }
                        >
                          25mm đến 30mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="30mm đến 35mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "30mm đến 35mm")
                          }
                        >
                          30mm đến 35mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="35mm đến 38mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "35mm đến 38mm")
                          }
                        >
                          35mm đến 38mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="38mm đến 40mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "38mm đến 40mm")
                          }
                        >
                          38mm đến 40mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="40mm đến 42mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "40mm đến 42mm")
                          }
                        >
                          40mm đến 42mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="42mm đến 45mm"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "42mm đến 45mm")
                          }
                        >
                          42mm đến 45mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 45mm trở lên"
                          onClick={() =>
                            capNhatBoLoc("duong_kinh", "Từ 45mm trở lên")
                          }
                        >
                          Từ 45mm trở lên
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*Chất liệu dây  */}
              <div
                className={`${styles["field-area"]} ${styles["field-item"]}  `}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"}`}
                  onClick={toggleDropdown}
                >
                  Chất liệu đây
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="duong-kinh"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]} `}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/*item1 */}
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
                      {/*item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L"
                          onClick={() =>
                            capNhatBoLoc("chat_lieu_day", "Thép không gỉ 316L")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              "Thép không gỉ 316L mạ vàng công nghệ PVD"
                            )
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              "Thép không gỉ 316L dạng lưới"
                            )
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              " Thép không gỉ 316L dạng lắc"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_day", " Dây vải")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              " Thép không gỉ 316L/ Vàng 18K"
                            )
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              " Thép không gỉ 316L/ Ceramic"
                            )
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              "Thép không gỉ mạ công nghệ PVD"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_day", " Dây cao su")
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_day", "  Dây dù")
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_day", " Titanium")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_day",
                              "itanium mạ vàng công nghệ PVD"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_day", "  Nhựa")
                          }
                        >
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
                  onClick={toggleDropdown}
                >
                  Chất liệu vỏ
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="chat-lieu-vo"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]}`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/*item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L"
                          onClick={() =>
                            capNhatBoLoc("chat_lieu_vo", "Thép không gỉ 316L")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_vo",
                              "Thép không gỉ mạ vàng công nghệ PVD"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_vo", "Vàng 18K")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_vo",
                              "Thép không gỉ 316L/ Vàng 18K"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_vo", "Titanium")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_vo",
                              "Titanium mạ công nghệ PVD"
                            )
                          }
                        >
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
                            capNhatBoLoc("chat_lieu_vo", "Ceramic")
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_vo",
                              "Thép không gỉ 316L/ Ceramic"
                            )
                          }
                        >
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
                            capNhatBoLoc(
                              "chat_lieu_vo",
                              "Thép không gỉ mạ công nghệ PVD"
                            )
                          }
                        >
                          Thép không gỉ mạ công nghệ PVD
                        </Link>
                      </div>
                      {/*item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Nhựa"
                          onClick={() => capNhatBoLoc("chat_lieu_vo", "Nhựa")}
                        >
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
                            capNhatBoLoc("chat_lieu_vo", "Titanium/ Vàng 18K")
                          }
                        >
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
                } ${"phone-sm:ml-[5px]"}${" "} `}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                  data-id="id-field-mat-kinh"
                  onClick={toggleDropdown}
                >
                  Mặt kính
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="mat-kinh"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] `}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Sapphire"
                          onClick={() => capNhatBoLoc("mat_kinh", "Sapphire")}
                        >
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
                            capNhatBoLoc("mat_kinh", "Mặt kính cứng")
                          }
                        >
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
                            capNhatBoLoc("mat_kinh", "Hardlex Crystal")
                          }
                        >
                          Hardlex Crystal
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mica"
                          onClick={() => capNhatBoLoc("mat_kinh", "Mica")}
                        >
                          Mica
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Kinh Nhựa"
                          onClick={() => capNhatBoLoc("mat_kinh", "Kinh Nhựa")}
                        >
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
                  onClick={toggleDropdown}
                >
                  Màu mặt
                </div>
                {isDropdownVisible && (
                  <div
                    id="mau-mat"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[500px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filters-in-field-2-column"]}`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Trắng"
                          onClick={() => capNhatBoLoc("mau_mat", "Trắng")}
                        >
                          Trắng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Hồng"
                          onClick={() => capNhatBoLoc("mau_mat", "Hồng")}
                        >
                          Hồng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xám"
                          onClick={() => capNhatBoLoc("mau_mat", "Xám")}
                        >
                          Xám
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Đen"
                          onClick={() => capNhatBoLoc("mau_mat", "Đen")}
                        >
                          Đen
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xanh lam"
                          onClick={() => capNhatBoLoc("mau_mat", "Xanh lam")}
                        >
                          Xanh lam
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Vàng"
                          onClick={() => capNhatBoLoc("mau_mat", "Vàng")}
                        >
                          Vàng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Khảm trai"
                          onClick={() => capNhatBoLoc("mau_mat", "Khảm trai")}
                        >
                          Khảm trai
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Đỏ"
                          onClick={() => capNhatBoLoc("mau_mat", "Đỏ")}
                        >
                          Đỏ
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Da Cam"
                          onClick={() => capNhatBoLoc("mau_mat", "Da Cam")}
                        >
                          Da Cam
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xanh Lá"
                          onClick={() => capNhatBoLoc("mau_mat", "Xanh Lá")}
                        >
                          Xanh Lá
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Nâu"
                          onClick={() => capNhatBoLoc("mau_mat", "Nâu")}
                        >
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
                } ${"phone-sm:ml-[5px]"}${" "} `}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} `}
                  data-id="id-field-phong-cach"
                  onClick={toggleDropdown}
                >
                  Phong cách
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="phong-cach"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px]`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Sang trọng"
                          onClick={() =>
                            capNhatBoLoc("phong_cach", "Sang trọng")
                          }
                        >
                          Sang trọng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thể thao"
                          onClick={() => capNhatBoLoc("phong_cach", "Thể thao")}
                        >
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
                            capNhatBoLoc("phong_cach", "Thể thao sang trọng")
                          }
                        >
                          Thể thao sang trọng
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quân đội"
                          onClick={() => capNhatBoLoc("phong_cach", "Quân đội")}
                        >
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
                            capNhatBoLoc("phong_cach", "Thời trang")
                          }
                        >
                          Thời trang
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Hiện đại"
                          onClick={() => capNhatBoLoc("phong_cach", "Hiện đại")}
                        >
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
                  onClick={toggleDropdown}
                >
                  Kiểu dáng
                </div>{" "}
                {isDropdownVisible && (
                  <div
                    id="kieu-dang"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} w-full phone-sm:w-full sm:w-full phone-sm:text-[12px] sm:text-[14px]`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px]  w-40 border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt vuông"
                          onClick={() => capNhatBoLoc("kieu_dang", "Mặt vuông")}
                        >
                          Mặt vuông
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt tròn"
                          onClick={() => capNhatBoLoc("kieu_dang", "Mặt tròn")}
                        >
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
                            capNhatBoLoc("kieu_dang", "Mặt chữ nhật")
                          }
                        >
                          Mặt chữ nhật
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt Oval"
                          onClick={() => capNhatBoLoc("kieu_dang", "Mặt Oval")}
                        >
                          Mặt Oval
                        </Link>
                      </div>
                      {/* item1 */}
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Khác"
                          onClick={() => capNhatBoLoc("kieu_dang", "Khác")}
                        >
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
                } ${" "}`}
              >
                <div
                  className={`${"cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"} ${
                    styles.normal
                  } ${styles.field} ${styles["field-opened"]}`}
                  data-id="id-field-xuat-xu-thuong-hieu"
                  onClick={toggleDropdown}
                >
                  Xuất xứ thương hiệu
                </div>
                {isDropdownVisible && (
                  <div
                    id="xuat-xu-thuong-hieu"
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[320px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] ${styles["filter-4-xuat-xu-thuong-hieu"]}`}
                  >
                    <span
                      className={`${styles["close"]} lg:hidden sm:block phone-sm:block`}
                      onClick={toggleDropdown}
                    >
                      x
                    </span>
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.cls
                      }`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Nhật Bản"
                          onClick={() => capNhatBoLoc("xuat_xu", "Nhật Bản")}
                        >
                          Nhật Bản
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thụy Sỹ"
                          onClick={() => capNhatBoLoc("xuat_xu", "Thụy Sỹ")}
                        >
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
                {" "}
                {categoryName === "Đồng hồ đôi"
                  ? categoryName
                  : `Đồng hồ ${categoryName}`}
              </h1>
              <div className={styles.clear}></div>
            </div>

            <select
              className="absolute lg:top-2 lg:right-3 top-[100%] right-[0px] sm:border sm:border-[#e6e6e6] lg:border-none  sm:bg-[#f3f3f3] py-[8px] text-[#5d5d5d] cursor-pointer"
              name="order-select"
              onChange={capNhatSapXep}
            >
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
                className={`${styles["product-grid"]} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-3`}
              >
                {sanPhamHienThi.map((product) => {
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
              onClick={() => currentPage > 1 && thayDoiTrang(1)}
            >
              ‹‹
            </span>
            {/* Prev 1 trang */}
            <span
              className={
                currentPage === 1 ? styles.disabled : styles["other-page"]
              }
              onClick={() => currentPage > 1 && thayDoiTrang(currentPage - 1)}
            >
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
                currentPage < totalPages && thayDoiTrang(currentPage + 1)
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
                currentPage < totalPages && thayDoiTrang(totalPages)
              }
            >
              ››
            </span>
          </div>
        </div>
        <div className={styles.clear}></div>
      </div>

      <div className={styles.clear}></div>
    </>
  );
}
