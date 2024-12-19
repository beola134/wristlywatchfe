"use client";
import { useEffect, useState } from "react";
import styles from "./thanhtoan.module.css";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import Link from "next/link";

export default function ThanhToan() {
  const [user, setUser] = useState({
    dia_chi: "",
    dien_thoai: "",
    ho_ten: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState(""); // Loại giảm giá (phần trăm hoặc số tiền)
  const [isDiscountApplied, setIsDiscountApplied] = useState(false); // Kiểm tra mã giảm giá đã được áp dụng chưa
  const [note, setNote] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Dùng để kiểm tra trạng thái nhập liệu

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      try {
        const { _id } = jwtDecode(token);
        fetchUserDetails(_id);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // Lấy thông tin người dùng từ server
  const fetchUserDetails = async (_id) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${_id}`);
      if (!response.ok) {
        throw new Error("Lỗi lấy thông tin người dùng");
      }
      const data = await response.json();
      setUser(data.user);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy thông tin giỏ hàng từ localStorage
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      so_luong: item.so_luong ?? 1,
    }));
    setCartItems(cartItems);
    calculateTotal(updatedCartItems);
  }, []);
  // Tính tổng tiền
  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.so_luong * (item.gia_giam > 0 ? item.gia_giam : item.gia_san_pham),
      0
    );
    setTotalAmount(total);
  };
  const amount = Math.round(
    totalAmount -
      (discountType === "phan_tram" ? (totalAmount * discountValue) / 100 : discountValue) +
      (totalAmount < 1000000 ? 30000 : 0)
  );

  // Tăng giảm số lượng sản phẩm
  const handleIncrease = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].so_luong += 1;
    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleDecrease = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].so_luong > 1) {
      updatedCartItems[index].so_luong -= 1;
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };
  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (index) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      text: "Thao tác này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        // Thực hiện xóa sản phẩm
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        calculateTotal(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đã xóa!",
          text: "Sản phẩm đã được xóa khỏi giỏ hàng.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };

  // Tạo đơn hàng và kiểm tra xem có đăng nhập không
  const userLogin = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng đăng nhập để tiếp tục thanh toán",
      }).then(() => {
        window.location.href = "/components/login?redirect=thanhtoan";
      });
      return false;
    }
    return true;
  };

  // Áp dụng mã giảm giá
  const applyDiscount = async () => {
    if (isDiscountApplied) return;
    if (!discountCode || totalAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập mã giảm giá hợp lệ và kiểm tra giá trị đơn hàng.",
      });
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/voucher/ma_voucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ma_voucher: discountCode, orderTotal: totalAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Mã giảm giá không hợp lệ");
      }

      const data = await response.json();
      if (data.gia_tri) {
        setDiscountValue(data.gia_tri);
        setDiscountType("gia_tri");
      } else if (data.phan_tram) {
        setDiscountValue(data.phan_tram);
        setDiscountType("phan_tram");
      }

      calculateTotal(cartItems);
      setIsDiscountApplied(true);
      toast.success("Mã giảm giá áp dụng thành công!");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message,
      });
      console.log(error);
    }
  };

  // Kiểm tra xem sản phẩm còn hàng không
  const ktra = async () => {
    for (const items of cartItems) {
      const reponse = await fetch(`http://localhost:5000/product/check/${items._id}?quantity=${items.so_luong}`);
      if (!reponse.ok) {
        Swal.fire({
          title: "Không đủ hàng",
          text: `Sản phẩm: ${items.ten_san_pham} Không đủ số lượng`,
          icon: "error",
          confirmButtonText: "OK",
        });
        return false;
      }
    }
    return true;
  };

  // Kiểm tra thông tin người dùng
  const validateFields = () => {
    // Kiểm tra thông tin điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!user.dien_thoai || !phoneRegex.test(user.dien_thoai)) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ.");
      return false;
    }

    // Kiểm tra thông tin họ và tên
    if (!user.ho_ten) {
      toast.error("Vui lòng nhập họ và tên.");
      return false;
    }

    // Kiểm tra thông tin địa chỉ
    if (!user.dia_chi) {
      toast.error("Vui lòng nhập địa chỉ giao hàng.");
      return false;
    }

    // Kiểm tra phương thức thanh toán
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      return false;
    }

    return true; // Tất cả trường hợp hợp lệ
  };

  // Xử lý khi người dùng click vào nút thanh toán
  const handleClick = async () => {
    // Lấy token từ cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      // Nếu không có token, yêu cầu người dùng đăng nhập
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng đăng nhập để tiếp tục thanh toán",
      }).then(() => {
        window.location.href = "/components/components-login/login?redirect=thanhtoan";
      });
      return;
    }

    // Kiểm tra tính hợp lệ của các trường thông tin
    const isValid = validateFields();
    if (!isValid) return;

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const isLoggedIn = await userLogin();
    if (!isLoggedIn) return;

    // Kiểm tra xem sản phẩm còn hàng không
    const isStockAvailable = await ktra();
    if (!isStockAvailable) return;

    const orderDetails = {
      dia_chi: user.dia_chi,
      id_nguoi_dung: user._id,
      id_phuong_thuc_thanh_toan: selectedPaymentMethod,
      ghi_chu: note,
      chi_tiet_don_hang: cartItems.map((item) => ({
        id_san_pham: item._id,
        so_luong: item.so_luong,
      })),
      ma_voucher: discountCode || null,
      user: {
        ho_ten: user.ho_ten,
        dia_chi: user.dia_chi,
        dien_thoai: user.dien_thoai,
      },
    };
    // In ra thông tin đơn hàng
    console.log(orderDetails);

    // Xác nhận đặt hàng trước khi tiếp tục
    Swal.fire({
      title: "Bạn có chắc chắn muốn đặt hàng không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Xử lý thanh toán qua ZaloPay
        if (selectedPaymentMethod === "3") {
          try {
            const paymentResponse = await axios.post("http://localhost:5000/pttt/zalo", {
              amount: amount,
              orderDetails,
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (paymentResponse.data.return_code === 1) {
              localStorage.setItem("cartItems", JSON.stringify([]));
              setCartItems([]);
              window.location.href = paymentResponse.data.order_url; // Chuyển hướng đến ZaloPay
            } else {
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Thanh toán qua ZaloPay không thành công",
              });
            }
          } catch (error) {
            console.error("Error during payment:", error.message || error);
            if (error.response) {
              console.error("Response Data:", error.response.data);
              console.error("Response Status:", error.response.status);
            }
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Lỗi trong quá trình thanh toán",
            });
          }
        } else {
          // Xử lý thanh toán qua các phương thức khác
          try {
            const response = await fetch("http://localhost:5000/donhang/donhang", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
              throw new Error("Lỗi tạo đơn hàng");
            }

            const data = await response.json();
            console.log(data);

            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: data.message,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/"; // Điều hướng về trang chủ sau khi thành công
              }
            });

            // Xóa giỏ hàng sau khi tạo đơn thành công
            localStorage.setItem("cartItems", JSON.stringify([]));
            setCartItems([]);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Lỗi tạo đơn hàng",
            });
          }
        }
      }
    });
  };

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
            <Link href="/components/components-giaodich/giohang" className={cx("link", "text-gray-800")}>
             Giỏ hàng
            </Link>
          </span>
          <span className={cx("separator", "mx-3", "text-stone-400")}>&gt;</span>
          <span className={cx("")}>
            <Link href="/components/components-giaodich/thanhtoan" className={cx("link", "text-red-500")}>
             Thanh toán
            </Link>
          </span>
        </div>
      </div>

      <div className="container">
        <div className={`${styles.checkoutContainer} flex flex-wrap justify-between`}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className={`${styles.checkoutLeft} flex-[2] w-full lg:w-[70%] sm:w-full md:w-full `}>
            <div className={`${styles.box} ${styles.customerInfo}`}>
              <p className={styles.productTitle}>Thông tin khách hàng</p>
              <div className={`${styles.inputGroup} flex justify-between`}>
                <input type="email" placeholder="Email" value={user.email} readOnly />
                <input
                  type="text"
                  placeholder="Điện thoại"
                  value={user.dien_thoai || ""}
                  onChange={(e) => {
                    setIsEditing(true);
                    setUser((prevUser) => ({
                      ...prevUser,
                      dien_thoai: e.target.value,
                    }));
                  }}
                  readOnly={!isEditing && user.dien_thoai}
                />
              </div>
            </div>

            <div className={`${styles.box} ${styles.shippingPaymentInfo}`}>
              <p className={styles.productTitle}>Địa chỉ giao hàng</p>
              <input
                className="block"
                type="text"
                placeholder="Họ và tên"
                value={user.ho_ten || ""}
                onChange={(e) => {
                  setIsEditing(true);
                  setUser((prevUser) => ({
                    ...prevUser,
                    ho_ten: e.target.value,
                  }));
                }}
                readOnly={!isEditing && user.ho_ten}
              />

              <input
                className="block"
                type="text"
                placeholder="Địa chỉ"
                value={user.dia_chi}
                onChange={(e) => {
                  setIsEditing(true);
                  setUser((prevUser) => ({
                    ...prevUser,
                    dia_chi: e.target.value,
                  }));
                }}
                readOnly={!isEditing && user.dia_chi}
              />

              <textarea
                className={`${styles.textarea} block`}
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>

              {/* phương thức thanh toán  */}
              <div className={`${styles.paymentMethods}`}>
                <p className={styles.productTitle}>Phương thức thanh toán</p>
                <select
                  as="select"
                  name="phuong_thuc_thanh_toan"
                  className={`${styles.paymentSelect} w-auto lg:w-full sm:text-[14px] `}
                  value={selectedPaymentMethod || ""}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="" className={`${styles.paymentOption} flex items-center `} disabled>
                    Chọn phương thức thanh toán
                  </option>
                  <option value={1} className={`${styles.paymentOption} flex items-center`}>
                    Thanh toán khi nhận hàng
                  </option>

                  <option value={3} className={`${styles.paymentOption} flex items-center`}>
                    Thanh toán bằng ZaloPay
                  </option>
                </select>
              </div>
            </div>

            {/* product */}
            {cartItems.map((item, index) => (
              <div className={`${styles.box} ${styles.productCard} flex flex-wrap items-center `} key={item._id}>
                <div className="flex w-full md:w-auto">
                  <div className={styles.productLeft}>
                    <p className={styles.productTitle}>Sản phẩm</p>
                    <div className="w-20 h-auto">
                      <img src={`http://localhost:5000/images/${item.hinh_anh}`} alt={item.ten_san_pham} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between w-full md:w-auto mt-3">
                    <p className={styles.productName}>Tên sản phẩm: {item.ten_san_pham}</p>
                    <p className={styles.productModel}>Loại máy: {item.loai}</p>
                    <p className={styles.productCode}>Mã sản phẩm: {item.ma_san_pham}</p>
                    <p className={styles.productSize}>Đường kính: {item.duong_kinh}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end w-full md:w-auto">
                  <div className="flex items-center justify-end mb-2.5 ml-5">
                    <div className="flex items-center mr-5">
                      <button onClick={() => handleDecrease(index)} className={styles.quantityBtn}>
                        -
                      </button>
                      <input type="text" value={item.so_luong} readOnly className={styles.quantityInput} />
                      <button onClick={() => handleIncrease(index)} className={styles.quantityBtn}>
                        +
                      </button>
                    </div>
                    <p className={styles.productPrice}>
                      {(item.gia_giam > 0 ? item.gia_giam : item.gia_san_pham).toLocaleString("vi-VN")}₫
                    </p>
                    <button onClick={() => handleDelete(index)} className={`${styles.deleteBtn} ml-5 mb-2`}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{
                          fontSize: "18px",
                          border: "none",
                          color: "red",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* tổng thanh toán */}
          <div className={`${styles.cartSummary} w-full lg:w-[30%] sm:w-full md:w-full`}>
            <div className={`${styles.discountCode} `}>
              <input
                className="w-[70%] sm:w-full md:w-[87%] lg:w-[203px]"
                type="text"
                placeholder="Nhập mã..."
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount} disabled={isDiscountApplied} className="float-end">
                Áp dụng
              </button>
              <hr />
            </div>
            <div className={styles.orderSummary}>
              <p className="flex justify-between">
                Tổng tiền hàng:
                <span className={styles.price}>
                  {cartItems
                    .reduce(
                      (sum, item) => sum + item.so_luong * (item.gia_giam > 0 ? item.gia_giam : item.gia_san_pham),
                      0
                    )
                    .toLocaleString("vi-VN")}
                  ₫
                </span>
              </p>
              <p className="flex justify-between">
                Ưu đãi:
                <span className={styles.price}>
                  {discountType === "phan_tram" ? `-${discountValue}%` : `-${discountValue.toLocaleString("vi-VN")}₫`}
                </span>
              </p>

              <p className="flex justify-between">
                Phí vận chuyển:
                <span className={styles.price}>{totalAmount > 1000000 ? "Miễn phí" : "30.000₫"}</span>
              </p>
              <p className={`${styles.totalAmount} flex justify-between`}>
                Tổng thanh toán:
                <span className={styles.price}>
                  {(
                    totalAmount -
                    (discountType === "phan_tram" ? (totalAmount * discountValue) / 100 : discountValue) +
                    (totalAmount < 1000000 ? 30000 : 0)
                  ).toLocaleString("vi-VN")}
                  ₫
                </span>
              </p>
            </div>
            <button className={`${styles.checkoutButton} w-full`} onClick={handleClick}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
