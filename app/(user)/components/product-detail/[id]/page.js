"use client";
import { useEffect, useState, useRef, use } from "react";
import styles from "./detail.module.css";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../components-giaodich/redux/slices/cartSilce";
import Loading from "../../loading/page";
import Swal from "sweetalert2";
import Slider from "react-slick";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useSearchParams } from "next/navigation";
import cx from "classnames";
export default function Detail({ params }) {
  const [user, setUser] = useState(null);
  const [product, setProducts] = useState(null);
  const [cate, setCate] = useState(null);
  const [related, SetRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [star, setStar] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Mô tả chi tiết");
  const [activeTab, setActiveTab] = useState("tab-1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [so_luong, setSo_luong] = useState(1);
  const searchParams = useSearchParams();

  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.cart);
  const cart = Array.isArray(cartState) ? cartState : cartState.items || [];

  const currentCartItem = product ? cart.find((cartItem) => cartItem._id === product._id) : null;

  const [maxQuantity, setMaxQuantity] = useState(0);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  //cuộn trang bình luận
  useEffect(() => {
    if (searchParams.get("scrollTo") === "comments" && !loading && !error) {
      // Delay to ensure elements are rendered
      setTimeout(() => {
        handleScroll("comments");
      }, 100);
    }
  }, [searchParams, loading, error]);

  useEffect(() => {
    if (product && product._id) {
      const fetchProductQuantity = async () => {
        try {
          const response = await fetch(`http://localhost:5000/product/check/${product._id}?quantity=${so_luong}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching product quantity: ${JSON.stringify(errorData)}`);
          }
          const data = await response.json();
          setMaxQuantity(data.product.so_luong);
        } catch (error) {
          console.error("Error fetching product quantity:", error);
        }
      };

      fetchProductQuantity();
    }
  }, [product, so_luong]);

  const handleIncrease = (e) => {
    e.preventDefault();
    const currentQuantity = currentCartItem ? currentCartItem.so_luong : 0;
    const totalRequested = currentQuantity + so_luong + 1;
    console.log("currentQuantity:", currentQuantity);
    console.log("totalRequested:", totalRequested);
    console.log("maxQuantity:", maxQuantity);

    if (maxQuantity !== undefined && totalRequested <= maxQuantity) {
      setSo_luong((prev) => prev + 1);
    } else {
      Swal.fire({
        title: "Không đủ hàng",
        text: "Số lượng thêm vượt quá số lượng trong kho.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    if (so_luong > 1) {
      setSo_luong((prev) => prev - 1);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!product) {
      Swal.fire({
        title: "Lỗi",
        text: "Sản phẩm không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Inspect cart structure
      const currentCartItem = cart.find((cartItem) =>
        cartItem.item ? cartItem.item._id === product._id : cartItem._id === product._id
      );

      const currentQuantity = currentCartItem ? currentCartItem.so_luong : 0;
      const totalRequested = currentQuantity + so_luong;

      // Check against stock
      if (totalRequested > product.so_luong) {
        Swal.fire({
          title: "Không đủ hàng",
          text: "Số lượng thêm vượt quá số lượng trong kho.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Check product quantity from server
      const response = await fetch(`http://localhost:5000/product/check/${product._id}?quantity=${so_luong}`);
      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: "Không đủ hàng",
          text: data.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        dispatch(addToCart({ item: product, so_luong }));
        Swal.fire({
          title: "Thành công!",
          text: "Sản phẩm đã được thêm vào giỏ hàng.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error checking product quantity:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi kiểm tra số lượng sản phẩm.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/chitietsp/${params.id}`);
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setProducts(data.product);
        setCate(data.th);
        setMaxQuantity(data.so_luong);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  // sản phẩm liên quan theo danh mục
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/related/${params.id}`);
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        SetRelated(data.products);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchRelated();
  }, [params.id]);

  // tính % sản phẩm
  const roundDiscount = (discountPercentage) => {
    const discountLevels = [10, 15, 20, 25, 30, 40, 50];
    return discountLevels.reduce((prev, curr) =>
      Math.abs(curr - discountPercentage) < Math.abs(prev - discountPercentage) ? curr : prev
    );
  };
  // slidershow
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Kích thước màn hình md
        settings: {
          slidesToShow: 3, // Hiển thị 3 sản phẩm
        },
      },
      {
        breakpoint: 640, // Kích thước màn hình sm
        settings: {
          slidesToShow: 2, // Hiển thị 2 sản phẩm
        },
      },
      {
        breakpoint: 480, // Kích thước màn hình nhỏ hơn
        settings: {
          slidesToShow: 2, // Hiển thị 1 sản phẩm
        },
      },
    ],
  };

  // lấy thông tin người dùng
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      try {
        const { _id } = jwtDecode(token);
        setUser({ _id });
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // thêm bình luận sản phẩm theo id người dùng và id sản phẩm
  // kiểm tra người dùng đã mua sản phẩm chưa mới được bình luận sản phẩm
  const addComment = async () => {
    if (user) {
      if (commentText) {
        try {
          const response = await fetch(`http://localhost:5000/comment/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              noi_dung: commentText,
              id_nguoi_dung: user._id,
              id_san_pham: params.id,
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            if (data.message === "Người dùng chưa mua sản phẩm") {
              return Swal.fire({
                icon: "warning",
                title: "Bạn cần mua sản phẩm này để có thể bình luận",
              });
            }
            throw new Error(data.message || "Lỗi không thể thêm bình luận");
          }

          console.log(data.message);

          setCommentText("");
          Swal.fire({
            icon: "success",
            title: "Bình luận thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        } catch (error) {
          setError(error.message);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng nhập bình luận!",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập để bình luận",
      }).then(() => {
        if (typeof window !== "undefined" && params?.id) {
          const currentUrl = encodeURIComponent(`/components/product-detail/${params.id}`);
          window.location.href = `/components/components-login/login?redirect=${currentUrl}`;
        } else {
          window.location.href = `/components/components-login/login`;
        }
      });
    }
  };
  // lấy tất cả bình luận theo id sản phẩm với phân trang
  useEffect(() => {
    const getAllComment = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/comment/getAll/${params.id}?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();

        setComments(data.comments);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getAllComment();
  }, [params.id, currentPage]);

  // hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // hàm chọn tab cha
  const handleTabClick = (tab, event) => {
    event.preventDefault();
    setSelectedTab(tab);
  };

  // hàm để đổi tab con
  const openTab = (event, tabId) => {
    event.preventDefault();
    setActiveTab(tabId);
  };

  // lấy giá trị số lượng sản phẩm
  const handleInputChange = (e) => {
    let value = e.target.value;

    // Chỉ cho phép số và chuỗi rỗng
    if (/^\d*$/.test(value)) {
      // Giới hạn tối đa 2 chữ số
      if (value.length <= 2) {
        setSo_luong(value === "" ? "" : parseInt(value, 10));
      }
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error:{error}</p>;
  }
  return (
    <>
      <div className="container py-5">
        <div className={cx("flex", "items-center uppercase  md:text-[16px] text-[10px] mb-5")}>
          <span className={cx("")}>
            <Link href="/" className={cx(" text-gray-800", "hover:text-[#796752]")}>
              Trang chủ
            </Link>
          </span>
          <span className={cx("separator", "mx-3", "text-stone-400")}>&gt;</span>

          <span className={cx("")}>
            <Link href={`/components/product-detail/${params.id}`} className={cx("link", "text-gray-800")}>
              Chi tiết sản phẩm
            </Link>
          </span>
          <span className={cx("separator", "mx-3", "text-stone-400")}>&gt;</span>
          <span className={cx("", "text-red-500")}>
            <Link href={`/components/product-detail/${params.id}`} className={cx("link", "text-red-500")}>
              {product.ten_san_pham}
            </Link>
          </span>
        </div>
      </div>

      <div className="mb-[30px] container px-4 flex flex-wrap">
        {/* FrameLeft */}
        <div className="w-full sm:w-1/2 lg:w-[34%] mb-6 relative mt-5">
          {product.gia_giam > 0 && (
            <div className="absolute right-2 top-2 bg-[#f9141e] text-white w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] text-[12px] sm:text-[13px] text-center z-[2] rounded-full box-border pt-[10px] sm:pt-[15px] leading-[18px] sm:leading-[20px]">
              -
              <span id="discount-pro">
                {roundDiscount(Math.round(((product.gia_san_pham - product.gia_giam) / product.gia_san_pham) * 100))}
              </span>
              <span>%</span>
            </div>
          )}

          <div className="relative left-0 text-center mb-5">
            <img
              className={`${styles.imgResponsive} ${styles.bkProductImage}`}
              src={`http://localhost:5000/images/${product.hinh_anh}`}
              alt={product.ten}
              width="398"
              height="481"
            />
          </div>

          <div className="text-center">
            <div className="inline-block -mx-1.5">
              <div
                className="float-left mx-1.5 box-border text-center cursor-pointer inline-block max-w-[57px]"
                style={{ maxWidth: "calc(100% / 5 -10px)" }}
              >
                <button className="border-none bg-none" onClick={() => handleScroll("prodetails-tab1")}>
                  <img
                    style={{
                      borderRadius: "10px",
                      background: "#fff",
                      border: "1px solid #ddddddba",
                      transition: "all 0.2s",
                    }}
                    src="/image/item/picture3.jpg"
                    alt=""
                  />
                </button>
                <span className="text-[11px] text-[#5a5555] inline-block mt-1.5 leading-[14px]">
                  Thông tin sản phẩm
                </span>
              </div>

              <div
                className="float-left mx-1.5 box-border text-center cursor-pointer inline-block max-w-[57px]"
                style={{ maxWidth: "calc(100% / 5 -10px)" }}
              >
                <button className="border-none bg-none" onClick={() => handleScroll("prodetails-tab2")}>
                  <img
                    style={{
                      borderRadius: "10px",
                      background: "#fff",
                      border: "1px solid #ddddddba",
                      transition: "all 0.2s",
                    }}
                    src="/image/item/picture5.jpg"
                    alt=""
                  />
                </button>
                <span className="text-[11px] text-[#5a5555] inline-block mt-1.5 leading-[14px]">
                  Hướng dẫn chọn size
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* frame center */}
        <div className="w-full sm:w-1/2 lg:w-[42%] py-0 px-1 box-border mt-5">
          <div className={`${styles.nameTable} ${styles.mt20}`}>
            <div className="text-center mb-[10px]">
              <img
                className={styles.imageGiftCat}
                src={`http://localhost:5000/images/${cate.hinh_anh}`}
                alt={cate.thuong_hieu}
              />
            </div>
            <div className="relative">
              <h1 className="text-[20px] leading-[33px] uppercase w-[calc(100%-72px)]">{product.ten}</h1>
            </div>
            <span className={styles.codeProduct}>Mã sản phẩm: {product.ma_san_pham}</span>
            <ul className="leading-[30px] normal-case mb-3">
              <li className={styles.cf}>
                <div className={`${styles.liLeft} float-left`}>Loại máy</div>
                <span className="float-left">:</span>
                <div className={`${styles.liRight} float-left`}>{product.loai_may}</div>
              </li>
              <li className={styles.cf}>
                <div className={`${styles.liLeft} float-left`}>Đường kính</div>
                <span className="float-left">:</span>
                <div className={`${styles.liRight} float-left`}>{product.duong_kinh}</div>
              </li>
              {product.so_luong > 0 ? (
                <li className="text-uppercase font-bold relative pl-6 text-[#4caf50]">
                  <svg
                    className="fill-[#4caf50] w-5 h-5 absolute left-0 top-[5px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40px"
                    height="40px"
                    viewBox="0 -3.5 170 170"
                  >
                    <path d="M142.196 30.4125C142.586 30.0637 142.897 29.6356 143.109 29.1567C143.32 28.6778 143.427 28.1592 143.422 27.6357C143.417 27.1122 143.3 26.5959 143.079 26.1213C142.858 25.6467 142.538 25.2248 142.141 24.8838C141.722 24.5249 141.307 24.1678 140.895 23.8127C137.751 21.1093 134.5 18.3102 131.1 15.9225C105.123 -2.36044 78.1316 -2.4633 50.8803 7.23287C26.2068 16.0055 10.3619 33.5563 3.77909 59.3882C-3.56415 88.249 2.86618 113.71 22.9048 135.073C23.4261 135.625 23.9582 136.177 24.4895 136.704C35.2539 147.469 48.6614 154.115 59.2847 158.739C63.8445 160.731 87.2404 163.149 93.5707 162.206C131.19 156.588 155.946 135.37 164.569 99.8725C166.215 92.9194 167.035 85.7962 167.011 78.6508C166.974 71.1466 165.712 63.6988 163.275 56.6012C163.097 56.0703 162.805 55.5851 162.418 55.1805C162.031 54.7759 161.56 54.4618 161.037 54.2606C160.515 54.0595 159.954 53.9764 159.396 54.0171C158.838 54.0579 158.295 54.2216 157.808 54.4965L157.706 54.5547C156.931 54.9984 156.336 55.7005 156.027 56.5381C155.717 57.3757 155.712 58.2954 156.012 59.1364C158.212 65.2371 159.334 71.674 159.327 78.1592C159.251 85.9394 158.198 93.6792 156.192 101.197C150.248 122.8 136.038 138.545 112.75 149.315C89.0741 160.65 55.1215 149.19 46.0879 143.226C36.1031 136.4 27.3663 127.908 20.2596 118.121C9.11418 102.34 6.61369 79.6587 12.6028 58.9229C15.4055 49.3489 20.3036 40.5185 26.9421 33.0722C33.5806 25.6259 41.793 19.7503 50.9838 15.8714C74.8941 5.93474 98.8852 4.18192 122.285 19.0635C125.422 21.061 133.422 27.3424 137.465 30.5501C138.143 31.0882 138.99 31.3691 139.855 31.3432C140.721 31.3172 141.549 30.986 142.194 30.4082L142.196 30.4125Z"></path>
                    <path d="M74.6287 104.313C76.2312 102.79 77.1115 102.019 77.9173 101.177C103.753 74.1855 132.047 49.8851 160.508 25.7727C161.584 24.8619 162.685 23.7 163.958 23.3737C165.493 22.9815 167.996 23.4326 168.682 24.2661C169.133 24.8821 169.418 25.6035 169.509 26.3612C169.601 27.1189 169.496 27.8875 169.206 28.5932C168.537 30.3474 166.907 31.8498 165.429 33.1629C156.607 41.0019 147.538 48.5708 138.872 56.5716C120.756 73.3024 102.756 90.1576 84.8704 107.137C77.0334 114.561 74.0173 114.862 66.8059 106.929C62.0589 101.705 47.7328 84.0973 43.3455 78.5495C42.7256 77.6872 42.1735 76.7781 41.6941 75.8305C40.7045 74.0756 40.0576 72.1419 42.0246 70.7814C44.2158 69.2662 45.7707 70.8473 47.0696 72.4937C48.384 74.1607 49.5048 75.9916 50.9121 77.5713C55.2811 82.4737 69.908 99.1421 74.6287 104.313Z"></path>
                  </svg>
                  Sẵn hàng
                </li>
              ) : (
                <li className="text-uppercase font-bold relative pl-6 text-[#ef0000]">
                  <svg
                    className="fill-[#ef0000] w-5 h-5 absolute left-0 top-[5px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40px"
                    height="40px"
                    viewBox="0 -3.5 170 170"
                  >
                    <path
                      fill="currentColor"
                      d="M142.196 30.4125C142.586 30.0637 142.897 29.6356 143.109 29.1567C143.32 28.6778 143.427 28.1592 143.422 27.6357C143.417 27.1122 143.3 26.5959 143.079 26.1213C142.858 25.6467 142.538 25.2248 142.141 24.8838C141.722 24.5249 141.307 24.1678 140.895 23.8127C137.751 21.1093 134.5 18.3102 131.1 15.9225C105.123 -2.36044 78.1316 -2.4633 50.8803 7.23287C26.2068 16.0055 10.3619 33.5563 3.77909 59.3882C-3.56415 88.249 2.86618 113.71 22.9048 135.073C23.4261 135.625 23.9582 136.177 24.4895 136.704C35.2539 147.469 48.6614 154.115 59.2847 158.739C63.8445 160.731 87.2404 163.149 93.5707 162.206C131.19 156.588 155.946 135.37 164.569 99.8725C166.215 92.9194 167.035 85.7962 167.011 78.6508C166.974 71.1466 165.712 63.6988 163.275 56.6012C163.097 56.0703 162.805 55.5851 162.418 55.1805C162.031 54.7759 161.56 54.4618 161.037 54.2606C160.515 54.0595 159.954 53.9764 159.396 54.0171C158.838 54.0579 158.295 54.2216 157.808 54.4965L157.706 54.5547C156.931 54.9984 156.336 55.7005 156.027 56.5381C155.717 57.3757 155.712 58.2954 156.012 59.1364C158.212 65.2371 159.334 71.674 159.327 78.1592C159.251 85.9394 158.198 93.6792 156.192 101.197C150.248 122.8 136.038 138.545 112.75 149.315C89.0741 160.65 55.1215 149.19 46.0879 143.226C36.1031 136.4 27.3663 127.908 20.2596 118.121C9.11418 102.34 6.61369 79.6587 12.6028 58.9229C15.4055 49.3489 20.3036 40.5185 26.9421 33.0722C33.5806 25.6259 41.793 19.7503 50.9838 15.8714C74.8941 5.93474 98.8852 4.18192 122.285 19.0635C125.422 21.061 133.422 27.3424 137.465 30.5501C138.143 31.0882 138.99 31.3691 139.855 31.3432C140.721 31.3172 141.549 30.986 142.194 30.4082L142.196 30.4125Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M74.6287 104.313C76.2312 102.79 77.1115 102.019 77.9173 101.177C103.753 74.1855 132.047 49.8851 160.508 25.7727C161.584 24.8619 162.685 23.7 163.958 23.3737C165.493 22.9815 167.996 23.4326 168.682 24.2661C169.133 24.8821 169.418 25.6035 169.509 26.3612C169.601 27.1189 169.496 27.8875 169.206 28.5932C168.537 30.3474 166.907 31.8498 165.429 33.1629C156.607 41.0019 147.538 48.5708 138.872 56.5716C120.756 73.3024 102.756 90.1576 84.8704 107.137C77.0334 114.561 74.0173 114.862 66.8059 106.929C62.0589 101.705 47.7328 84.0973 43.3455 78.5495C42.7256 77.6872 42.1735 76.7781 41.6941 75.8305C40.7045 74.0756 40.0576 72.1419 42.0246 70.7814C44.2158 69.2662 45.7707 70.8473 47.0696 72.4937C48.384 74.1607 49.5048 75.9916 50.9121 77.5713C55.2811 82.4737 69.908 99.1421 74.6287 104.313Z"
                    ></path>
                  </svg>
                  Hết hàng
                </li>
              )}
            </ul>
            <div className={`${styles.boxGift} md:w-[100%]`}>
              <div className={styles.titleGift}>Khuyến mãi</div>
              <div className={styles.gift}>
                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;10%</strong>
                  </span>
                  &nbsp;toàn bộ thương hiệu <strong>Tissot</strong> từ <strong>20.12 - 1.1</strong>
                </p>
                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;30%</strong>
                  </span>
                  &nbsp;khi mua sản phẩm thứ 2 là đồng hồ&nbsp;
                  <strong>
                    <Link
                      href={`/components/components-thuonghieu/chitietthuonghieu/Casio`}
                      style={{ color: "#3498db" }}
                    >
                      Casio
                    </Link>
                    , &nbsp;
                    <Link
                      href={`/components/components-thuonghieu/chitietthuonghieu/CalvinKlein`}
                      style={{ color: "#3498db" }}
                    >
                      Calvin Klein.
                    </Link>
                  </strong>
                </p>
                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;25%</strong>
                  </span>
                  &nbsp;khi mua sản phẩm thứ 2 là đồng hồ
                  <strong>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/ClaudeBernard`}>
                      <span style={{ color: "#3498db" }}>&nbsp;Claude Bernard</span>
                    </Link>
                    <span style={{ color: "#3498db" }}>, </span>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Edox`}>
                      <span style={{ color: "#3498db" }}>Edox.</span>
                    </Link>
                  </strong>
                </p>

                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;20%</strong>
                  </span>
                  &nbsp;khi mua sản phẩm thứ 2 là đồng hồ
                  <strong>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/DANIELWELLINGTON`}>
                      <span style={{ color: "#3498db" }}>&nbsp;Daniel Wellington</span>
                    </Link>
                    &nbsp;
                    <span style={{ color: "#3498db" }}>,</span>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/OlymPianus`}>
                      <span style={{ color: "#3498db" }}>&nbsp;Olym Pianus</span>
                    </Link>
                  </strong>
                </p>

                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;15%</strong>
                  </span>
                  &nbsp;khi mua sản phẩm thứ 2 là đồng hồ
                  <strong>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Hamilton`}>
                      <span style={{ color: "#3498db" }}>&nbsp;Hamilton</span>
                    </Link>
                    <span style={{ color: "#3498db" }}>, </span>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Mido`}>
                      <span style={{ color: "#3498db" }}>Mido</span>
                    </Link>
                    <span style={{ color: "#3498db" }}>, </span>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Certina`}>
                      <span style={{ color: "#3498db" }}>Certina</span>
                    </Link>
                    <span style={{ color: "#3498db" }}>, </span>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Seiko`}>
                      <span style={{ color: "#3498db" }}>Seiko,</span>
                    </Link>
                    &nbsp;
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/TISSOT`}>
                      <span style={{ color: "#3498db" }}>Đồng hồ Tissot</span>
                    </Link>
                  </strong>
                </p>

                <p>
                  Giảm
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;20%</strong>
                  </span>
                  &nbsp;khi mua sản phẩm thứ 2 là
                  <span>,</span>&nbsp;
                  <strong>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/Fossil`}>
                      <span style={{ color: "#3498db" }}>Fossil</span>
                    </Link>
                  </strong>
                  <span>,</span>&nbsp;
                  <strong>
                    <Link href={`/components/components-thuonghieu/chitietthuonghieu/MichaelKors`}>
                      <span style={{ color: "#3498db" }}>&nbsp;Đồng hồ nữ Michael Kors</span>
                    </Link>
                  </strong>
                  <span style={{ color: "#3498db" }}>,</span>
                  &nbsp;có giá niêm yết từ
                  <span style={{ color: "#ff0000" }}>
                    <strong>&nbsp;2 triệu</strong>
                  </span>
                  &nbsp;trở lên
                </p>
              </div>
            </div>
            <div className="clear-both"></div>
          </div>
        </div>

        {/* frame right */}
        <div className={`${styles.frameRight} w-full sm:w-[100%] md:w-[100%] lg:w-[22%] lg:ml-5 mb-[25px] mt-5`}>
          <div className="bg-[#f1f1f1cc] mb-5 py-[25px]">
            <div className="px-[15px] ">
              {product.gia_giam > 0 ? (
                <>
                  <div className="line-through mb-[6px] text-sm uppercase font-bold text-[#4c4c4c]">
                    <span>Giá</span>
                    <span className="line-through mb-[6px] text-sm uppercase font-bold text-[#4c4c4c]">
                      {product.gia_san_pham.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="text-lg text-[#e10c00] font-semibold">
                    <div className=" text-sm uppercase font-bold text-[#4c4c4c]">Giá KM:</div>
                    <div className="font-bold text-[#f30404] text-[25px]">
                      <input type="hidden" value="1" className={styles.bkProductQty} />
                      <span className={styles.bkProductPrice}>{product.gia_giam.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="text-[#5d5d5d] text-[13px] mb-5">(Giá trên đã bao gồm VAT)</div>
                  </div>
                </>
              ) : (
                <div className="text-lg text-[#e10c00] font-semibold">
                  <div className="mb-[6px] text-sm uppercase font-bold text-[#4c4c4c]">Giá:</div>
                  <div className="font-bold text-[#f30404] text-[25px]">
                    <input type="hidden" value="1" className={styles.bkProductQty} />
                    <span className={styles.bkProductPrice}>{product.gia_san_pham.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="text-[#5d5d5d] text-[13px] mb-5">(Giá trên đã bao gồm VAT)</div>
                </div>
              )}
              <div className="clear-both"></div>
              <div className={styles.boxPriceRightBot}>
                <div className={`${styles.btnBuy}`}>
                  {/*tăng giảm số lượng*/}
                  <form onSubmit={handleAddToCart}>
                    <div
                      className={`${styles.numberInput} flex justify-center items-center border border-[#ccc] mb-2 px-4 `}
                    >
                      <button
                        type="button"
                        className="border-none bg-none p-2 cursor-pointer text-[20px] mx-[50px]"
                        onClick={handleDecrease}
                        onChange={handleInputChange}
                      >
                        -
                      </button>
                      <input min="1" type="number" id="number" value={so_luong} onChange={handleInputChange} />
                      <button
                        type="button"
                        className="border-none bg-none p-2 cursor-pointer text-[20px] mx-[50px]"
                        onClick={handleIncrease}
                        onChange={handleInputChange}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="submit"
                      className={`${styles.submit} bg-[#796752] border-none uppercase no-underline font-[arial] text-[14px] rounded-[5px] text-white text-center py-[12px] w-full mb-[15px] transition-all duration-200 backface-hidden inline-block relative cursor-pointer`}
                    >
                      Thêm vào giỏ hàng
                    </button>

                    {/* <button
                      style={{ marginBottom: "20px" }}
                      type="button"
                      className={`${styles.submit} border-none uppercase no-underline font-[arial] text-[14px] rounded-[5px] text-white text-center py-[12px] w-full mb-[10px] transition-all duration-200 backface-hidden inline-block relative cursor-pointer`}
                    >
                      Tư vấn miễn phí
                    </button> */}
                  </form>
                </div>
                <div className="relative pl-9">
                  <svg
                    className="w-[30px] h-[30px] absolute left-0 top-[5px] fill-black"
                    width="30px"
                    height="30px"
                    fill="#fff"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 32.666 32.666"
                    style={{ enableBackground: "new 0 0 32.666 32.666" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M28.189,16.504h-1.666c0-5.437-4.422-9.858-9.856-9.858l-0.001-1.664C23.021,4.979,28.189,10.149,28.189,16.504z
                  M16.666,7.856L16.665,9.52c3.853,0,6.983,3.133,6.981,6.983l1.666-0.001C25.312,11.735,21.436,7.856,16.666,7.856z 
                  M16.333,0C7.326,0,0,7.326,0,16.334c0,9.006,7.326,16.332,16.333,16.332c0.557,0,1.007-0.45,1.007-1.006
                  c0-0.559-0.45-1.01-1.007-1.01c-7.896,0-14.318-6.424-14.318-14.316c0-7.896,6.422-14.319,14.318-14.319
                  c7.896,0,14.317,6.424,14.317,14.319c0,3.299-1.756,6.568-4.269,7.954c-0.913,0.502-1.903,0.751-2.959,0.761
                  c0.634-0.377,1.183-0.887,1.591-1.529c0.08-0.121,0.186-0.228,0.238-0.359c0.328-0.789,0.357-1.684,0.555-2.518
                  c0.243-1.064-4.658-3.143-5.084-1.814c-0.154,0.492-0.39,2.048-0.699,2.458c-0.275,0.366-0.953,0.192-1.377-0.168
                  c-1.117-0.952-2.364-2.351-3.458-3.457l0.002-0.001c-0.028-0.029-0.062-0.061-0.092-0.092
                  c-0.031-0.029-0.062-0.062-0.093-0.092v0.002c-1.106-1.096-2.506-2.34-3.457-3.459c-0.36-0.424-0.534-1.102-0.168-1.377
                  c0.41-0.311,1.966-0.543,2.458-0.699c1.326-0.424-0.75-5.328-1.816-5.084c-0.832,0.195-1.727,0.227-2.516,0.553
                  c-0.134,0.057-0.238,0.16-0.359,0.24c-2.799,1.774-3.16,6.082-0.428,9.292c1.041,1.228,2.127,2.416,3.245,3.576
                  l-0.006,0.004c0.031,0.031,0.063,0.06,0.095,0.09c0.03,0.031,0.059,0.062,0.088,0.095l0.006-0.006
                  c1.16,1.118,2.535,2.765,4.769,4.255c4.703,3.141,8.312,2.264,10.438,1.098c3.67-2.021,5.312-6.338,5.312-9.719
                  C32.666,7.326,25.339,0,16.333,0z"
                      />
                    </g>
                  </svg>
                  <div>Hoặc mua hàng qua điện thoại</div>
                  <Link title="hotline mua hàng" href="#" className="text-[16px] font-semibold block">
                    084.5487.339
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  end top-product-detail */}
      <div className="clear-both"></div>
      <div className="container">
        <div className={`${styles.blockStrengths}`}>
          <div className={`${styles.strengthsRectangle4Block} flex flex-wrap `}>
            <div className={`${styles.item} relative  w-1/4 lg:w-1/4 w-[50%] sm:w-[50%] md:w-[50%]`}>
              <div className={styles.itemInner}>
                <div className={`${styles.item1} relative`}>
                  <div className={`${styles.isvg} relative`}>
                    <Link href="#" title="100% hàng chính hãng">
                      <svg
                        x="0px"
                        y="0px"
                        viewBox="0 0 405.075 405.075"
                        style={{ enableBackground: "new 0 0 405.075 405.075" }}
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
            <div className={`${styles.item} relative w-1/4 lg:w-1/4  w-[50%] sm:w-[50%] md:w-[50%]`}>
              <div className={styles.itemInner}>
                <div className={`${styles.item1} relative`}>
                  <div className={`${styles.isvg} relative`}>
                    <Link href="#" title="Miễn phí vận chuyển">
                      <svg x="0px" y="0px" viewBox="0 0 512 512" style={{ enableBackground: " new 0 0 512 512" }}>
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
            <div className={`${styles.item} relative w-1/4 lg:w-1/4  w-[50%] sm:w-[50%] md:w-[50%]`}>
              <div className={styles.itemInner}>
                <div className={`${styles.item1} relative`}>
                  <div className={`${styles.isvg} relative`}>
                    <Link href="#" title="Bảo hành 5 năm">
                      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="-65 0 511 511.99875" width="40px">
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
            <div className={`${styles.item} relative w-1/4 lg:w-1/4  w-[50%] sm:w-[50%] md:w-[50%]`}>
              <div className={styles.itemInner}>
                <div className={`${styles.item1} relative`}>
                  <div className={`${styles.isvg} relative`}>
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

      <div className="clear-both"></div>

      {/*   bottom-product-detail */}
      <div className=" container lg:flex justify-between ">
        <div className="w-full lg:pr-5 lg:w-[calc(73%-50px)] md:float-left mt-[30px]">
          <div className="mb-[30px] ">
            <ul className=" flex justify-between ">
              <li
                className={` relative w-[calc(100%/3)] pr-2 border-b-[3px] border-[#ebebeb]  ${
                  selectedTab === "Mô tả chi tiết"
                    ? "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-[#796752]"
                    : ""
                }`}
              >
                <Link
                  className="text-black block p-[20px_0px_15px] text-center uppercase"
                  href="#"
                  onClick={(event) => handleTabClick("Mô tả chi tiết", event)}
                >
                  <span className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]">Mô tả chi tiết</span>
                </Link>
              </li>
              <li
                className={`relative w-[calc(100%/3)] pr-2 border-b-[3px] border-[#ebebeb]${
                  selectedTab === "Chế độ bảo hành"
                    ? "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-[#796752]"
                    : ""
                }`}
              >
                <Link
                  className="text-black block p-[20px_0px_15px] text-center uppercase"
                  href="#"
                  onClick={(event) => handleTabClick("Chế độ bảo hành", event)}
                >
                  <span className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]">Chế độ bảo hành</span>
                </Link>
              </li>
              <li
                className={`relative w-[calc(100%/3)] pr-2 border-b-[3px] border-[#ebebeb]${
                  selectedTab === "Hướng dẫn sử dụng"
                    ? "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[3px] before:bg-[#796752]"
                    : ""
                }`}
              >
                <Link
                  className="text-black block p-[20px_0px_15px] text-center uppercase"
                  href="#"
                  onClick={(event) => handleTabClick("Hướng dẫn sử dụng", event)}
                >
                  <span className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]">Hướng dẫn sử dụng</span>
                </Link>
              </li>
            </ul>
            <div className="clear-both"></div>
          </div>
          {/* detail-product  */}
          {/* mô tả chi tiết  */}
          <div className={styles.productTabContent}>
            <div
              id="prodetails-tab1"
              className={`${styles.prodetailsTab} ${selectedTab === "Mô tả chi tiết" ? "" : styles.hide}`}
            >
              <div className={`${styles.topInfoDetail} md:ml-2`}>
                <div className={styles.titleDetailChar}>Thông tin sản phẩm</div>
                <div className={`${styles.tableCondensed} ${styles.compareTable}`}>
                  <table className={styles.table} border="0" cellPadding="0" width="100%">
                    <tbody>
                      {[
                        { label: "Giới tính:", value: product.gioi_tinh },
                        { label: "Kiểu dáng:", value: product.kieu_dang },
                        { label: "Loại máy:", value: product.loai_may },
                        { label: "Phong cách:", value: product.phong_cach },
                        { label: "Mặt kính:", value: product.mat_kinh },
                        { label: "Đường kính:", value: product.duong_kinh && `${product.duong_kinh}mm` },
                        { label: "Chất liệu vỏ:", value: product.chat_lieu_vo },
                        { label: "Độ dày:", value: product.doday && `${product.doday}mm` },
                        { label: "Chất liệu dây:", value: product.chat_lieu_day },
                        { label: "Size dây:", value: product.size_day },
                        { label: "Độ chịu nước:", value: product.do_chiu_nuoc },
                        { label: "Lug to Lug:", value: product.lug_to_lug && `${product.lug_to_lug}mm` },
                        { label: "Tính năng khác:", value: product.tinh_nang_khac },
                        { label: "Bảo hành chính hãng:", value: product.bao_hanh_chinh_hang },
                        { label: "Màu mặt:", value: product.mau_mat },
                        { label: "Xuất xứ thương hiệu:", value: product.xuat_xu },
                        { label: "Thương hiệu:", value: product.thuong_hieu },
                        { label: "Màu dây:", value: product.mau_day },
                        { label: "Độ dài dây:", value: product.do_dai_day },
                        { label: "Bảo hành chính hãng:", value: "2 năm quốc tế" },
                        { label: "Bảo hành Wristly:", value: "5 năm (bao gồm bảo hành quốc tế)" },
                      ]
                        .filter((item) => item.value)
                        .map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? styles.tr0 : styles.tr1} valign="top">
                            <td className={styles.titleCharactestic} width="40%">
                              {item.label}
                            </td>
                            <td className={styles.contentCharactestic}>{item.value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* chế độ bảo hành */}
            <div
              id="prodetails-tab2"
              className={`${styles.prodetailsTab} ${selectedTab === "Chế độ bảo hành" ? "" : styles.hide}`}
            >
              <blockquote cite="">
                <div className={styles.tabContent}>
                  <div className={styles.configGuarantee}>
                    <p style={{ textAlign: "justify" }}>
                      Theo chính sách bảo hành của các hãng đồng hồ, tất cả các đồng hồ chính hãng bán ra đều kèm theo
                      01 thẻ/ sổ/ giấy bảo hành chính hãng (Quốc tế) có giá trị bảo hành theo thời gian quy định của
                      từng hãng đồng hồ khác nhau.
                      <br />
                      Mỗi thẻ/ sổ/ giấy bảo hành chỉ được phát hành kèm theo mỗi chiếc đồng hồ bán ra một lần duy nhất
                      và không cấp lại dưới bất kỳ hình thức nào.
                    </p>

                    <strong>I. BẢO HÀNH CHÍNH HÃNG (BẢO HÀNH QUỐC TẾ)</strong>

                    <p style={{ textAlign: "justify" }}>
                      Bảo hành chính hãng (hầu hết là bảo hành quốc tế) là chế độ bảo hành do nhà sản xuất (hãng đồng
                      hồ) cung cấp cho tất cả sản phẩm do chính họ sản xuất (sản phẩm chính hãng). Khi quý khách mua
                      đồng hồ chính hãng thì đồng hồ sẽ luôn đi kèm theo chế độ này (biểu thị bằng sổ/thẻ/giấy/... do
                      nhà sản xuất cung cấp). Đồng hồ có bảo hành chính hãng sẽ được đảm bảo những quyền lợi sau:
                    </p>

                    <ul>
                      <li>
                        Được tiếp nhận bảo hành theo quy định của nhà sản xuất tại các trung tâm bảo hành chính hãng và
                        hệ thống đại lý chính thức nơi quý khách mua hàng.
                      </li>
                      <li>
                        Được đặt mua các linh kiện, phụ kiện chính hãng (máy, chi tiết máy, dây, khóa, kính,...) ngay cả
                        khi đã hết thời hạn bảo hành.
                      </li>
                      <li>Bảo hành chính hãng là minh chứng cho tính chính hãng của sản phẩm.</li>
                    </ul>

                    <p style={{ textAlign: "justify" }}>
                      - Bảo hành chỉ có giá trị khi đồng hồ có thẻ/ sổ/ giấy bảo hành chính thức đi kèm, được ghi đầy đủ
                      và chính xác các thông tin như: mã số đồng hồ, mã đáy đồng hồ, địa chỉ bán, ngày mua hàng,...
                      <br />- Thời gian bảo hành được tính kể từ ngày mua ghi trên thẻ/ sổ/ giấy bảo hành và không được
                      gia hạn sau khi hết thời hạn bảo hành:
                    </p>

                    <ul>
                      <li>Bảo hành 1 năm với đồng hồ Nhật Bản (riêng Orient Star là 2 năm).</li>
                      <li>Bảo hành 2 năm với đồng hồ Thụy Sỹ (dòng máy Chronometer của Tissot, Mido là 3 năm).</li>
                      <li>
                        Thương hiệu khác: 2 năm cho Daniel Wellington, Freelook,...; bảo hành máy trọn đời cho Skagen.
                      </li>
                    </ul>

                    <p style={{ textAlign: "justify" }}>
                      - Chỉ bảo hành miễn phí cho các hư hỏng về máy và linh kiện bên trong của đồng hồ khi được xác
                      định do lỗi nhà sản xuất.
                      <br />- Không thay thế hoặc đổi bằng chiếc đồng hồ khác.
                    </p>

                    <u>
                      <strong>Lưu ý:</strong>
                    </u>
                    <p style={{ textAlign: "justify" }}>
                      Đồng hồ không có kết nối với mạng máy tính nên không thể áp dụng bảo hành điện tử. Quý khách vui
                      lòng bảo quản thẻ/ sổ/ giấy bảo hành cẩn thận để được hưởng quyền lợi bảo hành. Duy Anh và các
                      trung tâm bảo hành quốc tế của hãng có quyền từ chối bảo hành nếu không cung cấp đủ giấy tờ.
                    </p>

                    <strong>II. CHÍNH SÁCH BẢO HÀNH RIÊNG CỦA ĐỒNG HỒ DUY ANH</strong>

                    <p style={{ textAlign: "justify" }}>
                      Bắt đầu từ ngày 01/09/2018, khi mua đồng hồ tại Duy Anh (trừ đồng hồ treo tường, để bàn, thông
                      minh), quý khách sẽ nhận được các chính sách bảo hành sau:
                    </p>

                    <ul>
                      <li>Bảo hành máy trong 5 năm, miễn phí công lắp đặt, sửa chữa, kiểm tra chống nước,...</li>
                      <li>Miễn phí thay linh kiện lần đầu, giảm 50% cho các lần sau.</li>
                      <li>Miễn phí lau dầu, bảo dưỡng 5 năm đối với đồng hồ cơ (trừ Kinetic, Auto Quartz, Hybrid).</li>
                      <li>Miễn phí thay pin trọn đời với đồng hồ pin (ngoại trừ Eco-Drive, Solar, Kinetic,...).</li>
                      <li>Miễn phí đánh bóng kính cứng trong 6 tháng.</li>
                      <li>
                        Tặng dây ZRC (trị giá 500.000 VNĐ) nếu dây hỏng trong 6 tháng (áp dụng cho đồng hồ từ 5.000.000
                        VNĐ trở lên).
                      </li>
                    </ul>

                    <u>
                      <strong>Lưu ý:</strong>
                    </u>
                    <p style={{ textAlign: "justify" }}>
                      - Chế độ bảo hành mở rộng đi kèm giấy bảo hành do Duy Anh cấp. Quý khách cần bảo quản và cung cấp
                      giấy tờ khi sử dụng ưu đãi. Duy Anh có quyền từ chối nếu thiếu giấy tờ.
                    </p>

                    <strong>KHÔNG BẢO HÀNH TRONG CÁC TRƯỜNG HỢP SAU:</strong>
                    <ul>
                      <li>Không bảo hành vỏ, mặt kính, dây, khóa đồng hồ (trừ lỗi kỹ thuật do nhà sản xuất).</li>
                      <li>
                        Không bảo hành hư hỏng do sử dụng sai cách như xông hơi, tắm nước nóng, tiếp xúc hóa chất,...
                      </li>
                      <li>
                        Không bảo hành nếu đồng hồ bị sửa chữa tại nơi không phải trung tâm bảo hành được chỉ định.
                      </li>
                      <li>Không bảo hành hư hỏng do thiên tai, tai nạn, cố tình gây hư hỏng,...</li>
                    </ul>
                  </div>
                </div>
              </blockquote>
            </div>
            {/* hướng dẫn sử dụng  */}
            <blockquote>
              <div
                id="prodetailsTab3"
                className={`${styles.prodetailsTab} ${selectedTab === "Hướng dẫn sử dụng" ? "" : styles.hide}`}
              >
                <div className={styles.tab}>
                  <button
                    className={`${styles.tablinks1} ${styles.tabBoder} ${styles.tabCachChinhDongHo} ${
                      activeTab === "tab-1" ? styles.active : ""
                    }`}
                    onClick={(e) => openTab(e, "tab-1")}
                  >
                    <span>Cách chỉnh đồng hồ</span>
                  </button>
                  <button
                    className={`${styles.tablinks1} ${styles.tabBoder} ${styles.tabHuongDanChonSize}
                     ${activeTab === "tab-2" ? styles.active : ""}`}
                    onClick={(e) => openTab(e, "tab-2")}
                  >
                    <span>Hướng dẫn chọn size</span>
                  </button>

                  <button
                    className={`${styles.tablinks1} ${styles.tabBoder} ${styles.tabMucDoChongNuocCuaDongHo}
                    ${activeTab === "tab-3" ? styles.active : ""}`}
                    onClick={(e) => openTab(e, "tab-3")}
                  >
                    <span>Mức độ chống nước của đồng hồ</span>
                  </button>
                  <button
                    className={`${styles.tablinks1} ${styles.tabBoder} ${styles.tabHuongDanVeSinhDongHo}
                    ${activeTab === "tab-4" ? styles.active : ""}`}
                    onClick={(e) => openTab(e, "tab-4")}
                  >
                    <span>Hướng dẫn vệ sinh đồng hồ</span>
                  </button>
                </div>

                {/* Cách chỉnh đồng hồ */}
                <div
                  id="tab-1"
                  className={`${styles.tabcontent1} ${styles.description} ${
                    activeTab === "tab-1" ? styles.activeTab : ""
                  }`}
                >
                  <p style={{ textAlign: "justify" }}>
                    <br />
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span> &nbsp; </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <div
                    className={styles.youtubeEmbedWrapper}
                    style={{
                      height: "0",
                      overflow: "hidden",
                      paddingBottom: "56.25%",
                      paddingTop: "30px",
                      position: "relative",
                    }}
                  >
                    <iframe
                      allow=";"
                      allowFullScreen
                      height="360"
                      src="https://www.youtube.com/embed/Fh_enTXmKXE"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                      }}
                      width="640"
                      data-loader="frame"
                    ></iframe>
                  </div>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            <img alt="" height="500" src="/image/item/detail-huongdansudung.jpg" width="850" />
                          </span>
                        </span>
                      </span>
                    </span>
                    <br />
                    &nbsp;
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            - Đối với đồng hồ có 2 kim (giờ/phút) và đồng hồ 3 kim (giờ/phút/giây): Bạn kéo nhẹ nút điều
                            chỉnh ra 1 nấc để chỉnh giờ phút.
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            - Đối với đồng hồ có 2 kim 1 lịch (giờ/phút/lịch ngày) và đồng hồ có 3 kim 1 lịch
                            (giờ/phút/giây/lịch ngày): có 2 nấc chỉnh, bạn kéo nhẹ nút điều chỉnh ra nấc đầu tiên để
                            chỉnh ngày (chỉ có thể chỉnh được 1 chiều, nếu cố vặn chiều còn lại có thể bị gãy lịch) và
                            kéo tiếp ra nấc thứ 2 để chỉnh giờ phút.
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <br />
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            - Đối với đồng hồ có 6 kim 1 lịch thì 3 nút điều chỉnh bên cạnh, tuy nhiên tùy vào máy của
                            đồng hồ để có cách chỉnh:
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <br />
                    <br />
                    &nbsp;
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            <strong>Đồng hồ có chức năng bấm giờ thể thao Chronograph:</strong>
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>&nbsp;</p>
                  <div
                    className={styles.youtubeEmbedWrapper}
                    style={{
                      height: "0",
                      overflow: "hidden",
                      paddingBottom: "56.25%",
                      paddingTop: "30px",
                      position: "relative",
                    }}
                  >
                    <iframe
                      allow=";"
                      allowFullScreen
                      frameBorder="0"
                      height="360"
                      src="https://www.youtube.com/embed/NKlH2f7yMFo?start=309"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                      }}
                      width="640"
                      data-loader="frame"
                    ></iframe>
                  </div>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>&nbsp;</span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <img
                      alt="chỉnh ngày giờ đồng hồ chronograph"
                      src="https://donghoduyanh.com/upload/images/chinh-ngay-gi-dong-ho-chronograph.jpg"
                    />
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            + Nút điều chỉnh nằm ở giữa có 2 nấc chỉnh, kéo nhẹ nấc đầu tiên ra để chỉnh ngày, tiếp đến
                            nấc thứ 2 để chỉnh giờ và phút.
                            <br />
                            <br />
                            + Nút trên cùng để cho chạy/dừng chức năng bấm giờ thể thao (chronograph).
                            <br />
                            <br />
                            + Khi nút trên đang dừng (chức năng bấm giờ chronograph đang dừng) bấm nút dưới để đưa 2 kim
                            về vị trí ban đầu số 12 giờ và đặt lại từ đầu.
                            <br />
                            <br />
                            <strong>Đồng hồ tự động (Automatic):</strong>
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <br />
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            Thông thường nút điểu chỉnh ở giữa kéo ra để chỉnh ngày và giờ.
                            <br />
                            &nbsp;
                            <br />
                            Lưu ý:
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            - Một số dòng đồng hồ cao cấp hay một số dòng đồng hồ có sử dụng gioăng cao su để chống vào
                            nước thì nút điều chỉnh không kéo ra ngay được mà phải xoay vặn (theo chiều ngược kim đồng
                            hồ) để mở nút điều chỉnh, sau đó mới kéo nhẹ ra các nấc cần điều chỉnh. Sau khi điều chỉnh
                            xong phải đóng nút điều chỉnh về vị trí ban đầu, ấn nút điều chỉnh vào đồng thời xoay vặn
                            (theo chiều kim đồng hồ) đóng chặt nút điều chỉnh để tránh nước bị thẩm thấu vào máy.
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>&nbsp;</span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <p style={{ textAlign: "justify" }}>&nbsp;</p>
                </div>

                {/* Hướng dẫn chọn size */}
                <div
                  id="tab-2"
                  className={`${styles.tabcontent1} ${styles.description} ${
                    activeTab === "tab-2" ? styles.activeTab : ""
                  }`}
                >
                  <div className={styles.youtubeEmbedWrapper}>
                    <iframe
                      className={styles.lazyif}
                      loading="lazy"
                      allow=";"
                      allowFullScreen
                      frameBorder="0"
                      src="https://www.youtube.com/embed/iOp24ZHG_bs"
                    ></iframe>
                  </div>
                  <div className={styles.youtubeEmbedWrapper}>
                    <iframe
                      className={styles.lazyif}
                      loading="lazy"
                      allow=";"
                      allowFullScreen
                      frameBorder="0"
                      src="https://www.youtube.com/embed/4ZBU53adfPY"
                    ></iframe>
                  </div>
                  <h2 dir="ltr">
                    <br />
                    <strong>I. Tìm kích thước cổ tay và lựa chọn đồng hồ phù hợp</strong>
                  </h2>
                  <p>
                    Trước khi có thể tìm được chiếc đồng hồ phù hợp với cổ tay, bạn cần biết kích thước cổ tay của mình.
                    Cổ tay của bạn mảnh, trung bình hay dày sẽ ảnh hưởng đến việc chiếc đồng hồ nào trông đẹp nhất đối
                    với bạn. Như vậy, việc đo kích thước cổ sẽ là một phần không thể thiếu trong việc chọn đồng hồ phù
                    hợp. Khi biết kích thước cổ tay của mình, bạn sẽ có thể chọn một chiếc đồng hồ hoàn hảo và thoải
                    mái. Biết kích thước cũng sẽ vô cùng hữu ích nếu bạn thích mua sắm trực tuyến vì bạn sẽ có thể mua
                    một kiểu đồng hồ vừa vặn mà không cần thử. Nó cũng có thể giúp bạn thu hẹp lựa chọn thiết kế sản
                    phẩm. Ví dụ, nếu cổ tay mảnh, bạn nên chọn một chiếc đồng hồ đeo tay tinh xảo, nếu cổ tay dày, đồng
                    hồ thể thao có thể là lựa chọn phù hợp hơn.
                  </p>
                  <h3 dir="ltr">1. Cách đo cổ tay của bạn</h3>
                  <ul>
                    <li dir="ltr">
                      <p>Lấy một thước dây hoặc một sợi dây để đo kích thước cổ tay.</p>
                    </li>
                    <li dir="ltr">
                      <p>
                        Để lòng bàn tay hướng lên, mở bàn tay của bạn ra (làm như vậy sẽ đảm bảo bạn có được kích thước
                        thật của cổ tay khi nó lớn nhất).
                      </p>
                    </li>
                    <li dir="ltr">
                      <p>
                        Quấn thước quanh cánh tay của bạn sao cho đó là vị trí mà dây đeo đồng hồ thường đeo ở đó đặt,
                        thường là ngay dưới xương cổ tay.
                      </p>
                    </li>
                    <li dir="ltr">
                      <p>
                        Nếu bạn đang sử dụng đoạn dây, hãy lấy bút và đánh dấu điểm mà đầu cuối gặp nhau sau đó đo lại
                        kích thước đoạn dây trên một cái thước phẳng
                      </p>
                    </li>
                  </ul>
                  <p className={styles.centered}>
                    <img
                      className="lazy after-lazy"
                      alt=""
                      height="412"
                      width="650"
                      src="/image/item/detail-hinh10.jpg"
                      style={{ opacity: 1, display: "none" }}
                    />
                  </p>
                  <p>&nbsp;</p>
                  <h3 dir="ltr">2. Cách lựa chọn đồng hồ phù hợp đối với nam:</h3>
                  <p>Sau khi đo chu vi tay, bạn sẽ quy ra được đường kính tối đa có thể đeo với công thức sau:</p>
                  <ul>
                    <li dir="ltr">
                      <p>
                        Đối với những đồng hồ có thiết kế đơn giản, sang trọng: (Chu vi/4) + 1 = chu vi mặt đồng hồ tối
                        đa có thể đeo.
                      </p>
                    </li>
                  </ul>
                  <p dir="ltr">
                    Ví dụ chu vi cổ tay là 16cm thì (16/4) + 1 = 41 (kích thước mặt đồng hồ tối đa có thể đeo là 41mm)
                  </p>
                  <ul>
                    <li dir="ltr">
                      <p>
                        Đối với những đồng hồ thể thao có nhiều kim: (Chu vi/4) + 4 = chu vi mặt đồng hồ tối đa có thể
                        đeo
                      </p>

                      <p>&nbsp;</p>
                    </li>
                  </ul>
                  <p dir="ltr">
                    Ví dụ chu vi cổ tay là 16cm thì (16/4) + 4 = 44 (kích thước mặt đồng hồ tối đa có thể đeo là 44mm)
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Ngoài ra cách đo mặt phẳng tay Lug to Lug thường là chuẩn nhất (không phải đường kính mặt mà là
                    khoảng cách giữa 2 càng gắn dây của đồng hồ). Với đồng hồ nam thì không để vấu thừa ra ngoài mặt
                    phẳng cổ tay. Theo đó bạn có thể căn cứ vào bảng size dưới đây:
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <img
                      className="lazy after-lazy"
                      alt=""
                      height="637"
                      width="650"
                      src="/image/item/detail-hinh11.jpg"
                      style={{ opacity: 1 }}
                    />
                  </p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>
                    <img
                      className="lazy after-lazy"
                      alt="vấu để vấu"
                      height="377"
                      width="650"
                      src="/image/item/detail-hinh12.jpg"
                      style={{ opacity: 1 }}
                    />
                  </p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Inch</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Centimet</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Kích thước vỏ đồng hồ</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Khoảng cách Lug to Lug</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>5,50 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>14,0 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 27,9 đến 34,9 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 34,9 đến 43,7 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>5,75 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>14,6 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 29,2 đến 36,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 36,5 đến 45,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>6,00 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>15,2 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 30,5 đến 38,1 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 38,1 đến 47,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>6,25 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>15,9 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 31,8 đến 39,7 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 39,7 đến 49,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>6,50 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>16,5 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 33,0 đến 41,3 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 41,3 đến 51,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>6,75 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>17,1 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 34,3 đến 42,9 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 42,9 đến 53,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>7,00 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>17,8 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 35,6 đến 44,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 44,5 đến 55,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>7,25 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>18,4 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 36,8 đến 46,0 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 46 đến 57,5 ​​mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>7,50 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>19,1 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 38,1 đến 47,6 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 47,6 đến 59,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>7,75 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>19,7 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 39,4 đến 49,2 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 49,2 đến 61,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>8,00 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>20,3 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 40,6 đến 50,8 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 50,8 đến 63,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>8,25 ”</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>21,0 cm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 41,9 đến 52,4 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                        <td>
                          <p>&nbsp;</p>

                          <p>&nbsp;</p>

                          <p dir="ltr">
                            <strong>Từ 52,4 đến 65,5 mm</strong>
                          </p>

                          <p>&nbsp;</p>

                          <p>&nbsp;</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>&nbsp;</p>
                  <p dir="ltr">Ví dụ: kích thước đồng hồ hoàn hảo cho cổ tay 15,2 cm sẽ là 38,1 đến 47,6 mm.</p>

                  <p dir="ltr">
                    Lưu ý rằng hiện tại các hãng chưa cung cấp thông tin thông số Lug to Lug nhiều nên chủ yếu vẫn phải
                    dùng công thức đo chu vi tay.
                  </p>
                  <p>&nbsp;</p>
                  <p dir="ltr">
                    Ngoài ra khi đo kích thước cổ tay bạn cần đo chính xác, không áng chừng vì sai số lớn và cách này
                    không áp dụng cho dòng Casio G-Shock vì thiết kế ngoại cỡ đặc trưng của chúng.
                  </p>
                  <p>&nbsp;</p>
                  <h3 dir="ltr">3. Cách lựa chọn đồng hồ phù hợp đối với nữ:</h3>
                  <p>&nbsp;</p>
                  <p dir="ltr">
                    Đối với đồng hồ nữ thì không dùng công thức trên mà có chuẩn chung: đường kính 28 - 31 là trung
                    bình, trên 31 cm là size lớn, dưới 28 cm là size nhỏ.
                  </p>
                  <p>&nbsp;</p>
                  <h2 dir="ltr">
                    <strong>II. Một số tiêu chí lựa chọn đồng hồ phù hợp với tay</strong>
                  </h2>
                  <p>&nbsp;</p>
                  <p dir="ltr">
                    Khi nói đến việc chọn một chiếc đồng hồ, điều quan trọng cần lưu ý là một kích thước không phù hợp
                    với tất cả mọi người. Do đó, khi mua đồng hồ, bạn cần biết cách chọn đồng hồ phù hợp với cổ tay của
                    mình. Mặc dù không có quy tắc tính toán cho kích thước hoặc hình dạng hoàn hảo cho khung tay của
                    bạn, nhưng có những mẹo mà bạn có thể làm theo để có được một chiếc đồng hồ cân đối và tương xứng.
                  </p>
                  <p dir="ltr">
                    Đồng hồ vừa vặn với cổ tay không chỉ bao gồm vỏ đồng hồ mà còn bao gồm cả dây đeo. Đồng hồ đeo tay
                    của bạn quá chật nếu nó để lại dấu hằn trên da, còn nếu đồng hồ quá lỏng nó sẽ dễ bị lệch khỏi vị
                    trí gây nên sự bất tiện. Đối với người mới dùng, đồng hồ của bạn phải cảm thấy thoải mái trên cổ tay
                    và phải vừa đủ chặt để ngăn đồng hồ theo chiều dọc cổ tay trong quá trình chuyển động nhưng đủ lỏng
                    để không hằn vào da của bạn.&nbsp;
                  </p>
                  <p dir="ltr">
                    Đối với vị trí trên cổ tay, bạn không nên đeo đồng hồ của mình quá thấp. Thông thường, bạn nên đeo
                    nó ở đầu của xương trụ (phần xương trên cổ tay của bạn nhô ra ngoài). Nếu bạn đeo đồng hồ của mình
                    vào phần xương đó, bạn có thể sẽ cảm thấy hơi khó chịu.
                  </p>
                  <p>&nbsp;</p>
                  <p dir="ltr">
                    Hầu hết mọi người thường đeo đồng hồ trên tay đối diện với tay thuận của họ. Điều này có nghĩa là
                    nếu bạn thuận tay phải, bạn sẽ đeo đồng hồ trên cổ tay trái. Hầu hết các nhà sản xuất đồng hồ thiết
                    kế đồng hồ cho cổ tay trái vì phần lớn mọi người thuận tay phải. Lưu ý rằng núm chỉnh đồng hồ thường
                    nằm ở phía bên phải của vỏ vì thế đối với những người thuận tay phải, điều này dễ dàng lên dây cót
                    hoặc sử dụng chronograph khi đang di chuyển. Tuy nhiên, nếu bạn là người thuận tay trái thì bạn cần
                    lưu ý điều này.
                  </p>
                  <p>
                    <img
                      className="lazy after-lazy"
                      alt=""
                      height="366"
                      width="650"
                      src="https://donghoduyanh.com/upload/images/T087_407_55_067_00.png"
                      style={{ opacity: 1, display: "none" }}
                    />
                  </p>

                  <p>&nbsp;</p>
                  <p dir="ltr">
                    <strong>
                      Hãy nhớ rằng không có công thức hoàn hảo nào khi nói về kích thước một chiếc đồng hồ có thể vừa
                      vặn trên cổ tay của bạn. Tuy nhiên, với những lời khuyên trên và các chi tiết quan trọng cần nhớ,
                      có thể đảm bảo rằng bạn sẽ tìm ra chiếc đồng hồ đeo tay tốt nhất mà bạn đang tìm kiếm!
                    </strong>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>Bước 1</strong>:&nbsp;<strong>Đo “size tay” của bạn (Chu vi cổ tay)</strong>
                  </p>
                  <p>
                    <em>Để đo chu vi cổ tay bạn chỉ cần thực hiện theo một số cách đơn giản như sau:</em>
                  </p>
                  <p>&nbsp;</p>
                  <ul>
                    <li>
                      Cách 1: Dùng thước dây đo 1 vòng quanh cổ tay, bạn lưu ý là đo ở vị trí mà bạn đeo đồng hồ ấy nha.
                    </li>
                    <li>
                      Cách 2: Trường hợp bạn không có thước dây thì bạn có thể dùng một tờ giấy quấn quanh cổ tay, sau
                      đó hãy đo lại bằng thước kẻ tay thông thường.
                    </li>
                  </ul>
                  <p>&nbsp;</p>
                  <p>
                    <strong>Bước 2</strong>:&nbsp;&nbsp;
                    <strong>Tra bảng cách chọn Size đồng hồ đeo tay ở bên dưới (áp dụng cho nam và nữ luôn nhé)</strong>
                  </p>
                  <p>
                    Sau khi biết được chu vi cổ tay rồi bạn hãy dùng nó để đối chiếu với bảng bên dưới xem với số đo như
                    thế ta nên chọn Size đồng hồ nào là tối ưu nhất nhé.
                  </p>
                </div>

                {/* Mức độ chống nước của đồng hồ */}
                <div
                  id="tab-3"
                  className={`${styles.tabcontent1} ${styles.description} ${
                    activeTab === "tab-3" ? styles.activeTab : ""
                  }`}
                >
                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>MỨC ĐỘ CHỊU NƯỚC CỦA ĐỒNG HỒ</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - <strong>Độ</strong> <strong>chịu</strong> <strong>nước</strong> <strong>30</strong>
                          <strong>mét(3BAR</strong>, <strong>3ATM)</strong>:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>+ Có thể đeo đồng hồ khi rửa&nbsp;tay hoặc đi mưa nhẹ</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - <strong>Độ</strong> <strong>chịu</strong> <strong>nước</strong> <strong>50</strong>
                          <strong>mét(5BAR</strong>, <strong>5ATM)</strong>:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          + Có thể đeo đồng hồ khi đi mưa, rửa tay ở mức áp lực nước lớn hơn so với mức 30 mét(3BAR,
                          3ATM).
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - <strong>Độ chiụ nước 100 mét(10BAR</strong>, <strong>10ATM)</strong>:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          + Có thể đeo đồng hồ khi đi mưa lớn, rửa tay dưới vòi nước có áp lực nước lớn, đi bơi, lướt
                          sóng hoặc kết hợp một số môn thể thao dưới nước nhẹ nhàng.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - <strong>Độ</strong> <strong>chịu</strong> <strong>nước</strong> <strong>200</strong>
                          <strong>mét(20BAR</strong>, <strong>20ATM)</strong>:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          + Có thể đeo đồng hồ khi đi mưa, rửa tay, bơi, lướt sóng, tham gia các môn thể thao dưới nước,
                          lặn bằng ống thở.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - <strong>Độ</strong> <strong>chịu</strong> <strong>nước</strong> <strong>trên</strong>
                          <strong>200</strong> <strong>mét(20BAR</strong>, <strong>20ATM)</strong>:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          + Có thể đeo đồng hồ khi đi mưa, rửa tay, bơi, lướt sóng, tham gia các môn thể thao dưới nước,
                          lặn sâu bằng bình dưỡng khí.
                          <br />- Lưu ý:
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          + Phải luôn đóng chặt núm đồng hồ trong mọi hoàn cảnh nhằm tránh đồng hồ bị vào nước.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>+ Tuyệt đối không đeo đồng hồ khi dùng nước nóng, tắm nóng lạnh hoặc xông hơi.</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>+ Không sử dụng đồng hồ vượt quá mức độ chịu nước của nó.</span>
                      </span>
                    </span>
                    <br />
                    <br />
                    &nbsp;
                  </p>
                </div>

                {/* Hướng dẫn vệ sinh đồng hồ */}
                <div
                  id="tab-4"
                  className={`${styles.tabcontent1} ${styles.description} ${
                    activeTab === "tab-4" ? styles.activeTab : ""
                  }`}
                >
                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>HƯỚNG DẪN VỆ SINH ĐỒNG HỒ</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>1. Vật dụng cần chuẩn bị:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>- Nước ấm, dung dịch xà phòng loãng hoặc dung dịch tẩy rửa nhẹ</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>- Khăn vi sợi mềm, mỏng</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>- Bàn chải lông mềm</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>2. Quy trình chung vệ sinh đồng hồ</strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - Tháo dây đeo ra khỏi mặt đồng hồ. Nếu như dây đeo đồng hồ của bạn là dây không tháo rời, hãy
                          luôn chú ý khi vệ sinh chúng.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>- Vệ sinh nhẹ nhàng phần dây đeo và mặt đồng hồ.</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>- Để khô tự nhiên trước khi đeo lại vào tay.</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>3. Vệ sinh dây đồng hồ</strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>
                            <em>+ Với đồng hồ dây kim loại:</em>
                          </strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 1</em>: Ngâm dây đồng hồ vào dung dịch nước ấm pha một ít xà phòng trong khoảng 3-5
                          phút
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước </em>2: Sử dụng bàn chải lông mềm để làm sạch nốt những vết bẩn còn sót lại
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 3</em>: Lau lại bằng nước sạch rồi để khô tự nhiên.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          Ngoài ra, bạn có thể sử dụng kem đánh răng hay dung dịch dấm với nước để làm sạch và giúp dây
                          sáng bóng hơn.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>
                            <em>+ Với đồng hồ dây da:</em>
                          </strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 1</em>: Dùng khăn mềm hơi ẩm lau nhẹ phần bề mặt của dây da.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 2</em>: Thấm một ít dung dịch có tính tẩy rửa nhẹ hoặc dầu ô liu lên bề mặt dây và sử
                          dụng bàn chải lông mềm để làm sạch dây.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 3</em>: Lau sạch chúng bằng một chiếc khăn ẩm.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>Lưu ý: </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>Không ngâm dây da trong nước vì có thể làm dây bị ẩm, mốc và nhanh hỏng.</span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          Không sử dụng máy sấy đề làm khô, điều này dẫn đến hiện tượng dây bị co cứng lại không giữ
                          được sự thoải mái khi đeo như ban đầu.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>
                            <em>+ Với đồng hồ dây vải:</em>
                          </strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 1</em>: Sử dụng dung dịch xà phòng loãng hoặc dung dịch tẩy rửa nhẹ để làm sạch dây
                          vải rồi dùng nước sạch để làm tan hết xà phòng.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 2</em>: Phơi dây ra nơi thoáng mát để chúng khô hoàn toàn trước khi đeo lại.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <strong>
                            <em>+ Với đồng hồ dây cao su</em>
                          </strong>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 1</em>: Dùng khăn mềm sạch, nhúng ẩm vào trong dung dịch xà phòng loãng hay dung dịch
                          có tính tẩy rửa nhẹ rồi dùng để lau bề mặt dây. Đối với các vết bẩn “cứng đầu” hơn, bạn có thể
                          để một lát rồi dùng bàn chải lông mềm để làm sạch.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Bước 2</em>: Sử dụng khăn mềm để lau sạch xà phòng. Đối với các mẫu dây đeo này, bạn nên
                          chú ý chất tẩy rửa mình sử dụng, hãy luôn chắc chắn về việc chúng không làm mất màu dây đeo
                          của bạn.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <em>Một số lưu ý khi vệ sinh đồng hồ:</em>
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - Do quá trình vệ sinh luôn gắn liền với nước hoặc một số các loại dung dịch khác nên hãy luôn
                          cẩn thận để tránh việc nước vào bộ máy làm hỏng đồng hồ
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - Luôn thử các loại dung dịch tẩy rửa ở một phần nhỏ của dây đeo để tránh hiện tượng chúng làm
                          đổi màu dây, …
                        </span>
                      </span>
                    </span>
                  </p>

                  <p>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          - Nếu đeo đồng hồ vào thời tiết oi bức, nắng nóng thì nên nới lỏng dây đeo và thường xuyên lau
                          đồng hồ bằng khăn mềm để trách việc bụi bẩn tích tụ lâu ngày.
                        </span>
                      </span>
                    </span>
                  </p>

                  <p style={{ textAlign: "justify" }}>
                    <span style={{ fontSize: "13pt" }}>
                      <span>
                        <span>
                          <span>
                            Ngoài dây đeo, phần vỏ đồng hồ cũng như mặt kính cũng nên được vệ sinh thường xuyên. Trong
                            khi đợi các dây đeo khô, bạn dùng khăn ẩm thấm nước ấm lau nhẹ nhàng mặt kính cũng như vỏ
                            đồng hồ.
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </blockquote>
          </div>
        </div>

        <div className="lg:mx-0 lg:float-right lg:w-auto md:w-full sm:w-full md:float-left mt-[30px] mb-[50px] ">
          <div className="bg-[#796752] md: text-white p-[20px_10px_17px] text-[18px] uppercase text-center">
            Chứng nhận chính hãng
          </div>
          <div className="p-[40px] bg-[#f1f1f1cc] text-center">
            <img
              className=" lg:w-[200px] lg:h-[300px] md:w-[335px] md:h-[470px] sm:w-[335px] sm:h-[470px] "
              alt="Chứng nhận chính hãng"
              src="https://donghoduyanh.com/images/certification/large/tissot-author5_1576645138.jpg"
              srcSet="https://donghoduyanh.com/images/certification/large/tissot-author5_1576645138.jpg.webp"
            />
          </div>
        </div>
      </div>
      <div className="clear-both"></div>

      {/* mô tả chi tiết */}
      <div class="clear-both"></div>

      {/* sản phẩm liên quan */}
      <div className={`${styles.relatedProducts} container`}>
        <div className="mb-0 text-center leading-[25px]">
          <span className="text-[22px] uppercase bg-[#796752] text-white py-[10px] px-[34px] pb-[8px]">
            Sản phẩm liên quan
          </span>
        </div>
        <div className={`${styles.productsBlocksWrapper}`}>
          <div
            className={` ${styles.productsBlocksSlideshowHot} relative clear-both bg-white mb-5 h-[470[px] overflow-hidden ${styles.owlCarousel}  `}
            id="products-blocks-slideshow-hot-1"
          >
            <div className={`${styles.owlStageOuter} relative`}>
              <div className={`${styles.owlStage} relative`}>
                {/* item1 */}

                <Slider ref={sliderRef} {...settings}>
                  {related.map((item) => {
                    const { _id, ten, ten_san_pham, ma_san_pham, loai, duong_kinh, hinh_anh, gia_san_pham, gia_giam } =
                      item;

                    return (
                      <div
                        className={`relative ${styles.active}`}
                        style={{ width: "226px", marginRight: "10px" }}
                        key={_id}
                      >
                        <div className={styles.item}>
                          <div className={styles.frameInner}>
                            <figure className="relative">
                              <Link href={`/components/product-detail/${_id}`} title={ten}>
                                <img
                                  className={`${styles.owlLazy} ${styles.afterLazy}`}
                                  alt={ten}
                                  width="300"
                                  height="363"
                                  style={{ display: "block", opacity: 1 }}
                                  src={`http://localhost:5000/images/${hinh_anh}`}
                                />
                              </Link>
                            </figure>

                            <h2>
                              <Link href="#" title={ten} className={styles.name}>
                                <span className={styles.catName}>{ten_san_pham}</span>
                                {ma_san_pham}
                              </Link>
                            </h2>

                            <span className={styles.loaiMay}>{loai}</span>
                            <span className={styles.rowLm}> | </span>
                            <span className={styles.duongKinh}>{duong_kinh}</span>

                            <div className={styles.priceArae}>
                              {gia_giam > 0 ? (
                                <>
                                  <div className={styles.priceOld}>
                                    Giá: <span>{gia_san_pham.toLocaleString("vi-VN")}₫</span>
                                  </div>
                                  <div className={styles.priceCurrent}>Giá KM: {gia_giam.toLocaleString("vi-VN")}₫</div>
                                </>
                              ) : (
                                <div className={styles.priceCurrent}>Giá: {gia_san_pham.toLocaleString("vi-VN")}₫</div>
                              )}
                            </div>
                            {gia_giam > 0 && (
                              <div className={styles.discount}>
                                <span>
                                  -{roundDiscount(Math.round(((gia_san_pham - gia_giam) / gia_san_pham) * 100))}%
                                </span>
                              </div>
                            )}

                            <br />
                            <br />
                            <div className="clear-both"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
            <div className={styles.owlControls}>
              <div className={styles.owlNav}>
                <div className={styles.owlPrev} onClick={() => sliderRef.current.slickPrev()}>
                  ‹
                </div>

                <div className={styles.owlNext} onClick={() => sliderRef.current.slickNext()}>
                  ›
                </div>
              </div>
              <div className={styles.owlDots} style={{ display: "none" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Đánh giá bình luận */}
      <div id="comments" className="container mx-auto px-4 py-4">
      <div className="pb-1 text-[23px] relative">
        <span>Đánh giá - Bình luận</span>
      </div>
      <div className="comments">
        <div className="mb-[15px] mt-[11px]">
          <span>
            Có <strong>{comments.length}</strong> bình luận, đánh giá
          </span>
          <strong> về {product.ten}</strong>
        </div>
        <form
          name="comment-add-form"
          id="comment-add-form"
          className="formComment"
          onSubmit={(e) => {
            e.preventDefault();
            addComment();
          }}
        >
          <label className="labelForm block font-semibold text-sm mb-4">Nhận xét và đánh giá</label>
    
          <div className="textarea mb-4">
            <textarea
              name="content"
              id="cmt-content"
              placeholder="Viết bình luận của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md min-h-[123px] resize-none text-sm text-gray-700"
            ></textarea>
          </div>
    
          <input
            type="submit"
            className="bg-[#796752] text-white px-6 py-2 rounded transition duration-300 hover:bg-[#5a4a3d] cursor-pointer"
            value="Gửi bình luận"
          />
    
          <div className="mt-6 bg-white p-4 border-2 border-gray-200 rounded-lg">
            {Array.isArray(comments) && comments.length > 0 ? (
              <>
                {comments.map((comment, index) => (
                  <div key={index} className="comment flex items-start py-4 border-b border-gray-200 mb-6">
                    <div className="profile mr-4">
                      <img
                        src={`http://localhost:5000/images/${comment.user?.hinh_anh}`}
                        alt="Profile Picture"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className=" flex items-center text-sm text-gray-600 mb-2">
                        <span className="name font-bold">{comment.user?.ten_dang_nhap}</span>
                        <span className="date ml-4 text-gray-400">
                          {new Intl.DateTimeFormat("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(new Date(comment.ngay_binh_luan))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 bg-white p-4 border-[1px] border-gray-200 rounded-lg">
                        {comment.noi_dung}
                      </p>
    
                      {/* Hiển thị câu trả lời nếu có */}
                      
                      {comment.tra_loi_binh_luan && comment.tra_loi_binh_luan.trim() !== "" && (
                        <div className=" ml-9 reply mt-4 bg-gray-100 p-4 border-[1px] border-gray-200 rounded-lg">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span className="name font-bold">{comment.traloi_user?.ten_dang_nhap}</span>
                            <span className="date ml-4 text-gray-400">
                              {comment.ngay_tra_loi && !isNaN(new Date(comment.ngay_tra_loi).getTime()) ? (
                                new Intl.DateTimeFormat("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }).format(new Date(comment.ngay_tra_loi))
                              ) : (
                                "Ngày không hợp lệ"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.tra_loi_binh_luan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
    
                <div className="pagination flex justify-center items-center mt-6">
                  <span
                    title="First page"
                    className={`cursor-pointer px-4 py-2 border rounded-md ${
                      currentPage === 1 ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
                    }`}
                    onClick={() => currentPage > 1 && handlePageChange(1)}
                  >
                    ‹‹
                  </span>
    
                  <span
                    className={`cursor-pointer px-4 py-2 border rounded-md ${
                      currentPage === 1 ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
                    }`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </span>
    
                  <span className="currentPage px-4 py-2">{`Trang ${currentPage} / ${totalPages || 1}`}</span>
    
                  <span
                    className={`cursor-pointer px-4 py-2 border rounded-md ${
                      currentPage === totalPages ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
                    }`}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  >
                    ›
                  </span>
    
                  <span
                    className={`cursor-pointer px-4 py-2 border rounded-md ${
                      currentPage === totalPages ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
                    }`}
                    onClick={() => currentPage < totalPages && handlePageChange(totalPages)}
                  >
                    ››
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Mời bạn nhận xét về sản phẩm, hãy bình luận có văn hoá để tránh bị khoá tài khoản.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
    

    
    </>
  );
}
