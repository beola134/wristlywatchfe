"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import styles from "./login.module.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import cx from "classnames";

// Định nghĩa schema với yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .matches(/^[^_\s]+@[^_\s]+\.[^_\s]+$/, "Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    .required("Vui lòng nhập mật khẩu"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  //số lần đăng nhập thất bại
  const [failedAttempts, setFailedAttempts] = useState(0);
  //trạng thái khóa
  const [isLocked, setIsLocked] = useState(false);
  //thời gian khóa
  const [lockoutTimer, setLockoutTimer] = useState(0);
  useEffect(() => {
    // Check for lockout end time in localStorage
    const lockoutEnd = localStorage.getItem('lockoutEnd');
    if (lockoutEnd) {
      const remainingTime = Math.floor((new Date(lockoutEnd) - new Date()) / 1000);
      if (remainingTime > 0) {
        setIsLocked(true);
        setLockoutTimer(remainingTime);
      } else {
        localStorage.removeItem('lockoutEnd');
      }
    }
  
    let timer;
    if (isLocked) {
      if (lockoutTimer === 0) {
        setLockoutTimer(120);
      }
      timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            setFailedAttempts(0);
            localStorage.removeItem('lockoutEnd');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTimer]);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            mat_khau: values.password,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Đăng nhập thất bại");
        }
        const data = await res.json();
        const { token, avatar } = data;
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;
        localStorage.setItem("avatar", avatar);

        const payload = jwtDecode(token);
        const welcomeMessage = payload.quyen === 1 ? "Chào mừng quản trị viên" : "Chào mừng bạn đến với Website!";

        Swal.fire({
          title: "Đăng nhập thành công",
          text: welcomeMessage,
          icon: "success",
          showConfirmButton: true,
        }).then(() => {
          if (typeof window !== "undefined") {
            const queryParam = new URLSearchParams(window.location.search);
            const redirect = queryParam.get("redirect");
            if (payload.quyen === 1) {
              window.location.href = "/admin";
            } else if (redirect && redirect.startsWith("/")) {
              window.location.href = redirect;
            } else if (redirect === "thanhtoan") {
              window.location.href = "/components/components-giaodich/thanhtoan";
            } else {
              window.location.href = "/";
            }
          }
        });
      } catch (error) {
        setFailedAttempts((prev) => prev + 1);
        if (failedAttempts + 1 >= 3) {
          setIsLocked(true);
          const lockoutEndTime = new Date(new Date().getTime() + 120 * 1000);
          localStorage.setItem('lockoutEnd', lockoutEndTime);
        }
        setSubmitting(false);
        Swal.fire({
          title: "Lỗi đăng nhập",
          text: error.message || "Có lỗi xảy ra vui lòng thử lại",
          icon: "error",
          showConfirmButton: true,
        });
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
        window.location.href = "/";
      });
    } catch (error) {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: "Tài khoản của bạn đã tồn tại.",
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

  // Hàm để đổi trạng thái ẩn/hiện mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container py-5">
        <div
          className={cx(
            "flex",
            "items-center uppercase  md:text-[16px] text-[10px] mb-5"
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
            &gt;
          </span>

          <span className={cx("")}>
            <Link
              href="/components/components-login/login"
              className={cx("link", "text-red-500")}
            >
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>

      <div
        className={`${
          styles.mainContainer
        } flex justify-center items-center h-screen ${
          isLocked ? "opacity-50" : "opacity-0"
        } `}
      >
        {" "}
        <div
          className={`${styles.container} max-w-[350px] w-[350px] h-auto px-[25px] py-[25px]`}
        >
          <div className="text-center font-semibold text-[30px] sm:text-30px text-[#333] mb-5">
            Đăng nhập
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <input
              type="email"
              className={`${styles.input} w-full px-5 py-[15px] ${
                formik.errors.email ? styles.inputError : ""
              }`}
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
            />
            {formik.errors.email && (
              <p className={styles.error}>{formik.errors.email}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.input} w-full px-5 py-[15px]  ${
                  formik.errors.password ? styles.inputError : ""
                }`}
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Mật khẩu"
              />
              <div
                className={`${styles.togglePasswordIcon} absolute`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            {formik.errors.password && (
              <p className={styles.error}>{formik.errors.password}</p>
            )}
            {isLocked && (
              <p className={styles.error}>
                Tài khoản bị khóa. Vui lòng thử lại sau{" "}
                {lockoutTimer} giây.
              </p>
            )}
            <span className={`${styles.forgotPassword} block`}>
              <Link href="./forgot-password">Quên mật khẩu</Link>
            </span>

            <input
              type="submit"
              className={`${styles.loginButton} block w-full py-[15px] my-5 mx-auto`}
              value="Đăng nhập"
              disabled={isLocked}
            />
          </form>

          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <div
              className={`${styles.socialAccountContainer} flex flex-col items-center mt-[25px]`}
            >
              <span className={`${styles.title} block`}>Đăng nhập với</span>

              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                render={(renderProps) => (
                  <div className={`${styles.socialAccounts} w-10 h-10`}>
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

          <div className={`${styles.signUpNow} block`}>
            <span className={styles.dontHaveAnAccount}>
              Bạn chưa có tài khoản? &nbsp;
              <Link
                href="/components/components-login/register"
                id="gotoSignup"
              >
                Đăng ký ngay
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
