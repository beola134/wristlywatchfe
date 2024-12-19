"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import styles from "./themtaikhoan.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ThemUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("admin");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const showAlert = (icon, title, text) => {
    Swal.fire({ icon, title, text });
  };

  const validateForm = () => {
    if (!username.trim()) {
      showAlert("warning", "Thiếu thông tin", "Tên đăng nhập là bắt buộc!");
      return false;
    }

    if (
      !password.trim() ||
      !/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    ) {
      showAlert(
        "warning",
        "Mật khẩu không hợp lệ",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 ký tự đặc biệt!"
      );
      return false;
    }

    if (!phone.trim()) {
      showAlert("warning", "Thiếu thông tin", "Phone là bắt buộc!");
      return false;
    }

    const phoneRegex = /^0[1-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      showAlert(
        "error",
        "Phone không hợp lệ",
        "Vui lòng nhập lại số điện thoại bắt đầu bằng 0 và phải đủ 10 số!"
      );
      return false;
    }

    if (!email.trim()) {
      showAlert("warning", "Thiếu thông tin", "Email là bắt buộc!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(email)) {
      showAlert(
        "error",
        "Email không hợp lệ",
        "Vui lòng nhập một địa chỉ email hợp lệ!"
      );
      return false;
    }

    if (!fullName.trim()) {
      showAlert("warning", "Thiếu thông tin", "Họ và tên là bắt buộc!");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");


      if (!validateForm()) {
        return;
      }

      const formData = new FormData();
      formData.append("ten_dang_nhap", username);
      formData.append("mat_khau", password);
      formData.append("email", email);
      formData.append("ho_ten", fullName);
      formData.append("dia_chi", address);
      formData.append("dien_thoai", phone);
      formData.append("quyen", role === "admin" ? 1 : 2);
      formData.append("hinh_anh", image);

      try {
        const response = await fetch("http://localhost:5000/users/addUser", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thêm người dùng thành công!",
          }).then(() => {
            router.push("/admin/components/quanlyadmin/taikhoan");
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: errorData.message || "Có lỗi xảy ra!",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra!",
        });
      }
    };

  return (
    <>
      <div className={styles.SidebarContainer}>
        <section id={styles.content}>
          <div className={styles.header1}>
            <div className={styles.title} style={{ fontWeight: "bold" }}>
              Thêm Người Dùng Admin
            </div>
          </div>
          <div className={styles.bg}>
            <form onSubmit={handleSubmit}>
              <div className={styles.container1}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Điện thoại</label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div style={{width:"205%"}} className={styles.formGroup}>
                  <label htmlFor="image">Hình ảnh</label>
                  <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div  className={styles.formGroup}>
                  <label htmlFor="role">Vai trò</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Quản trị viên</option>
                    <option value="customer">Khách hàng</option>
                  </select>
                </div>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <button type="submit" className="btn btn-outline-primary">
                  Thêm
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.push("/admin/components/quanlyadmin/taikhoan")}
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}