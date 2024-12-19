"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import styles from "./forgot-password.module.css";
import Link from "next/link";
import Loading from "../../loading/page";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import cx from "classnames";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .matches(/^[^_\s]+@[^_\s]+\.[^_\s]+$/, "Email không hợp lệ")
    .required("Vui lòng nhập email"),
  otp: Yup.string()
    .min(6, "Mã OTP phải có ít nhất 6 ký tự số")
    .matches(/^[0-9]+$/, "Mã OTP chỉ được chứa các chữ số")
    .required("Vui lòng nhập mã OTP"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //thoi gian cho gui lai otp
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [ConfirmShowPassword, setConfirmShowPassword] = useState(false);
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);
  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/users/resetPasswordByOTP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            otp: values.otp,
            mat_khau_moi: values.password,
            xac_nhan_mat_khau: values.confirmPassword,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.message.includes("Email không tồn tại")) {
            setFieldError("email", errorData.message);
          } else if (errorData.message.includes("Mã OTP không chính xác")) {
            setFieldError("otp", errorData.message);
          } else if (errorData.message.includes("Mật khẩu mới phải khác mật khẩu cũ")) {
            setFieldError("password", errorData.message);
          } else if (errorData.message.includes("Mật khẩu xác nhận không khớp")) {
            setFieldError("confirmPassword", errorData.message);
          } else {
            setStatus(errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau");
          }
          throw new Error(errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        }
        Swal.fire({
          icon: "success",
          title: "Đổi mật khẩu thành công",
          text: "Vui lòng đăng nhập để tiếp tục",
        }).then(() => {
          router.push("/components/components-login/login");
        });
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  // gửi mã otp
  const handleSendOtp = async () => {
    const errors = await formik.validateForm();
    if (errors.email) {
      setError(errors.email);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/sendOTPquenmk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formik.values.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Không thể gửi OTP, vui lòng thử lại");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "OTP đã được gửi",
        text: "Vui lòng kiểm tra email của bạn để nhận OTP",
      });
      setIsOtpSent(true);
      setTimer(180);
      setCanResend(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  if (loading) {
    return <Loading />;
  }

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
            <Link href="/components/components-login/forgot-password" className={cx("link", "text-red-500")}>
              Quên mật khẩu
            </Link>
          </span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={`${styles.container}`}>
          <div className={styles.heading}>Quên mật khẩu</div>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <input
              type="email"
              className={`${styles.input} ${formik.errors.email ? styles.inputError : ""}`}
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={`${styles.input} ${formik.errors.otp ? styles.inputError : ""}`}
                id="otp"
                name="otp"
                onChange={formik.handleChange}
                value={formik.values.otp}
                placeholder="OTP"
                disabled={!isOtpSent}
                maxLength={6}
              />
              <p
                className={styles.GetOTP}
                onClick={handleSendOtp}
                style={{ cursor: loading || isOtpSent ? "not-allowed" : "pointer", color: isOtpSent ? "grey" : "blue" }}
              >
                {canResend ? (isOtpSent ? "Gửi lại OTP" : "Gửi OTP") : `Gửi lại sau ${formatTime(timer)}`}
              </p>
            </div>
            {formik.errors.otp && <p className={styles.error}>{formik.errors.otp}</p>}

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${formik.errors.password ? styles.inputError : ""}`}
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Mật khẩu mới"
                disabled={!isOtpSent}
              />
              <div className={`${styles.togglePasswordIcon} absolute`} onClick={togglePasswordVisibility}>
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
                placeholder="Nhập lại mật khẩu mới"
                disabled={!isOtpSent}
              />
              <div className={`${styles.togglePasswordIcon} absolute`} onClick={toggleConfirmPasswordVisibility}>
                {ConfirmShowPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>

            {formik.errors.confirmPassword && <p className={styles.error}>{formik.errors.confirmPassword}</p>}
            <button type="submit" className={styles.loginButton} disabled={!isOtpSent || loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
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
