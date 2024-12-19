"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styles from "./register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import cx from "classnames";

const schema = Yup.object().shape({
  name: Yup.string()
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập không hợp lệ")
    .required("Vui lòng nhập tên đăng nhập"),

  email: Yup.string()
    .email("Email không hợp lệ")
    .matches(/^[^_\s]+@[^_\s]+\.[^_\s]+$/, "Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    .required("Vui lòng nhập mật khẩu"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  otp: Yup.string().length(6, "OTP phải có 6 chữ số").required("Vui lòng nhập OTP"),

  // image: Yup.mixed()
  //   .required("Vui lòng chọn file hình ảnh")
  //   .test("fileSize", "File quá lớn, vui lòng chọn file nhỏ hơn 2MB", (value) => {
  //     return value && value.size <= 2000000; // 2MB
  //   })
  //   .test("fileType", "Định dạng file không hợp lệ", (value) => {
  //     return value && ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif"].includes(value.type);
  //   }),
});

export default function Register() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ConfirmShowPassword, setConfirmShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      // image: null,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (!isOtpSent) {
        setFieldError("email", "Vui lòng gửi OTP trước khi đăng ký.");
        setSubmitting(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ten_dang_nhap: values.name,
            email: values.email,
            mat_khau: values.password,
            xac_nhan_mat_khau: values.confirmPassword,
            otp: values.otp,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          if (!res.ok) {
            setFieldError("general", data.message || "Vui lòng thử lại.");
          }
        } else {
          Swal.fire({
            icon: "success",
            title: "Đăng ký thành công",
            text: "Đăng ký thành công, vui lòng đăng nhập để tiếp tục.",
          }).then(() => {
            window.location.href = "/components/components-login/login";
          });
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch("http://localhost:5000/users/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;

      Swal.fire({
        title: "Đăng nhập thành công",
        text: "Chào mừng bạn đến với Website!",
        icon: "success",
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "http://localhost:3001";
      });
    } catch (error) {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: error.message || "Vui lòng thử lại.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const handleLoginFailure = () => {
    Swal.fire({
      title: "Đăng nhập thất bại",
      text: "Có lỗi xảy ra vui lòng thử lại.",
      icon: "error",
      showConfirmButton: true,
    });
  };

  const handleSendOtp = async () => {
    if (loading || isOtpSent) return;
    if (!formik.values.email) {
      formik.setFieldError("email", "Vui lòng nhập email trước khi gửi OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/users/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formik.values.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        setTimeLeft(180);
        Swal.fire({
          icon: "success",
          title: "Gửi OTP thành công",
          text: "Mã OTP đã được gửi đến email của bạn.",
        });
        // 3 minutes in seconds
      } else {
        formik.setFieldError("email", data.message || "Vui lòng thử lại.");
      }
    } catch (error) {
      formik.setFieldError("email", error.message || "Có lỗi xảy ra khi gửi OTP.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOtpSent) return;

    if (timeLeft === 0) {
      setIsOtpSent(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOtpSent, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Hàm để đổi trạng thái ẩn/hiện mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!ConfirmShowPassword);
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
            <Link href="/components/components-login/register" className={cx("link", "text-red-500")}>
              Đăng ký
            </Link>
          </span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.heading}>Đăng ký</div>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <input
              type="text"
              className={`${styles.input} ${formik.errors.name ? styles.inputError : ""}`}
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Tên đăng nhập"
            />
            {formik.errors.name && <p className={styles.error}>{formik.errors.name}</p>}

            <input
              type="email"
              className={`${styles.input} ${formik.errors.email ? styles.inputError : ""}`}
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
            />
            {formik.errors.email && <p className={styles.error}>{formik.errors.email}</p>}

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${formik.errors.password ? styles.inputError : ""}`}
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Mật khẩu"
              />
              <div className={styles.togglePasswordIcon} onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            {formik.errors.password && <p className={styles.error}>{formik.errors.password}</p>}

            <div className={styles.passwordWrapper}>
              <input
                type={ConfirmShowPassword ? "text" : "password"}
                className={`${styles.input} ${formik.errors.confirmPassword ? styles.inputError : ""}`}
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                placeholder="Nhâp lại mật khẩu"
              />
              <div className={`${styles.togglePasswordIcon} absolute`} onClick={toggleConfirmPasswordVisibility}>
                {ConfirmShowPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            {formik.errors.confirmPassword && <p className={styles.error}>{formik.errors.confirmPassword}</p>}
            <div className={styles.otpContainer}>
              <input
                type="text"
                className={`${styles.input} ${formik.errors.otp && formik.touched.otp ? styles.inputError : ""}`}
                id="otp"
                name="otp"
                maxLength={6}
                onChange={formik.handleChange}
                value={formik.values.otp}
                placeholder="OTP"
                disabled={!isOtpSent}
              />
              <button
                type="button"
                className={styles.sendOtpButton}
                onClick={handleSendOtp}
                disabled={loading || isOtpSent}
              >
                {isOtpSent ? `OTP đã gửi (${formatTime(timeLeft)})` : "Gửi OTP"}
              </button>
            </div>
            {formik.errors.otp && formik.touched.otp && <p className={styles.error}>{formik.errors.otp}</p>}

            {formik.errors.general && <p className={styles.error}>{formik.errors.general}</p>}

            {/* <input
            type="file"
            className={`${styles.input} ${formik.errors.image ? styles.inputError : ""}`}
            id="image"
            name="image"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {formik.errors.image && <p className={styles.error}>{formik.errors.image}</p>} */}

            <input
              type="submit"
              className={styles.loginButton}
              value={formik.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              disabled={formik.isSubmitting}
            />
          </form>
          {!isModalOpen && (
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
              <div className={styles.socialAccountContainer}>
                <span className={styles.title}>Đăng nhập với</span>

                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onFailure={handleLoginFailure}
                  render={(renderProps) => (
                    <div className={styles.socialAccounts}>
                      <button
                        className={styles.socialButton}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      ></button>
                    </div>
                  )}
                />
              </div>
            </GoogleOAuthProvider>
          )}
          <div className={styles.signUpNow}>
            <span className={styles.dontHaveAnAccount}>
              Đã có tài khoản? &nbsp;
              <Link href="/components/components-login/login" id="gotoSignup">
                Đăng nhập ngay
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
