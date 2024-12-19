"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../donghonam/donghonam.module.css";
import Loading from "../../loading/page";
import cx from "classnames";
export default function DonghoNam() {
  // State quản lý dữ liệu và trạng thái chung
  const [products, setProducts] = useState([]); // Danh sách sản phẩm hiện tại
  const [categoryName, setCategoryName] = useState("Đồng hồ nam"); // Tiêu đề danh mục
  const [selectedFilter, setSelectedFilter] = useState([]); // Lưu trữ các bộ lọc đã chọn
  const [sortOption, setSortOption] = useState(""); // Tuỳ chọn sắp xếp (tăng/giảm dần)
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [isExpanded1, setIsExpanded1] = useState(false); // Trạng thái mô tả
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mô tả
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bộ lọc mặc định cho đồng hồ nam
  const [filter, setFilter] = useState({
    gioi_tinh: "Nam",
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
      const response = await fetch(`http://localhost:5000/product/filtersanphamdongho?${queryParams}`);
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
    const filterIndex = newFilters.findIndex((filter) => filter.startsWith(`${filterType}=`));
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
      gioi_tinh: "Nam",
    });
    setCurrentPage(1);
    setCategoryName("Đồng hồ nam");
    fetchProducts();
  };

  // 6. Hàm xóa một bộ lọc cụ thể
  const handleRemoveFilter = (filterToRemove) => {
    // Loại bỏ bộ lọc cụ thể khỏi selectedFilter
    const newFilters = selectedFilter.filter((filter) => filter !== filterToRemove);

    // Cập nhật filter dựa trên các bộ lọc còn lại
    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" }; // Xóa giá trị của bộ lọc bị xoá

    // Nếu xoá danh mục (brand), đặt lại tiêu đề về đồng hồ nam
    if (filterType === "thuong_hieu") {
      setCategoryName("Đồng hồ nam");
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

  // 10. Hiển thị dropdown
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
        <div className={cx("flex", "items-center uppercase  md:text-[16px] text-[10px] mb-5 mt-6")}>
          <span className={cx("")}>
            <Link href="/" className={cx(" text-gray-800", "hover:text-[#796752]")}>
              Trang chủ
            </Link>
          </span>
          <span className={cx("separator", "mx-3", "text-stone-400")}> &gt; </span>

          <span className={cx("", "text-red-500")}>
            <Link href="/components/components-thuonghieu/donghonam" className={cx("link", "text-red-500")}>
              {" "}
              ĐỒNG HỒ NAM
            </Link>
          </span>
        </div>
        <div className={styles.clear}></div>
        <div className="relative">
          <div
            className="mt-[25px] mb-[20px] overflow-hidden relative "
            style={{
              height: isExpanded ? "auto" : "75px",
              overflow: isExpanded ? "visible" : "hidden",
            }}
          >
            <p className="text-sm italic leading-6">
              Đến với thế giới <strong>đồng hồ nam</strong> của Wristly, bạn sẽ được sở hữu hàng nghìn sản phẩm chất
              lượng, thiết kế bắt mắt đến từ các thương hiệu&nbsp;
              <em>
                <strong>
                  <Link href="#" target="_blank">
                    đồng hồ&nbsp;Thụy Sỹ
                  </Link>
                </strong>
              </em>
              , Nhật Bản, Pháp, Mỹ…danh tiếng trên thế giới. Mọi sản phẩm đều đảm bảo
              <strong>&nbsp;100% hàng chính hãng</strong> kèm theo <strong>chế độ bảo hành chính hãng</strong> đặc biệt
              với mức giá hợp lý sẽ đem đến cho bạn phụ kiện hoàn hảo nhất; khẳng định đẳng cấp, phong cách riêng của
              bản thân
            </p>
          </div>

          <div className={`${styles.viewMore} sm:block sm:h-auto lg:hidden `} onClick={toggleDescription}>
            <span onClick={toggleDescription}>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
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
                onClick={() => handleRemoveFilter(filter)}
              >
                {filter.split("=")[1]}
              </Link>
            ))}
            <Link
              className="bg-[red] text-white mr-[2px] mb-[2px] inline-block relative text-xs pt-[3px] pr-[24px] pb-[3px] pl-[9px]  after:content-['X'] after:absolute after:top-[3px] after:right-[2px] after:w-[15px] after:h-[13px] after:text-white after:z-10 after:text-[12px]"
              rel="nofollow"
              href="#"
              onClick={handleClearFilters}
            >
              Xoá hết
            </Link>
          </div>
        )}

        <div className={styles.clear}></div>
        <div>
          <div className="border-t border-[#e5e5e5] border-b mt-[15px] mb-[5px]">
            <div className="phone-sm:grid phone-sm:grid-cols-2 phone-sm:gap-x-4    sm:grid sm:grid-cols-2  lg:flex lg:space-x-4">
              {/* Giới tính */}
              <div className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"} `}>
                <div
                  className="cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                  onClick={toggleDropdown}
                >
                  Giới tính
                </div>

                {isDropdownVisible && (
                  <div
                    className={`${styles["field-label"]} ${styles["filters-in-field"]} lg:w-[400px] phone-sm:w-[180px] sm:w-[220px] phone-sm:text-[12px] sm:text-[14px] `}
                  >
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
                      x
                    </span>
                    {/*close*/}
                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"} ${
                        styles.cls
                      }`}
                    >
                      <Link rel="nofollow" href="/components/components-thuonghieu/donghonam" title="Đồng hồ nam">
                        <span>Đồng hồ nam</span>
                      </Link>
                      <Link rel="nofollow" href="/components/components-thuonghieu/donghonu" title="Đồng hồ nữ">
                        <span>Đồng hồ nữ</span>
                      </Link>
                      <Link rel="nofollow" href="/components/components-thuonghieu/donghodoi" title="Đồng hồ đôi">
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="LONGINES"
                          onClick={() => handleFilterChange("thuong_hieu", "LONGINES")}
                        >
                          LONGINES
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="TISSOT"
                          onClick={() => handleFilterChange("thuong_hieu", "TISSOT")}
                        >
                          TISSOT
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="MIDO"
                          onClick={() => handleFilterChange("thuong_hieu", "MIDO")}
                        >
                          MIDO
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CERTINA"
                          onClick={() => handleFilterChange("thuong_hieu", "CERTINA")}
                        >
                          CERTINA
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="HAMILTON"
                          onClick={() => handleFilterChange("thuong_hieu", "HAMILTON")}
                        >
                          HAMILTON
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="TITONI"
                          onClick={() => handleFilterChange("thuong_hieu", "TITONI")}
                        >
                          TITONI
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="FREDERIQUECONSTANT"
                          onClick={() => handleFilterChange("thuong_hieu", "FREDERIQUECONSTANT")}
                        >
                          FREDERIQUE CONSTANT
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CALVINKLEIN"
                          onClick={() => handleFilterChange("thuong_hieu", "CALVINKLEIN")}
                        >
                          CALVIN KLEIN
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="EDOX"
                          onClick={() => handleFilterChange("thuong_hieu", "EDOX")}
                        >
                          EDOX
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CLAUDEBERNARD"
                          onClick={() => handleFilterChange("thuong_hieu", "CLAUDEBERNARD")}
                        >
                          CLAUDE BERNARD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="SEIKO"
                          onClick={() => handleFilterChange("thuong_hieu", "SEIKO")}
                        >
                          SEIKO
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CITIZEN"
                          onClick={() => handleFilterChange("thuong_hieu", "CITIZEN")}
                        >
                          CITIZEN
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="ORIENT"
                          onClick={() => handleFilterChange("thuong_hieu", "ORIENT")}
                        >
                          ORIENT
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="CASIO"
                          onClick={() => handleFilterChange("thuong_hieu", "CASIO")}
                        >
                          CASIO
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="OLYMPIANUS"
                          onClick={() => handleFilterChange("thuong_hieu", "OLYMPIANUS")}
                        >
                          OLYM PIANUS
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="DANIELWELLINGTON"
                          onClick={() => handleFilterChange("thuong_hieu", "DANIELWELLINGTON")}
                        >
                          DANIEL WELLINGTON
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="FOSSIL"
                          onClick={() => handleFilterChange("thuong_hieu", "FOSSIL")}
                        >
                          FOSSIL
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="SKAGEN"
                          onClick={() => handleFilterChange("thuong_hieu", "SKAGEN")}
                        >
                          SKAGEN
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="MICHAELKORS"
                          onClick={() => handleFilterChange("thuong_hieu", "MICHAELKORS")}
                        >
                          MICHAEL KORS
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mức giá */}
              <div className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"}  `}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Dưới 2 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Dưới 2 triệu")}
                        >
                          Dưới 2 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 2 triệu đến 5 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 2 triệu đến 5 triệu")}
                        >
                          Từ 2 triệu đến 5 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 5 triệu đến 10 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 5 triệu đến 10 triệu")}
                        >
                          Từ 5 triệu đến 10 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 10 triệu đến 20 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 10 triệu đến 20 triệu")}
                        >
                          Từ 10 triệu đến 20 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 20 triệu đến 30 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 20 triệu đến 30 triệu")}
                        >
                          Từ 20 triệu đến 30 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 30 triệu đến 50 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 30 triệu đến 50 triệu")}
                        >
                          Từ 30 triệu đến 50 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 50 triệu đến 100 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Từ 50 triệu đến 100 triệu")}
                        >
                          Từ 50 triệu đến 100 triệu
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Trên 100 triệu"
                          onClick={() => handleFilterChange("muc_gia", "Trên 100 triệu")}
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 10%")}
                        >
                          Giảm 10%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 15%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 15%")}
                        >
                          Giảm 15%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 20%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 20%")}
                        >
                          Giảm 20%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 25%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 25%")}
                        >
                          Giảm 25%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 30%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 30%")}
                        >
                          Giảm 30%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 40%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 40%")}
                        >
                          Giảm 40%
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Giảm 50%"
                          onClick={() => handleFilterChange("khuyenmai", "Giảm 50%")}
                        >
                          Giảm 50%
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Loại máy */}
              <div className={`${styles["field-area"]} ${styles["field-item"]} ${"phone-sm:ml-[5px]"}`}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          onClick={() => handleFilterChange("loai_may", "Automatic (Máy cơ tự động)")}
                        >
                          Automatic (Máy cơ tự động)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quartz (Máy pin - điện tử)"
                          onClick={() => handleFilterChange("loai_may", "Quartz (Máy pin - điện tử)")}
                        >
                          Quartz (Máy pin - điện tử)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Eco-Drive (Năng lượng ánh sáng)"
                          onClick={() => handleFilterChange("loai_may", "Eco-Drive (Năng lượng ánh sáng)")}
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
                            handleFilterChange("loai_may", "Quartz Chronograph (Máy pin bấm giờ thể thao)")
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
                            handleFilterChange("loai_may", "Automatic Chronometer (Máy cơ tự động chuẩn COSC)")
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
                          onClick={() => handleFilterChange("loai_may", "Quartz Chronometer (Máy pin chuẩn COSC)")}
                        >
                          Quartz Chronometer (Máy pin chuẩn COSC)
                        </Link>
                      </div>
                      <div
                        className={`${styles.cls} ${styles.item}`}
                        onClick={() =>
                          handleFilterChange("loai_may", "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)")
                        }
                      >
                        <Link rel="nofollow" href="#" title="Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)">
                          Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quartz Solar (Năng lượng ánh sáng)"
                          onClick={() => handleFilterChange("loai_may", "Quartz Solar (Năng lượng ánh sáng)")}
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
                            handleFilterChange("loai_may", "Đồng hồ cơ lên giây cót bằng tay ( Manual winding )")
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
              <div className={`${styles["field-area"]} ${styles["field-item"]}`}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Dưới 25mm"
                          onClick={() => handleFilterChange("duong_kinh", "Dưới 25mm")}
                        >
                          Dưới 25mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="25mm đến 30mm"
                          onClick={() => handleFilterChange("duong_kinh", "25mm đến 30mm")}
                        >
                          25mm đến 30mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="30mm đến 35mm"
                          onClick={() => handleFilterChange("duong_kinh", "30mm đến 35mm")}
                        >
                          30mm đến 35mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="35mm đến 38mm"
                          onClick={() => handleFilterChange("duong_kinh", "35mm đến 38mm")}
                        >
                          35mm đến 38mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="38mm đến 40mm"
                          onClick={() => handleFilterChange("duong_kinh", "38mm đến 40mm")}
                        >
                          38mm đến 40mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="40mm đến 42mm"
                          onClick={() => handleFilterChange("duong_kinh", "40mm đến 42mm")}
                        >
                          40mm đến 42mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="42mm đến 45mm"
                          onClick={() => handleFilterChange("duong_kinh", "42mm đến 45mm")}
                        >
                          42mm đến 45mm
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Từ 45mm trở lên"
                          onClick={() => handleFilterChange("duong_kinh", "Từ 45mm trở lên")}
                        >
                          Từ 45mm trở lên
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*Chất liệu dây  */}
              <div className={`${styles["field-area"]} ${styles["field-item"]}  `}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Dây da"
                          onClick={() => handleFilterChange("chat_lieu_day", "Dây da")}
                        >
                          Dây da
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L"
                          onClick={() => handleFilterChange("chat_lieu_day", "Thép không gỉ 316L")}
                        >
                          Thép không gỉ 316L
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L mạ vàng công nghệ PVD"
                          onClick={() =>
                            handleFilterChange("chat_lieu_day", "Thép không gỉ 316L mạ vàng công nghệ PVD")
                          }
                        >
                          Thép không gỉ 316L mạ vàng công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L dạng lưới"
                          onClick={() => handleFilterChange("chat_lieu_day", "Thép không gỉ 316L dạng lưới")}
                        >
                          Thép không gỉ 316L dạng lưới
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L dạng lắc"
                          onClick={() => handleFilterChange("chat_lieu_day", " Thép không gỉ 316L dạng lắc")}
                        >
                          Thép không gỉ 316L dạng lắc
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Dây vải"
                          onClick={() => handleFilterChange("chat_lieu_day", " Dây vải")}
                        >
                          Dây vải
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L/ Vàng 18K"
                          onClick={() => handleFilterChange("chat_lieu_day", " Thép không gỉ 316L/ Vàng 18K")}
                        >
                          Thép không gỉ 316L/ Vàng 18K
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L/ Ceramic"
                          onClick={() => handleFilterChange("chat_lieu_day", " Thép không gỉ 316L/ Ceramic")}
                        >
                          Thép không gỉ 316L/ Ceramic
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ mạ công nghệ PVD"
                          onClick={() => handleFilterChange("chat_lieu_day", "Thép không gỉ mạ công nghệ PVD")}
                        >
                          Thép không gỉ mạ công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Dây cao su"
                          onClick={() => handleFilterChange("chat_lieu_day", " Dây cao su")}
                        >
                          Dây cao su
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Dây dù"
                          onClick={() => handleFilterChange("chat_lieu_day", "  Dây dù")}
                        >
                          Dây dù
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Titanium"
                          onClick={() => handleFilterChange("chat_lieu_day", " Titanium")}
                        >
                          Titanium
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Titanium mạ vàng công nghệ PVD"
                          onClick={() => handleFilterChange("chat_lieu_day", "itanium mạ vàng công nghệ PVD")}
                        >
                          Titanium mạ vàng công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Nhựa"
                          onClick={() => handleFilterChange("chat_lieu_day", "  Nhựa")}
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Thép không gỉ 316L"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Thép không gỉ 316L")}
                        >
                          Thép không gỉ 316L
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ mạ vàng công nghệ PVD"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Thép không gỉ mạ vàng công nghệ PVD")}
                        >
                          Thép không gỉ mạ vàng công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Vàng 18K"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Vàng 18K")}
                        >
                          Vàng 18K
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L/ Vàng 18K"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Thép không gỉ 316L/ Vàng 18K")}
                        >
                          Thép không gỉ 316L/ Vàng 18K
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Titanium"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Titanium")}
                        >
                          Titanium
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Titanium mạ công nghệ PVD"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Titanium mạ công nghệ PVD")}
                        >
                          Titanium mạ công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Ceramic"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Ceramic")}
                        >
                          Ceramic
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ 316L/ Ceramic"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Thép không gỉ 316L/ Ceramic")}
                        >
                          Thép không gỉ 316L/ Ceramic
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thép không gỉ mạ công nghệ PVD"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Thép không gỉ mạ công nghệ PVD")}
                        >
                          Thép không gỉ mạ công nghệ PVD
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Nhựa"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Nhựa")}
                        >
                          Nhựa
                        </Link>
                      </div>

                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Titanium/ Vàng 18K"
                          onClick={() => handleFilterChange("chat_lieu_vo", "Titanium/ Vàng 18K")}
                        >
                          Titanium/ Vàng 18K
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mặt kính */}
              <div className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"}${" "} `}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Sapphire"
                          onClick={() => handleFilterChange("mat_kinh", "Sapphire")}
                        >
                          Sapphire
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt kính cứng"
                          onClick={() => handleFilterChange("mat_kinh", "Mặt kính cứng")}
                        >
                          Mặt kính cứng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Hardlex Crystal"
                          onClick={() => handleFilterChange("mat_kinh", "Hardlex Crystal")}
                        >
                          Hardlex Crystal
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mica"
                          onClick={() => handleFilterChange("mat_kinh", "Mica")}
                        >
                          Mica
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Kinh Nhựa"
                          onClick={() => handleFilterChange("mat_kinh", "Kinh Nhựa")}
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px] border-t-0 border-r border-b border-l"}${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Trắng"
                          onClick={() => handleFilterChange("mau_mat", "Trắng")}
                        >
                          Trắng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Hồng"
                          onClick={() => handleFilterChange("mau_mat", "Hồng")}
                        >
                          Hồng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link rel="nofollow" href="#" title="Xám" onClick={() => handleFilterChange("mau_mat", "Xám")}>
                          Xám
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link rel="nofollow" href="#" title="Đen" onClick={() => handleFilterChange("mau_mat", "Đen")}>
                          Đen
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xanh lam"
                          onClick={() => handleFilterChange("mau_mat", "Xanh lam")}
                        >
                          Xanh lam
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Vàng"
                          onClick={() => handleFilterChange("mau_mat", "Vàng")}
                        >
                          Vàng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Khảm trai"
                          onClick={() => handleFilterChange("mau_mat", "Khảm trai")}
                        >
                          Khảm trai
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link rel="nofollow" href="#" title="Đỏ" onClick={() => handleFilterChange("mau_mat", "Đỏ")}>
                          Đỏ
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Da Cam"
                          onClick={() => handleFilterChange("mau_mat", "Da Cam")}
                        >
                          Da Cam
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Xanh Lá"
                          onClick={() => handleFilterChange("mau_mat", "Xanh Lá")}
                        >
                          Xanh Lá
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link rel="nofollow" href="#" title="Nâu" onClick={() => handleFilterChange("mau_mat", "Nâu")}>
                          Nâu
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*Phong cách */}
              <div className={`${styles["field-item"]} ${"phone-sm:ml-[5px]"}${" "} `}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          title="Sang trọng"
                          onClick={() => handleFilterChange("phong_cach", "Sang trọng")}
                        >
                          Sang trọng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thể thao"
                          onClick={() => handleFilterChange("phong_cach", "Thể thao")}
                        >
                          Thể thao
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thể thao sang trọng"
                          onClick={() => handleFilterChange("phong_cach", "Thể thao sang trọng")}
                        >
                          Thể thao sang trọng
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Quân đội"
                          onClick={() => handleFilterChange("phong_cach", "Quân đội")}
                        >
                          Quân đội
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thời trang"
                          onClick={() => handleFilterChange("phong_cach", "Thời trang")}
                        >
                          Thời trang
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Hiện đại"
                          onClick={() => handleFilterChange("phong_cach", "Hiện đại")}
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
                      x
                    </span>

                    <div
                      className={`${"relative bg-white border-1 border-[#e7e7e7] p-[10px]  w-40 border-t-0 border-r border-b border-l"} ${
                        styles.descript
                      } ${styles.cls}`}
                    >
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt vuông"
                          onClick={() => handleFilterChange("kieu_dang", "Mặt vuông")}
                        >
                          Mặt vuông
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt tròn"
                          onClick={() => handleFilterChange("kieu_dang", "Mặt tròn")}
                        >
                          Mặt tròn
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt chữ nhật"
                          onClick={() => handleFilterChange("kieu_dang", "Mặt chữ nhật")}
                        >
                          Mặt chữ nhật
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Mặt Oval"
                          onClick={() => handleFilterChange("kieu_dang", "Mặt Oval")}
                        >
                          Mặt Oval
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Khác"
                          onClick={() => handleFilterChange("kieu_dang", "Khác")}
                        >
                          Khác
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*Xuất xứ thương hiệu */}
              <div className={`${styles["field-area"]} ${styles["field-item"]} ${" "}`}>
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
                    <span className={`${styles["close"]} lg:hidden sm:block phone-sm:block`} onClick={toggleDropdown}>
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
                          onClick={() => handleFilterChange("xuat_xu", "Nhật Bản")}
                        >
                          Nhật Bản
                        </Link>
                      </div>
                      <div className={`${styles.cls} ${styles.item}`}>
                        <Link
                          rel="nofollow"
                          href="#"
                          title="Thụy Sỹ"
                          onClick={() => handleFilterChange("xuat_xu", "Thụy Sỹ")}
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
          {/*Menu-Đồng hồ nam */}
          <div className="relative text-center bg-[#f3f3f3] text-[11px] uppercase pt-[14px] px-[0px] pb-[12px] mb-[33px] ">
            {/*field-title*/}
            <div className={styles["title-name"]}>
              {/*title-name*/}
              <h1 className=" text-[20px]">
                {categoryName === "Đồng hồ nam" ? categoryName : ` Đồng hồ ${categoryName}`}
              </h1>
              <div className={styles.clear}></div>
            </div>

            <select
              className="absolute lg:top-2 lg:right-3 top-[100%] right-[0px] sm:border sm:border-[#e6e6e6] lg:border-none  sm:bg-[#f3f3f3] py-[8px] text-[#5d5d5d] cursor-pointer"
              name="order-select"
              onChange={handleSortChange}
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

          <div
            className={`${styles["product-grid"]} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:mt-3  `}
          >
            {displayedProducts.map((product) => {
              const { _id, ten, ten_san_pham, ma_san_pham, gia_san_pham, gia_giam, hinh_anh, loai, duong_kinh } =
                product;
              const roundDiscount = (discountPercentage) => {
                const discountLevels = [10, 15, 20, 25, 30, 40, 50];
                return discountLevels.reduce((prev, curr) =>
                  Math.abs(curr - discountPercentage) < Math.abs(prev - discountPercentage) ? curr : prev
                );
              };
              return (
                <div key={_id} className="border-box relative overflow-hidden text-center mb-10">
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
                      <Link className="text-[17px] font-semibold mb-2" href="#" title={ten}>
                        <span className="text-gray-500 block text-[14px] mt-1.5 mb-2 font-normal leading-relaxed">
                          {ten_san_pham}
                        </span>
                        {ma_san_pham}
                      </Link>
                    </h3>
                    <span className="inline-block text-[12px] uppercase text-gray-500 mb-1.5">{loai}</span>
                    <span className="px-1.5 text-gray-500 text-[13px]">|</span>
                    <span className="inline-block text-[12px] uppercase text-gray-500 mb-1.5">{duong_kinh}</span>

                    <div className={styles["price-area"]}>
                      {gia_giam > 0 ? (
                        <>
                          <div className="text-[15px] text-gray-400 mb-2 line-through">
                            Giá: <span>{gia_san_pham.toLocaleString("vi-VN")}₫</span>
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
                        <span>-{roundDiscount(Math.round(((gia_san_pham - gia_giam) / gia_san_pham) * 100))}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* phân trang*/}
          <div className={styles.pagination}>
            {/* Prev trang đâù */}
            <span
              title="First page"
              className={currentPage === 1 ? styles.disabled : styles["other-page"]}
              onClick={() => currentPage > 1 && handlePageChange(1)}
            >
              ‹‹
            </span>
            {/* Prev 1 trang */}
            <span
              className={currentPage === 1 ? styles.disabled : styles["other-page"]}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
              ‹
            </span>
            {/* Trang hiện tại */}
            <span className={styles.currentPage}>{`Trang ${currentPage} / ${totalPages || 1}`}</span>
            {/* Next 1 trang*/}
            <span
              className={currentPage === totalPages ? styles.disabled : styles["other-page"]}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            >
              ›
            </span>
            {/* Next tới trang cuối */}
            <span
              className={currentPage === totalPages ? styles.disabled : styles["other-page"]}
              onClick={() => currentPage < totalPages && handlePageChange(totalPages)}
            >
              ››
            </span>
          </div>
        </div>
        <div className={styles.clear}></div>

        {/* mô tả*/}
        <div
          className={`${styles.summaryContentCat} ${styles.description} `}
          style={{ height: isExpanded ? "auto" : "360px", overflow: isExpanded ? "visible" : "hidden" }}
        >
          <h2 dir="ltr" style={{ textAlign: "justify" }}>
            <strong>TẤT CẢ NHỮNG ĐIỀU BẠN CẦN BIẾT VỀ CÁCH CHỌN ĐỒNG HỒ NAM</strong>
          </h2>

          <p dir="ltr" style={{ textAlign: "justify" }}>
            Những chiếc
            <em>
              <strong>
                <Link href="#">
                  <span className={styles.highlightText}>&nbsp;đồng hồ đeo tay</span>
                </Link>
              </strong>
            </em>
            &nbsp;không chỉ để xem thời gian mà còn khẳng định phong cách và đẳng cấp của phái mạnh.
            <strong>&nbsp;Đồng hồ nam</strong> mang lại sự khác biệt nhất là khi đặt vào tổng thể trang phục, nhưng
            không phải ai cũng chọn được một chiếc đồng hồ phù hợp ở lần đầu tiên.
            <strong>&nbsp;Wristly</strong> sẽ giúp bạn lựa chọn
            <Link href="#">
              <em>
                <strong>&nbsp;đồng hồ nam đẹp&nbsp;</strong>
              </em>
            </Link>
            và phù hợp với sở thích của từng người!
          </p>
          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh1.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h2 dir="ltr" className={styles.justifyText}>
            <strong>1. CÁC THƯƠNG HIỆU ĐỒNG HỒ NAM NỔI TIẾNG TẠI VIỆT NAM</strong>
          </h2>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.1&nbsp;Longines</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Không nhiều người biết rằng
            <em>
              <strong>
                &nbsp;<Link href="#">Longines</Link>&nbsp;
              </strong>
            </em>
            là một trong những thương hiệu đồng hồ lâu đời nhất thế giới. Với gần hai thế kỷ ra đời và phát triển, cái
            tên Longines có thể được xem như “lão làng” trong giới chơi đồng hồ. Quy tụ tinh hoa hàng trăm năm chế tác
            cùng tinh thần thanh lịch bất biến với thời gian, những chiếc đồng hồ Longines chính là vật sở hữu đáng giá
            nhờ độ tin cậy cao, đa dạng về kiểu dáng và mẫu mã với thiết kế cổ điển, nhiều phiên bản dress watch lý
            tưởng. Các mẫu
            <strong>
              <em>
                &nbsp;<Link href="#">đồng hồ nam Longines</Link>&nbsp;
              </em>
            </strong>
            đã làm mê hoặc&nbsp;rất nhiều&nbsp;tín đồ yêu đồng hồ&nbsp;trên khắp thế giới hàng trăm&nbsp;năm nay.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam longines"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh2.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            Dù là
            <em>
              <strong>
                <Link href="#">
                  &nbsp;<span className={styles.highlightText}>đồng hồ unisex</span>
                </Link>
              </strong>
            </em>
            , đồng hồ nam hay nữ, Longines vẫn mang đến hàng loạt phiên bản nổi tiếng đáp ứng nhiều thị hiếu khác nhau.
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.2 Rolex</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Dù là người đam mê đồng hồ hay không, bạn sẽ khó có thể tìm thấy một người nào chưa từng nghe qua cái tên
            Rolex trong đời. Vương miện <strong>Rolex </strong>là một trong những biểu tượng dễ nhận diện nhất trên thế
            giới. Đeo đồng hồ Rolex không chỉ thể hiện địa vị mà còn cho phép bạn bước vào thế giới của những khả năng
            không giới hạn. Đó là lý do tại sao Rolex sản xuất và bán khoảng một triệu chiếc
            <Link href="#">
              <em>
                &nbsp;<strong>đồng hồ nam cao cấp</strong>&nbsp;
              </em>
            </Link>
            mỗi năm.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam rolex"
              height="375"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh3.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.3 Tissot</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Được tạo ra vào năm 1853 tại Jura Thụy Sĩ,
            <em>
              <strong>
                <Link href="#">
                  &nbsp;<span className={styles.highlightText}>Tissot</span>&nbsp;
                </Link>
              </strong>
            </em>
            tự hào có truyền thống chế tác đồng hồ rất lâu đời. Ngày nay thuộc sở hữu của Tập đoàn Swatch của Thụy Sỹ,
            đồng hồ Tissot liên tục đưa ra những mẫu đồng hồ chất lượng cao với mức giá tương đối phải chăng. Họ cũng là
            một trong những thương hiệu thành công nhất của Thụy Sĩ cung cấp những chiếc
            <Link href="#">
              <em>
                <strong>đồng hồ nam thời trang</strong>
              </em>
            </Link>
            , đa dạng&nbsp;phong cách và phù hợp với số đông người tiêu dùng từ giá thành đến kiểu dáng.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam tissot"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh4.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.4 Omega</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Là người khổng lồ khác trong toàn ngành công nghiệp đồng hồ, <strong>Omega</strong> chính là thương hiệu
            hùng mạnh nhất thuộc tập đoàn Swatch. Nguồn gốc của thương hiệu bắt đầu từ năm 1848. Omega được biết đến với
            nhiều thành tựu nổi bật và đã tham gia vào các sự kiện đáng chú ý, như là cỗ máy đo thời gian chính thức của
            Thế vận hội Olympic kể từ năm 1932 và là chiếc đồng hồ đầu tiên được đeo trên mặt trăng. Với chứng nhận
            Master Chronometer, <strong>Omega</strong> đã thiết lập một chuẩn mực công nghiệp mới về độ chính xác, hiệu
            suất và khả năng chống từ.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam omega"
              height="675"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh5.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.5 Hamilton</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Thương hiệu thuộc về tập đoàn Swatch Thụy Sĩ và do đó được hưởng lợi từ tất cả sự hợp lực của một tập đoàn
            công nghiệp như vậy. Những năm gần đây
            <em>
              <strong>
                <Link href="#">
                  &nbsp;<span className={styles.highlightText}>Hamilton</span>&nbsp;
                </Link>
              </strong>
            </em>
            đã tung ra một số chiếc
            <Link href="">
              <em>
                &nbsp;<strong>đồng hồ đeo tay nam</strong>&nbsp;
              </em>
            </Link>
            đáng ngưỡng mộ, kết hợp giữa thể thao và thanh lịch được thực hiện một cách hoàn hảo, một số trong số chúng
            có công nghệ tuyệt vời mà hầu như không quá đắt đỏ. So sánh trong phân khúc tầm trung thì những gì Hamilton
            cung cấp là điều mà một người yêu đồng hồ Thụy Sĩ nên quan tâm. Ngoài ra hãng còn kết hợp với các nhà làm
            phim Hollywood để cho ra các siêu phẩm phim hành động, phim khoa học viễn tưởng ăn khách trên toàn thế giới,
            gần đây nhất là bộ&nbsp;phim Hành tinh cát (Dune II) sản xuất năm 2024, với chiếc&nbsp;
            <strong>
              <em>Hamilton Ventura Edge Dune Limited Edition H24624330</em>&nbsp;
            </strong>
            được xuất hiện trên tay nhân vật chính trong phim.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam Hamilton Ventura Edge Dune Limited Edition H24624330"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh6.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.6 Mido</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            <strong>
              <em>
                <Link href="#">Mido</Link>&nbsp;
              </em>
            </strong>
            là một nhà sản xuất đồng hồ Thụy Sĩ đã tạo dựng được danh tiếng khi kết hợp công nghệ tiên tiến với thiết kế
            thời trang, lấy cảm hứng từ kiến ​​trúc. Đồng hồ của hãng tự hào với độ chính xác và chất lượng cao nhờ kỹ
            thuật và vật liệu cao cấp, đủ khả năng đứng vững trước thử thách của thời gian.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam mido"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh7.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.7 Seiko</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Khi tạo ra chiếc &nbsp;
            <strong>
              <Link href="#">đồng hồ thạch anh</Link>&nbsp;
            </strong>
            đầu tiên vào năm 1969,
            <strong>
              &nbsp;<Link href="#">Seiko</Link>&nbsp;
            </strong>
            đã khởi động cuộc cách mạng lớn nhất của kỷ nguyên đồng hồ hiện đại. Cho đến ngày nay, thương hiệu này vẫn
            tiếp tục cung cấp những chiếc đồng hồ tuyệt vời từ cơ khí, tự động và chạy bằng pin. Ngày nay, Seiko không
            chỉ là một nhà tiên phong về đồng hồ khi những chiếc đồng hồ hàng đầu của thương hiệu này tiếp tục sánh
            ngang với
            <em>
              <strong>
                &nbsp;<Link href="#">đồng hồ Thụy Sỹ</Link>&nbsp;
              </strong>
            </em>
            . Các quy trình sản xuất đồng hồ nội bộ của hãng, bao gồm cả kỹ thuật đánh bóng truyền thống, zaratsu, vẫn
            là một trong những quy trình tốt nhất thế giới, giúp cho những chiếc đồng hồ của hãng trở nên chính xác và
            thẩm mỹ nhất trên thế giới.
          </p>

          <p className={styles.imageContainer}>
            <img
              alt="đồng hồ nam seiko 5 sport"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh8.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.8 Casio</strong>
          </h3>

          <p dir="ltr" className={styles.justifyText}>
            Nếu muốn sở hữu một chiếc
            <em>
              &nbsp;<strong>đồng hồ nam</strong>&nbsp;
            </em>
            đáng tin cậy và chắc chắn sẽ tồn tại suốt đời, đó là
            <em>
              <strong>
                &nbsp;<Link href="#">đồng hồ Casio</Link>
              </strong>
            </em>
            .&nbsp;Thương hiệu
            <em>
              <strong>
                &nbsp;<Link href="#">đồng hồ Nhật Bản</Link>&nbsp;
              </strong>
            </em>
            này nên là chiếc đồng hồ đầu tiên trong danh sách của bạn, đặc biệt là vì nhiều bộ sưu tập của chúng có
            phong cách hoàn hảo và hiệu suất phi thường.
          </p>

          <p className={styles.imageCenter}>
            <img
              alt="dong-ho-casio"
              height="510"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh9.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.9 Citizen</strong>
          </h3>

          <p className={styles.imageCenter}>
            <img
              alt="đồng hồ nam citizen"
              height="800"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh10.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h3 dir="ltr" className={styles.justifyText}>
            <strong>1.10 Orient</strong>
          </h3>
          <p dir="ltr" className={styles.justifyText}>
            <em>
              <strong>
                <Link href="#">Orient</Link>&nbsp;
              </strong>
            </em>
            là một trong những nhà sản xuất đồng hồ tốt nhất và được công nhận rộng rãi nhất tại Nhật Bản. Giờ đây,
            thương hiệu này là một công ty con của Seiko, nhưng họ vẫn tiếp tục xây dựng các bộ máy của riêng mình, đó
            là lý do tại sao những chiếc&nbsp;
            <Link href="#">
              <strong>
                <em>đồng hồ cơ Orient</em>
              </strong>
            </Link>
            &nbsp; có chất lượng tuyệt vời và là một thương hiệu đáng tin cậy.
          </p>

          <p className={styles.imageCenter}>
            <img
              alt="đồng hồ nam orient"
              height="675"
              className={styles.lazy}
              width="1200"
              src="/image/item/donghonam/donghonam-hinh11.jpg"
            />
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <h2 dir="ltr" className={styles.justifyText}>
            <strong>2. TƯ VẤN LỰA CHỌN ĐỒNG HỒ NAM PHÙ HỢP</strong>
          </h2>

          <p dir="ltr" className={styles.justifyText}>
            Nếu bạn đang muốn mua một chiếc đồng hồ để đeo nhưng chưa biết nên lựa chọn như thế nào, từ việc cân nhắc
            những ưu và nhược điểm của các loại đồng hồ khác nhau, đến các kiểu&nbsp;
            <strong>đồng hồ nam</strong> &nbsp; khác nhau… thì bài viết này là dành cho bạn!
          </p>

          <p dir="ltr" className={styles.justifyText}>
            Hơn thế nữa việc trang bị cho mình những thông tin liên quan có thể đơn giản hóa quá trình mua hàng và không
            bị lạc giữa hàng trăm loại đồng hồ khác nhau và để chắc chắn rằng bạn không mua một chiếc đồng hồ yêu thích
            hôm nay để rồi chán nó vào ngày mai!
          </p>

          <p className={styles.justifyText}>
            Bạn sẽ tìm thấy hướng dẫn cơ bản về&nbsp;
            <em>
              <strong>đồng hồ đeo tay nam</strong>&nbsp;
            </em>
            - tất cả thông tin cần thiết để lựa chọn được những mẫu&nbsp;
            <em>
              <strong>đồng hồ nam đẹp</strong>&nbsp;
            </em>
            và phù hợp với từng người.
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.1 Chọn đồng hồ theo nhu cầu sử dụng</strong>
          </h3>

          <p className={styles.justifyText}>
            Bạn sử dụng &nbsp;
            <Link href="#">
              <strong>
                <em>đồng hồ</em>&nbsp;
              </strong>
            </Link>
            của mình chủ yếu vào khi nào? Ở đâu? Hãy đặt ra câu hỏi và trả lời chúng. Chiếc đồng hồ được chọn cũng cần
            phải phù hợp với công việc, hoàn cảnh sử dụng.
          </p>

          <ul>
            <li>
              <p className={styles.justifyText}>
                Nếu bạn là người kinh doanh, hay gặp gỡ mọi người và mặc những bộ trang phục lịch sự thì bạn có thể lựa
                chọn những mẫu
                <em>
                  &nbsp;<strong>đồng hồ nam cổ điển</strong>&nbsp;
                </em>
                dành cho doanh nhân.
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                Nếu bạn yêu thích phong cách thể thao, mạnh mẽ thì những chiếc
                <em>
                  <strong>đồng hồ nam thể thao</strong>
                </em>
                có kích thước lớn sẽ là lựa chọn giúp bạn trở nên năng động hơn. Những chiếc đồng hồ này không chỉ có
                khả năng chịu va đập và chống nước tốt mà nó còn hữu dụng với nhiều tính năng hỗ trợ khác.
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                Nếu bạn là mẫu người chỉ muốn lựa chọn những chiếc <strong>đồng hồ nam đơn giản</strong> là để xem giờ,
                hỗ trợ cho cuộc sống hàng ngày thì các mẫu
                <em>
                  &nbsp;<strong>đồng hồ nam dây da</strong>&nbsp;
                </em>
                hoặc&nbsp;
                <em>
                  <strong>đồng hồ nam dây kim loại</strong>&nbsp;
                </em>
                đơn giản của Tissot hoặc Longines với mức giá cũng khá hợp lý.
              </p>
            </li>
          </ul>

          <p className={styles.justifyText}>&nbsp;</p>

          <p className={styles.justifyText}>
            <strong>Tham khảo</strong>
          </p>

          <ul>
            <li className={styles.justifyText}>
              <Link href="#">Shop đồng hồ nam chính hãng uy tín tại HCM</Link>
            </li>
            <li className={styles.justifyText}>
              <Link href="">Top 20 mẫu đồng hồ nam bán chạy nhất tháng 4 2023</Link>
            </li>
          </ul>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.2 Chọn đồng hồ nam theo thương hiệu</strong>
          </h3>

          <p className={styles.justifyText}>
            <Link href="#">
              <em>
                <strong>Thế giới đồng hồ nam</strong>&nbsp;
              </em>
            </Link>
            rất đa dạng và phong phú với sự góp mặt của các thương hiệu đồng hồ Thụy Sĩ và Nhật Bản – 2 cường quốc về
            sản xuất đồng hồ hàng đầu thế giới. Ở các
            <Link href="#">
              <em>
                <strong>shop đồng hồ nam</strong>
              </em>
            </Link>
            , họ thường chia các mẫu đồng hồ theo thương hiệu. Thông thường những thương hiệu phân khúc cao cấp nhất như
            Rolex, Omega, Patek Philippe, Grand Seiko… sẽ có giá đến hàng trăm triệu. Các mẫu đồng hồ thuộc thương hiệu
            Longines – thương hiệu cao cấp của tập đoàn đồng hồ lớn nhất Thụy Sĩ Swatch có giá từ vài chục đến vài trăm
            triệu tùy theo mẫu đồng hồ bạn chọn. Trong khi đó các thương hiệu tầm trung như Tissot, Mido, Certina,
            Hamilton, Seiko… có mức giá từ vài triệu đến vài chục triệu. Ngoài ra nếu bạn muốn một chiếc &nbsp;
            <Link href="#">
              <em>
                <strong>đồng hồ nam hàng hiệu</strong>&nbsp;
              </em>
            </Link>
            với mức giá mềm thì có thể kể đến thương hiệu Seiko, Citizen, Orient, Casio, Daniel Wellington… chỉ từ 3
            triệu trở lên.
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.3 Chọn đồng hồ nam theo mức giá</strong>
          </h3>

          <p className={styles.justifyText}>
            Phạm vi giá cũng là một yếu tố quan trọng để bạn quyết định mua đồng hồ. Ngân sách sẽ quyết định bạn có thể
            mua được đồng hồ nam ở mức giá nào! Ngoại trừ những chiếc đồng hồ có giá cao thuộc phân khúc cao cấp thì bạn
            có thể ước lượng số tiền mình có thể mua theo các mức giá sau:
          </p>

          <ul>
            <li>
              <p className={styles.justifyText}>
                <em>
                  <strong>Đồng hồ nam dưới 3 triệu</strong>
                </em>
                : với mức giá này thì điều người mua quan tâm là đồng hồ nam giá rẻ nhưng phải có chất lượng tốt và chỉ
                đơn giản là để xem giờ như một món phụ kiện trên cổ tay. Bạn có thể tìm đến đồng hồ pin thạch anh thuộc
                các thương hiệu như Casio, Orient, Citizen, Olym Pianus.
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                <strong>
                  <em>Đồng hồ nam từ 3 – 6 triệu</em>
                </strong>
                : Với số tiền này bạn có thể lựa chọn nhiều mẫu đồng hồ nam đẹp hơn, có thể kể đến Seiko, Orient,
                Citizen, Casio Edifice, Casio G-Shock, Cadino, Olym Pianus…
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                <strong>
                  <em>Từ 6 đến 10 triệu</em>
                </strong>
                : Đây là phân khúc mà người dùng bắt đầu có sự hứng thú với đồng hồ, bạn sẽ có vô vàn sự lựa chọn khác
                nhau từ đồng hồ Nhật Bản cho đến đồng hồ Thụy Sỹ. Với đồng hồ Nhật thì phân khúc này bạn có thể tìm kiếm
                một số mẫu đồng hồ cơ của các thương hiệu như Citizen, Orient.
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                <strong>
                  <em>Từ 10 – 40 triệu trở lên</em>
                </strong>
                : Bạn có thể mua được đồng hồ cơ Thụy Sỹ với nhiều lựa chọn phong phú từ Seiko, Orient Star, Tissot,
                Mido, Hamilton, Certina…
              </p>
            </li>
            <li>
              <p className={styles.justifyText}>
                <strong>
                  <em>Từ 40 triệu trở lên</em>
                </strong>
                : đây là mức giá để có thể sở hữu những chiếc đồng hồ cơ Thụy Sỹ cao cấp, có thể kể đến thương hiệu
                Longines với nhiều BST của họ có mức giá từ 40 triệu trở lên.
              </p>
            </li>
          </ul>

          <p className={styles.centerText}>
            <img
              alt="đồng hồ nam đeo tay"
              height="800"
              width="1200"
              className={`${styles.imageStyle} lazy`}
              src="/image/item/donghonam/donghonam-hinh12.jpg"
            />
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <ul className={styles.justifyText}>
            <li>
              <Link href="#">Cách lựa chọn đồng hồ phù hợp với kích thước cổ tay</Link>
            </li>
            <li>
              <Link href="">Toplist 15 mẫu đồng hồ nam theo hot trend và đẹp nhất năm 2023</Link>
            </li>
          </ul>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.6 Chọn đồng hồ nam dây da hay dây kim loại</strong>
          </h3>

          <p className={styles.justifyText}>
            <em>
              -
              <strong>
                &nbsp;<Link href="#">Đồng hồ nam dây da</Link>&nbsp;
              </strong>
            </em>
            là món đồ cổ điển quen thuộc được nhiều người yêu thích. Vì cảm giác mềm mại, nhẹ nhàng tự nhiên, nó là một
            chất liệu thoải mái vừa linh hoạt vừa bền lâu. Có nhiều màu sắc và kiểu dáng, loại dây đồng hồ này có khả
            năng điều chỉnh & giãn rộng theo thời gian. Dây da có thể phù hợp một cách gọn gàng trên cổ tay của bạn.
          </p>

          <p className={styles.justifyText}>
            Dây da là một lựa chọn tuyệt vời cho các sự kiện trang trọng, dây da rất tinh xảo và thanh lịch. Điểm cộng
            của nó là bạn có thể thử đi giày hoặc thắt lưng cùng màu sao cho hợp thời trang. Dây da đồng hồ nói chung
            được làm với hệ thống khóa chắc chắn, điều này ngăn không cho chốt đồng hồ bị bung ra bất ngờ.
          </p>

          <p className={styles.justifyText}>
            - Đồng hồ đeo tay bằng thép không gỉ cao cấp 316L&nbsp;(
            <Link href="#">
              <strong>
                <em>đồng hồ nam dây kim loại)</em>
              </strong>
            </Link>
            &nbsp;là một lựa chọn phổ biến cho đồng hồ thể thao, phù hợp cho nhiều hoạt động thể thao. Đồng hồ dây kim
            loại như đồng hồ nam chính hãng
            <strong>
              &nbsp;
              <em>
                <Link href="#">Longines</Link>&nbsp;
              </em>
            </strong>
            thường đắt hơn dây da và cũng có thể sử dụng như một chiếc đồng hồ đeo tay cho những dịp sang trọng.
          </p>

          <p className={styles.justifyText}>
            Mạnh mẽ và không dễ bị đứt, dây đồng hồ kim loại có thể bị ướt, chúng không dễ bị hỏng như da khi tiếp xúc
            với mồ hôi và nước. Vật liệu kim loại cũng không bị đàn hồi hay giãn như dây da. Sở hữu độ bền cao và dây
            kim loại sẽ gắn bó với đồng hồ đến hết vòng đời nên không tốn thêm chi phí!
          </p>

          <p className={styles.justifyText}>
            - Ngoài dây da và dây kim loại, đồng hồ nam còn có các phiên bản dây cao su, dây vải dù dành cho các tín đồ
            có&nbsp;phong cách, có&nbsp;cá tính ưa chuộng những hoạt động bên ngoài&nbsp;
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <ul className={styles.justifyText}>
            <li>
              <Link href="#">Top 9 mẫu đồng hồ nam dây cao su nên mua trong năm 2024</Link>
            </li>
            <li>
              <Link href="#">DÂY ĐEO ĐỒNG HỒ: NÊN CHỌN DÂY DA HAY DÂY KIM LOẠI?</Link>
            </li>
          </ul>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.7 Chọn đồng hồ nam theo màu mặt</strong>
          </h3>

          <p className={styles.justifyText}>
            Mặt số của đồng hồ là mặt phía trên, chứa các dấu hiệu hiển thị thời gian như kim và cọc số, kèm theo một số
            biến thể khác nhau tùy vào loại đồng hồ.&nbsp;
          </p>

          <p className={styles.justifyText}>
            Không có quy định &nbsp;
            <em>
              <strong>đồng hồ nam đẹp nhất</strong>&nbsp;
            </em>
            phải có màu sắc, kiểu dáng nào! Mặt số có vô vàn hình dáng, màu sắc, chất liệu khác nhau. Mặt đồng hồ đen
            hoặc trắng là lựa chọn phổ biến nhất dành cho nam giới, trong khi các màu khác cũng được ưa chuộng không kém
            đó là xanh lục, nâu, vàng, xám… Trong khi đó, những mặt số có màu sắc đặc biệt, có vân họa tiết hoặc khảm xà
            cừ thường sẽ đắt tiền hơn. Các dấu chỉ giờ như con số, vạch chỉ giờ, bộ kim… thường có màu tương phản với
            mặt đồng hồ, một số chi tiết còn được tráng lớp dạ quang để có thể nhìn trong đêm.
          </p>

          <p className={styles.justifyText}>
            Hình dạng mặt đồng hồ và màu sắc mặt là sự lựa chọn liên quan đến tính thẩm mỹ. Vì thế bạn có thể lựa chọn
            tùy theo gu thẩm mỹ của bản thân.
          </p>

          <p className={styles.imageCenter}>
            <img
              alt=""
              height="69"
              className={`lazy ${styles.imageStyle} `}
              width="300"
              src="/image/item/xem them(1).gif"
            />
          </p>

          <p className={styles.imageCenter}>
            <Link href="#">NHỮNG PHIÊN BẢN ĐỒNG HỒ NAM DÂY DA MẶT XANH THỂ HIỆN NÉT CÁ TÍNH CỦA NAM GIỚI</Link>
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <h3 className={styles.justifyText}>
            <strong>2.8 Chọn đồng hồ nam theo loại kính</strong>
          </h3>

          <p className={styles.justifyText}>
            Khi nói về đồng hồ, bộ máy có lẽ là phần quan trọng nhất. Nhưng sau đó là gì? Vỏ và mặt kính đồng hồ cũng
            quan trọng không kém vì nó bảo vệ mặt số và bộ chuyển động đồng thời tăng thêm vẻ đẹp tinh tế cho thiết kế.
          </p>

          <p className={styles.justifyText}>
            Có 3 loại kính đồng hồ, đó là&nbsp;
            <em>
              <strong>kính</strong>&nbsp;
            </em>
            <strong>
              <em>Acrylic, kính khoáng và kính Sapphire</em>&nbsp;
            </strong>
            với những ưu nhược điểm riêng.
          </p>

          <p className={styles.justifyText}>
            - Trong tất cả các loại kính đồng hồ,<em>kính đồng hồ acrylic</em> là yếu nhất, điều này là do nó được làm
            từ nhựa không phải từ thủy tinh. Acrylic là một loại nhựa chuyên dụng có giá thành rẻ thường được tìm thấy
            trên các thương hiệu đồng hồ giá thấp.
          </p>

          <p className={styles.justifyText}>
            - Đây có lẽ là loại kính đồng hồ phổ biến nhất được sử dụng trên đồng hồ. Nếu bạn có một chiếc đồng hồ tầm
            giá trung bình thì nó thường có mặt <em>kính khoáng</em>. Nó được sản xuất bằng kính cường lực tiêu chuẩn
            làm từ silica. Kính khoáng có khả năng chống xước và sản xuất khá rẻ. Tuy nhiên, nó có thể bị xước khi va
            chạm với vật liệu cứng.
          </p>

          <p className={styles.justifyText}>
            - <em>Kính sapphire</em> có chất lượng hàng đầu thường có ở những mẫu đồng hồ nam hàng hiệu. Nếu một chiếc
            đồng hồ có kính sapphire crystal, thì nó là loại kính chất lượng cao nhất hiện có. Đúng như tên gọi, loại
            kính đồng hồ này được làm từ sapphire nhưng nó thường được làm từ sapphire tổng hợp, không phải sapphire tự
            nhiên.
          </p>

          <p className={styles.justifyText}>
            Nếu bạn mua&nbsp;
            <Link href="#">
              <em>
                <strong>đồng hồ nam chính hãng</strong>
              </em>
            </Link>
            &nbsp;từ những cửa hàng chính hãng và thương hiệu đáng tin cậy, bạn sẽ luôn được cung cấp thông tin rõ ràng
            về loại mặt kính của đồng hồ.
          </p>

          <p className={styles.justifyText}>&nbsp;</p>

          <ul className={styles.listStyle}>
            <li className={styles.justifyText}>
              <Link href="#">Top đồng hồ nam mặt chữ nhật có kiểu dáng đẹp nhất</Link>
            </li>
            <li className={styles.justifyText}>
              <Link href="#">CÓ BAO NHIÊU LOẠI MẶT KÍNH ĐỒNG HỒ, LOẠI MẶT KÍNH ĐỒNG HỒ NÀO TỐT NHẤT?&nbsp;</Link>
            </li>
          </ul>

          <p className={styles.justifyText}>&nbsp;</p>

          <h2 className={styles.heading}>
            <strong>3. ĐỊA CHỈ MUA ĐỒNG HỒ NAM CHÍNH HÃNG UY TÍN</strong>
          </h2>

          <p className={styles.justifyText}>
            Cuối cùng, lựa chọn một
            <strong>
              &nbsp;<em>cửa hàng đồng hồ nam uy tín</em>
            </strong>
            &nbsp;để mua chiếc đồng hồ ưng ý nhất cũng là vấn đề quan trọng.
          </p>

          <p dir="ltr" className={styles.justifyText}>
            <strong className={styles.strongText}>Wristly Watch</strong> là nhà phân phối được ủy quyền chính thức của
            các thương hiệu đồng hồ hàng đầu thế giới của Thụy Sĩ:
            <em>
              <strong>
                &nbsp;<Link href="#">Longines</Link>, <Link href="#">Tissot</Link>, <Link href="#">Mido</Link>,
                <Link href="#">Hamilton</Link>,<Link href="#">&nbsp;Certina</Link>,<Link href="#">Titoni</Link>,{" "}
                <Link href="#">Frederique Constant</Link>
              </strong>
            </em>
            … thương hiệu đồng hồ thời trang
            <em>
              <strong>
                <Link href="#">&nbsp;Daniel Wellington (DW)</Link>
              </strong>
            </em>
            &nbsp;của Thụy Điển do Filip Tysander thành lập năm 2011 nhưng đã có bước tăng trưởng thần kỳ vào năm 2015
            (với hơn 4700% doanh thu)&nbsp;và các thương hiệu đồng hồ Nhật Bản nổi tiếng về chất lượng và độ
            bền&nbsp;như
            <em>
              <strong>
                <Link href="#">Seiko</Link>, <Link href="#">Citizen</Link>, <Link href="#">Orient</Link>,
                <Link href="#">Casio</Link>
              </strong>
            </em>
            … Với hệ thống cửa hàng nằm ở những vị trí đắc địa, cơ sở vật chất đẳng cấp cho phép khách hàng đánh giá cao
            trải nghiệm mua sắm đồng hồ, đồng thời được hưởng lợi từ dịch vụ chuyên nghiệp và xuất sắc.
          </p>

          <p dir="ltr" className={styles.justifyText}>
            Tất cả các sản phẩm hiện có trong hệ thống cửa hàng của chúng tôi đều được bảo hành chính hãng từ 1 đến 3
            năm tùy theo mặt hàng và điều kiện riêng của thương hiệu. Bên cạnh đó bạn còn nhận được gói bảo hành 5 năm
            cùng nhiều quyền lợi hấp dẫn tại
            <Link href="#">
              <strong className={styles.strongText}> &nbsp;Đồng hồ Wristly</strong>
            </Link>
            .
          </p>

          <p dir="ltr" className={styles.justifyText}>
            &nbsp;
          </p>

          <hr />

          <p dir="ltr" className={styles.justifyText}>
            <strong className={styles.strongText}>Hệ thống&nbsp;mạng xã hội của Đồng hồ Wristly</strong>
          </p>

          <ul>
            <li>
              Facebook:&nbsp;
              <Link href="#" className={styles.socialLink}>
                https://www.facebook.com/profile.php?id=61566364566665
              </Link>
            </li>
          </ul>

          <hr />

          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
          <p className={styles.justifyText}>&nbsp;</p>
        </div>
        {/* Xem thêm   */}
        <div className={styles.summaryContent}>
          <span onClick={toggleDescription}>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
        </div>
        <div className={styles.clear}></div>
        <div className={`${styles.aq_relates} ${styles.content_li}`}></div>
      </div>

      {/* end đồng hồ nam   */}
      <div className={styles.clear}></div>
    </>
  );
}
