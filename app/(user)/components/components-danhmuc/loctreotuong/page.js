"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./donghotreotuong.module.css";
import Loading from "../../loading/page";
import { useSearchParams } from "next/navigation";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function DonghoNam() {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Đồng hồ treo tường");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown = () => {
      setIsDropdownVisible((prevState) => !prevState);
    };

 
  // Bộ lọc mặc định cho đồng hồ nam
  const [filter, setFilter] = useState({
    muc_gia: "",
    chat_lieu_vo: "",
    mau_mat: "",
    phong_cach: "",
    kieu_dang: "",
    thuong_hieu: "",
  });
  const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      const parsedFilters = Object.fromEntries(
        new URLSearchParams(query).entries()
      );
      
      
      setFilter((prevFilter) => ({
        ...prevFilter,
        ...parsedFilters,
      }));

      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/product/filterTreoTuong/5307799c-55ae-4bfd-83d4-3ed6e219ff5f?${query}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setProducts(data.products || []);
          setError(null);
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu:", error);
          setError("Lỗi khi tải dữ liệu");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filter, page: currentPage });
      const response = await fetch(
         `http://localhost:5000/product/filterTreoTuong/5307799c-55ae-4bfd-83d4-3ed6e219ff5f?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Lỗi không thể tải dữ liệu");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts();
  };

  const handleFilterChange = (filterType, value) => {
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
  };

  const handleClearFilters = () => {
    setSelectedFilter([]);
    setFilter({
      gioi_tinh: "",
    });
    setCurrentPage(1);

    fetchProducts();
  };

  const handleRemoveFilter = (filterToRemove) => {
    const newFilters = selectedFilter.filter(
      (filter) => filter !== filterToRemove
    );

    const [filterType] = filterToRemove.split("=");
    const updatedFilter = { ...filter, [filterType]: "" };

    if (filterType === "danh_muc") {
      setCategoryName("Đồng hồ nam");
    }
    setSelectedFilter(newFilters);
    setFilter(updatedFilter);
    fetchProducts();
  };

  const sortProducts = (products) => {
    if (sortOption === "asc") {
      return [...products].sort((a, b) => a.gia_san_pham - b.gia_san_pham);
    } else if (sortOption === "desc") {
      return [...products].sort((a, b) => b.gia_san_pham - a.gia_san_pham);
    }
    return products;
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
    const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  const displayedProducts = sortProducts(products); 
  return (
    <>
      <div className={cx("container-header")}>
        <div id="main-container" className={cx("mt20")}>
          <div className={cx("main-column")}>
            <div className={cx("center-1col")}>
              <div className={cx("clear")} />
              {/* container */}
              <div
                className={cx(
                  "lg:max-w-[1170px] max-w-[80%] mx-auto overflow-hidden"
                )}
              >
                <div className={cx("clear")} />
                <div className={cx("all-summary")}>
                  <div className={cx("summary-content-filter ","mt-7 ",`overflow-hidden lg:overflow-visible ${
                    isExpanded ? "h-auto" : "h-[75px]"
                  } lg:h-auto`)}>
                    <div
                      className={cx(
                        "flex",
                        "items-center uppercase md:text-[16px] text-[10px] mb-4"
                      )}
                    >
                      <span className={cx("")}>
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
                      <span
                        className={cx("separator", "mx-3", "text-stone-400")}
                      >
                        {" "}
                        &gt;{" "}
                      </span>

                      <span className={cx("", "text-red-500")}>
                        <Link
                          href="/components/components-danhmuc/donghotreotuong"
                          className={cx("link", "text-red-500")}
                        >
                          Đồng hồ treo tường
                        </Link>
                      </span>
                    </div>
                    <p>
                      <Link href="#">
                        <em>
                          <strong>Đồng hồ treo tường</strong>
                        </em>
                      </Link>
                      &nbsp;được coi là một món đồ nội thất trang trí&nbsp;tuyệt
                      vời, biến mỗi không gian sống trở nên ấm ấp, sinh động,
                      tươi vui hoặc theo bất kỳ phong cách nào mà bạn muốn. Dù
                      bạn có là người kỹ tính luôn yêu cầu mọi thứ phải cầu toàn
                      đi chăng nữa thì thế giới phong phú của
                      <em>
                        <strong>
                          <Link href="#">
                            {" "}
                            đồng hồ treo tường&nbsp;trang trí{" "}
                          </Link>
                          &nbsp;&nbsp;
                        </strong>
                      </em>
                      tại
                      <em>
                        <strong> Duy Anh Watch</strong>{" "}
                      </em>
                      &nbsp;với đầy đủ các thiết kế, kiểu dáng, kích thước, màu
                      sắc...đều sẽ khiến bạn hài lòng.
                    </p>
                  </div>
                  <div className={`${styles.viewMore} sm:block sm:h-auto lg:hidden `} onClick={toggleDescription}>
                    <span onClick={toggleDescription}>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
                  </div>
                </div>
                {selectedFilter.length > 0 && (
                  <div className={styles.choosedfilter}>
                    {selectedFilter.map((filter, index) => (
                      <Link
                        key={index}
                        rel="nofollow"
                        href="#"
                        onClick={() => handleRemoveFilter(filter)}
                      >
                        {filter.split("=")[1]}
                      </Link>
                    ))}
                    <Link
                      rel="nofollow"
                      className={styles.reset}
                      href="#"
                      onClick={handleClearFilters}
                    >
                      Xoá hết
                    </Link>
                  </div>
                )}
                <div className={cx("clear")} />
                <div className={cx("products-cat")}>
                  <div
                    className={cx(
                      "border-t border-[#e5e5e5] border-b mt-[15px] mb-[5px]"
                    )}
                  >
                    <div
                      className={cx(
                        "phone-sm:grid phone-sm:grid-cols-2 phone-sm:gap-x-4    sm:grid sm:grid-cols-2  lg:flex lg:space-x-4"
                      )}
                    >
                      <div
                        className={`${styles["field-item"]} phone-sm:ml-[5px]`}
                      >
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-loai"
                          onClick={toggleMenu}
                        >
                          Loại
                        </div>

                        {isOpen && (
                          <div
                            id="loai"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-0-column",
                              "filter-4-loai"
                            )}
                          >
                            <span className={cx("close")} onClick={toggleMenu}>
                              x
                            </span>
                            <div
                              className={cx("filters-in-field-inner", "cls")}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Quả Lắc"
                                  onClick={() =>
                                    handleFilterChange("phong_cach", "Quả Lắc")
                                  }
                                >
                                  Quả Lắc
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* item2 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-manufactory"
                          onClick={toggleMenu}
                        >
                          Thương hiệu
                        </div>
                        {isOpen && (
                          <div
                            id="manufactory"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-0-column",
                              "filter-4-manufactory"
                            )}
                          >
                            <span className={cx("close")}>x</span>
                            <div
                              className={cx("filters-in-field-inner", "cls")}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="SEIKO"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "SEIKO")
                                  }
                                >
                                  SEIKO
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="RHYTHM"
                                  onClick={() =>
                                    handleFilterChange("thuong_hieu", "RHYTHM")
                                  }
                                >
                                  RHYTHM
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* item3 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-price"
                          onClick={toggleMenu}
                        >
                          Mức giá
                        </div>
                        {isOpen && (
                          <div
                            id="price"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-0-column",
                              "filter-4-price"
                            )}
                          >
                            <span className={cx("close")}>x</span>
                            <div
                              className={cx(
                                "filters-in-field-inner",
                                "cls",
                                "lg:ml-0 md:ml-0 "
                              )}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Dưới 2 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Dưới 2 triệu"
                                    )
                                  }
                                >
                                  Dưới 2 triệu
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Từ 2 triệu đến 5 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Từ 2 triệu đến 5 triệu"
                                    )
                                  }
                                >
                                  Từ 2 triệu đến 5 triệu
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Trên 5 triệu"
                                  onClick={() =>
                                    handleFilterChange(
                                      "muc_gia",
                                      "Trên 5 triệu"
                                    )
                                  }
                                >
                                  Trên 5 triệu
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* item4 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-vo-may"
                          onClick={toggleMenu}
                        >
                          Vỏ máy
                        </div>
                        {isOpen && (
                          <div
                            id="vo-may"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-0-column",
                              "filter-4-vo-may"
                            )}
                          >
                            <span className={cx("close")}>x</span>
                            <div
                              className={cx(
                                "filters-in-field-inner",
                                "cls",
                                "lg:ml-0 md:ml-0 ml-[-100px]"
                              )}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Thủy Tinh"
                                  onClick={() =>
                                    handleFilterChange(
                                      "chat_lieu_vo",
                                      "Thủy Tinh"
                                    )
                                  }
                                >
                                  Thủy Tinh
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nhựa"
                                  onClick={() =>
                                    handleFilterChange("chat_lieu_vo", "Nhựa")
                                  }
                                >
                                  Nhựa
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Gỗ"
                                  onClick={() =>
                                    handleFilterChange("chat_lieu_vo", "Gỗ")
                                  }
                                >
                                  Gỗ
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* item5 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-kieu-dang"
                          onClick={toggleMenu}
                        >
                          Kiểu dáng
                        </div>
                        {isOpen && (
                          <div
                            id="kieu-dang"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-0-column",
                              "filter-4-kieu-dang"
                            )}
                          >
                            <span className={cx("close")}>x</span>
                            <div
                              className={cx(
                                "filters-in-field-inner",
                                "cls",
                                "lg:ml-0 md:ml-0 "
                              )}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt vuông"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt vuông")
                                  }
                                >
                                  Mặt vuông
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt tròn"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt tròn")
                                  }
                                >
                                  Mặt tròn
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt chữ nhật"
                                  onClick={() =>
                                    handleFilterChange(
                                      "kieu_dang",
                                      "Mặt chữ nhật"
                                    )
                                  }
                                >
                                  Mặt chữ nhật
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Mặt Oval"
                                  onClick={() =>
                                    handleFilterChange("kieu_dang", "Mặt Oval")
                                  }
                                >
                                  Mặt Oval
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* item6 */}
                      <div className={cx("field-area", "field-item")}>
                        <div
                          className={cx(
                            "cursor-pointer font-normal uppercase text-[12px] transition-all duration-300"
                          )}
                          data-id="id-field-mau-mat"
                          onClick={toggleMenu}
                        >
                          Màu mặt
                        </div>
                        {isOpen && (
                          <div
                            id="mau-mat"
                            className={cx(
                              "field-label",
                              "filters-in-field",
                              "filters-in-field-1-column",
                              "filter-4-mau-mat"
                            )}
                          >
                            <span className={cx("close")}>x</span>
                            <div
                              className={cx("filters-in-field-inner", "cls")}
                            >
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Trắng"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Trắng")
                                  }
                                >
                                  Trắng
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Đen"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Đen")
                                  }
                                >
                                  Đen
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Xanh lam"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Xanh lam")
                                  }
                                >
                                  Xanh lam
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Vàng"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Vàng")
                                  }
                                >
                                  Vàng
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Đỏ"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Đỏ")
                                  }
                                >
                                  Đỏ
                                </Link>
                              </div>
                              <div className={cx("cls", "item")}>
                                <Link
                                  rel="nofollow"
                                  href="#"
                                  title="Nâu"
                                  onClick={() =>
                                    handleFilterChange("mau_mat", "Nâu")
                                  }
                                >
                                  Nâu
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={cx("field-title")}>
                    <div className={cx("title-name")}>
                      <div className={cx("cat-title")}>
                        <div className={cx("cat-title-main")} id="cat-dong-ho">
                          <div className={cx("text-[20px]  ")}>
                            <h1>Đồng hồ treo tường</h1>
                          </div>
                        </div>
                        <div className={cx("clear")} />
                      </div>
                    </div>
                    <select
                      className={cx(
                        "order-select",
                        "max-w-[180px] lg:mt-0 mt-[40px] right-2 "
                      )}
                      name="order-select"
                      onChange={handleSortChange}
                    >
                      <option value="">Sắp xếp theo</option>
                      <option value="asc">Giá từ thấp tới cao</option>
                      <option value="desc">Giá từ cao tới thấp</option>
                      <option value="newest">Mới nhất</option>
                      <option value="hot">Sản phẩm hot</option>
                    </select>
                    <div className={cx("clear")} />
                  </div>

                  <div className={cx("clear")} />
                  <div
                    className={cx(
                      "grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 max-w-[1170px] mx-auto gap-y-[30px]"
                    )}
                  >
                    {displayedProducts.map((item) => (
                      <div
                        key={item._id}
                        className={cx("text-center relative")}
                      >
                        {item.gia_giam > 0 && (
                          <div
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
                              <span
                                className={cx(
                                  "text-red-600 font-bold text-[16px]"
                                )}
                              >
                                Giá KM: {formatCurrency(item.gia_giam)}
                              </span>
                            </>
                          ) : (
                            <span
                              className={cx(
                                "text-red-600 font-bold text-[16px]"
                              )}
                            >
                              Giá KM: {formatCurrency(item.gia_san_pham)}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* phân trang*/}
                  <div className={cx("pagination", "lg:flex hidden")}>
                    {/* Prev trang đầu */}
                    <span
                      title="First page"
                      className={cx({
                        disabled: currentPage === 1,
                        "other-page": currentPage > 1,
                      })}
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>

                    {/* Prev 1 trang */}
                    <span
                      className={cx({
                        disabled: currentPage === 1,
                        "other-page": currentPage > 1,
                      })}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      ‹
                    </span>

                    {/* Trang hiện tại */}
                    <span className={cx("currentPage")}>
                      {`Trang ${currentPage} / ${totalPages || 1}`}
                    </span>

                    {/* Next 1 trang */}
                    <span
                      className={cx({
                        disabled: currentPage === totalPages,
                        "other-page": currentPage < totalPages,
                      })}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      ›
                    </span>

                    {/* Next tới trang cuối */}
                    <span
                      className={cx({
                        disabled: currentPage === totalPages,
                        "other-page": currentPage < totalPages,
                      })}
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>

                  <div className="lg:hidden flex justify-center items-center my-5 flex-wrap">
                    <span
                      title="First page"
                      className={classNames(
                        "inline-block px-4 py-2 mx-1 border rounded text-sm",
                        currentPage === 1
                          ? "cursor-not-allowed text-gray-500 border-gray-200"
                          : "cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      )}
                      onClick={() => currentPage > 1 && handlePageChange(1)}
                    >
                      ‹‹
                    </span>

                    {/* Previous page */}
                    <span
                      className={classNames(
                        "inline-block px-4 py-2 mx-1 border rounded text-sm",
                        currentPage === 1
                          ? "cursor-not-allowed text-gray-500 border-gray-200"
                          : "cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      )}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      ‹
                    </span>

                    {/* Current page */}
                    <span className="inline-block px-4 py-2 mx-1 border border-gray-400   rounded text-sm  text-black  ">
                      {`Trang ${currentPage} / ${totalPages || 1}`}
                    </span>

                    {/* Next page */}
                    <span
                      className={classNames(
                        "inline-block px-4 py-2 mx-1 border rounded text-sm",
                        currentPage === totalPages
                          ? "cursor-not-allowed text-gray-500 border-gray-200"
                          : "cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      )}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      ›
                    </span>

                    {/* Last page */}
                    <span
                      className={classNames(
                        "inline-block px-4 py-2 mx-1 border rounded text-sm",
                        currentPage === totalPages
                          ? "cursor-not-allowed text-gray-500 border-gray-200"
                          : "cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      )}
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(totalPages)
                      }
                    >
                      ››
                    </span>
                  </div>

                  <div className={styles.clear}></div>
                </div>
                <div className={cx("clear")} />
                {/* đánh giá  */}
                <div className={cx("evaluate-cat")}>
                  {/* mô tả */}
                  <div
                    className={cx(
                      "summary-content-cat",
                      "description",
                      "height-auto"
                    )}
                    style={{
                      height: isExpanded ? "auto" : "360px",
                      overflow: isExpanded ? "visible" : "hidden",
                    }}
                  >
                    <h2 dir="ltr" style={{ textAlign: "center" }}>
                      <span style={{ color: "#2980b9" }}>
                        <strong>
                          NÂNG CẤP&nbsp;KHÔNG GIAN SỐNG&nbsp;CỦA BẠN VỚI ĐỒNG HỒ
                          TREO TƯỜNG TRANG TRÍ
                        </strong>
                      </span>
                    </h2>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Bạn đã bao giờ nghĩ đến trước khi đồng hồ được phát minh,
                      người xưa đã theo dõi thời gian nhờ chuyển động của mặt
                      trời như thế nào chưa. Đồng hồ giúp chúng ta quản lý cuộc
                      sống của mình.
                      <strong>
                        <em>Đồng hồ treo tường</em>
                      </strong>
                      &nbsp;là một vật dụng quan trọng trong gia đình&nbsp;giúp
                      bạn luôn đúng giờ, đến đúng nơi, đúng lúc để có được thành
                      công trong cuộc sống.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="Đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong-hinh1.jpg"
                        />
                        <figcaption>
                          <strong>
                            <Link href="#">
                              Stonehenge, một trong những đồng hồ mặt trời được
                              biết đến đầu tiên
                            </Link>
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Nếu muốn cạnh tranh với thế giới ngày nay để thành công,
                      điều rất quan trọng là phải biết ảnh hưởng của thời gian
                      đối với cuộc sống của chúng ta. Để coi trọng thời gian,
                      bạn nên đúng giờ, bạn cần có
                      <em>
                        <strong>đồng hồ treo tường</strong>
                      </em>{" "}
                      xung quanh mình. Và thực sự với một hoặc nhiều chiếc đồng
                      hồ treo tường hiện diện trong không gian sống của bạn nó
                      sẽ khiến bạn và gia đình mình kiểm soát được thời gian
                      trong mọi hoạt động của cuộc sống, góp phần cải thiện chất
                      lượng sống của mình.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong_hinh2.jpg"
                        />
                        <figcaption>
                          <strong>
                            Đồng hồ tháp chuông Big Ben tại London
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      <Link href="#">
                        <em>
                          <strong>Đồng hồ treo tường sang trọng</strong>
                        </em>
                      </Link>
                      &nbsp;không chỉ giúp bạn nhìn thấy đúng thời điểm và nó
                      cũng là một phần trang trí rất tuyệt vời cho ngôi nhà, văn
                      phòng làm việc hay bất cứ không gian nào khác. Bên cạnh
                      đó, lựa chọn
                      <em>
                        <strong>
                          <Link href="#">đồng hồ treo tường</Link>
                        </strong>
                        <Link href="#">
                          <strong>&nbsp;đẹp</strong>
                        </Link>
                      </em>
                      &nbsp;là một trong những ưu tiên hàng đầu khi nghĩ đến
                      thiết kế nội thất trong căn nhà của bạn. Một không gian
                      sống hiện đại được hưởng lợi từ những đường nét tinh tế
                      trên những chiếc&nbsp;
                      <strong>
                        <Link href="#">
                          <em>đồng hồ treo tường cao cấp</em>
                        </Link>
                      </strong>
                      sẽ khiến bạn và người thân của mình hoàn toàn hài lòng với
                      chúng.
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <figure
                        className={cx("image")}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="Đồng hồ treo tường Seiko"
                          height={734}
                          className={cx("lazy")}
                          width={1100}
                          style={{ display: "inline-block", opacity: 1 }}
                          src="/image/item/donghotreotuong-hinh3.jpg"
                        />
                        <figcaption>
                          <strong>
                            Đồng hồ treo tường trang trí không gian sống
                          </strong>
                        </figcaption>
                      </figure>
                    </div>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      Cho dù bạn đang tìm kiếm một chiếc
                      <Link href="#">
                        <em>
                          <strong>đồng hồ treo tường đẹp</strong>
                        </em>
                      </Link>
                      &nbsp;theo phong cách cổ điển hay sang trọng và tinh tế,
                      <strong>
                        <Link href="#">Đồng hồ WRISTLY</Link>
                      </strong>{" "}
                      có hơn&nbsp;800+ mẫu cho bạn lựa chọn đến từ thương hiệu
                      <em>
                        <strong>
                          <Link href="#"> đồng hồ treo tường&nbsp;Seiko </Link>
                        </strong>
                      </em>
                      và
                      <em>
                        <strong>
                          <Link href="#"> đồng hồ treo tường&nbsp;Rhythm </Link>
                        </strong>
                      </em>
                      , với nhiều kiểu dáng và mức giá khác nhau…
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      &nbsp;
                    </p>
                    <p dir="ltr" style={{ textAlign: "justify" }}>
                      <em>
                        <strong>Các thông tin tham khảo thêm</strong>
                      </em>
                    </p>
                    <ul dir="ltr">
                      <li>
                        <Link href="#">
                          ĐỊA CHỈ BÁN ĐỒNG HỒ TREO TƯỜNG UY TÍN TẠI HÀ NỘI
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">
                          HƯỚNG DẪN LỰA CHỌN ĐỒNG HỒ TREO TƯỜNG CHO NGÔI NHÀ CỦA
                          BẠN
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">
                          TOP CÁC MẪU ĐỒNG HỒ TREO TƯỜNG&nbsp;TRANG TRÍ PHÒNG
                          KHÁCH ĐẸP
                        </Link>
                      </li>
                      <li style={{ textAlign: "justify" }}>
                        <Link href="#">HỆ THỐNG CỬA HÀNG CỦA WRISTLY</Link>
                      </li>
                    </ul>
                    <p>&nbsp;</p>
                    <p>
                      <span style={{ color: "#2980b9" }}>
                        <em>
                          <strong>WRISTLY WATCH</strong> luôn&nbsp;mang đến cho
                          khách hàng những chiếc
                          <strong>đồng hồ treo tường đẹp</strong>&nbsp;đáp ứng
                          hoàn hảo&nbsp;cho cuộc&nbsp;sống hiện&nbsp;đại, thể
                          hiện nét thẩm mỹ tối giản và thêm sức hấp dẫn trực
                          quan cho không gian sống của mình.
                        </em>
                      </span>
                    </p>
                  </div>
                </div>
                {/* xem thêm */}
                <div className={cx("vm-summary-content-cat")}>
                  <span onClick={toggleDescription}>
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </span>
                </div>
                <div className={cx("clear")} />
                <div className={cx("aq-relates content-li")} />
              </div>
            </div>
            {/* end - đồng hồ nam */}
            <div className={cx("clear")} />
          </div>
        </div>
      </div>
    </>
  );
}
