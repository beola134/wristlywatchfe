"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./suasanpham.module.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function SuaSanPham({ params }) {
  const { id } = params;
  const [formData, setFormData] = useState({
    ten_san_pham: "",
    ten: "",
    gia_san_pham: "",
    gia_giam: "",
    ma_san_pham: "",
    do_chiu_nuoc: "",
    xuat_xu: "",
    gioi_tinh: "",
    so_luong: "",
    loai_may: "",
    loai: "",
    duong_kinh: "",
    chat_lieu_day: "",
    chat_lieu_vo: "",
    mat_kinh: "",
    mau_mat: "",
    phong_cach: "",
    kieu_dang: "",
    thuong_hieu: "",
    size_day: "",
    mau_day: "",
    do_dai_day: "",
    id_thuong_hieu: "",
    id_danh_muc: "",
    mo_ta: "",
    hinh_anh: "",
  });
  const [errors, setErrors] = useState({});
  const [thuongHieu, setThuongHieu] = useState([]);
  const [cates, setCates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // Fetch dữ liệu sản phẩm, thương hiệu, danh mục
  useEffect(() => {
    const fetchProductAndData = async () => {
      try {
        const brandResponse = await fetch(
          "http://localhost:5000/thuonghieu/allthuonghieu"
        );
        const brandData = await brandResponse.json();
        setThuongHieu(brandData.th);

        const cateResponse = await fetch(
          "http://localhost:5000/cate/getAllCateadmin"
        );
        const cateData = await cateResponse.json();
        setCates(cateData.cates);

        const productResponse = await fetch(
          `http://localhost:5000/product/chitietsp/${id}`
        );
        const productData = await productResponse.json();
        setFormData({ ...productData.product });
        setPreviewImage(
          `http://localhost:5000/images/${productData.product.hinh_anh}`
        );
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };
    fetchProductAndData();
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Xử lý thay đổi file hình ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Tạo ảnh preview khi chọn file mới
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    const {
      ten_san_pham,
      ten,
      gia_san_pham,
      ma_san_pham,
      so_luong,
      id_thuong_hieu,
      hinh_anh,
      mo_ta,
    } = formData;

    if (!ten_san_pham) newErrors.ten_san_pham = "Vui lòng nhập tên sản phẩm.";
    if (!ten) newErrors.ten = "Vui lòng nhập tên chi tiết.";
    if (!gia_san_pham || isNaN(gia_san_pham) || gia_san_pham <= 0) {
      newErrors.gia_san_pham = "Vui lòng nhập giá sản phẩm hợp lệ.";
    }
    if (!ma_san_pham) newErrors.ma_san_pham = "Vui lòng nhập mã sản phẩm.";
    if (so_luong === "" || isNaN(so_luong) || so_luong < 0) {
      newErrors.so_luong = "Vui lòng nhập số lượng hợp lệ.";
    }
    if (!id_thuong_hieu)  
      newErrors.id_thuong_hieu = "Vui lòng chọn thương hiệu.";
    if (!hinh_anh) newErrors.hinh_anh = "Vui lòng chọn hình ảnh sản phẩm.";
    if (!mo_ta) newErrors.mo_ta = "Vui lòng nhập mô tả sản phẩm.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng điền tất cả các trường bắt buộc.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "id_danh_muc") {
        data.append(key, formData[key] || "");
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.append("hinh_anh", imageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/product/capnhatsp/${id}`,
        {
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Cập nhật sản phẩm không thành công"
        );
      }

      await Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được cập nhật thành công",
        icon: "success",
        confirmButtonText: "OK",
      });
      window.location.href = "/admin/components/quanlyadmin/sanpham";
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.message);
      Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi thêm sản phẩm: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Cập Nhật Sản Phẩm
          </div>
          <div className={styles.timestamp} id="timestamp"></div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              {/* Thương hiệu (Brand) Select */}
              <div className={styles.formGroup}>
                <label htmlFor="id_thuong_hieu">Thương hiệu</label>
                <select
                  id="id_thuong_hieu"
                  name="id_thuong_hieu"
                  value={formData.id_thuong_hieu}
                  onChange={handleChange}
                >
                  <option value="">Chọn thương hiệu</option>
                  {thuongHieu.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.thuong_hieu}
                    </option>
                  ))}
                </select>
                {errors.id_thuong_hieu && (
                  <span className="text-danger">{errors.id_thuong_hieu}</span>
                )}
              </div>

              {/* Danh mục (Category) Select */}
              <div className={styles.formGroup}>
                <label htmlFor="id_danh_muc">Danh mục</label>
                <select
                  id="id_danh_muc"
                  name="id_danh_muc"
                  value={formData.id_danh_muc || ""}
                  onChange={handleChange}
                >
                  <option value="">Chọn danh mục (Không bắt buộc)</option>
                  {cates.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.ten_danh_muc}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tên sản phẩm */}
              <div className={styles.formGroup}>
                <label htmlFor="ten_san_pham">Tên sản phẩm</label>
                <input
                  type="text"
                  id="ten_san_pham"
                  name="ten_san_pham"
                  value={formData.ten_san_pham}
                  onChange={handleChange}
                />
                {errors.ten_san_pham && (
                  <span className="text-danger">{errors.ten_san_pham}</span>
                )}
              </div>

              {/* Tên chi tiết */}
              <div className={styles.formGroup}>
                <label htmlFor="ten">Tên chi tiết</label>
                <input
                  type="text"
                  id="ten"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                />
                {errors.ten && (
                  <span className="text-danger">{errors.ten}</span>
                )}
              </div>

              {/* Giá sản phẩm */}
              <div className={styles.formGroup}>
                <label htmlFor="gia_san_pham">Giá sản phẩm</label>
                <input
                  type="text"
                  id="gia_san_pham"
                  name="gia_san_pham"
                  value={formData.gia_san_pham}
                  onChange={handleChange}
                />
                {errors.gia_san_pham && (
                  <span className="text-danger">{errors.gia_san_pham}</span>
                )}
              </div>

              {/* Giá giảm */}
              <div className={styles.formGroup}>
                <label htmlFor="gia_giam">Giá giảm</label>
                <input
                  type="text"
                  id="gia_giam"
                  name="gia_giam"
                  value={formData.gia_giam}
                  onChange={handleChange}
                />
              </div>

              {/* Mã sản phẩm */}
              <div className={styles.formGroup}>
                <label htmlFor="ma_san_pham">Mã sản phẩm</label>
                <input
                  type="text"
                  id="ma_san_pham"
                  name="ma_san_pham"
                  value={formData.ma_san_pham}
                  onChange={handleChange}
                />
                {errors.ma_san_pham && (
                  <span className="text-danger">{errors.ma_san_pham}</span>
                )}
              </div>
              {/* Số lượng */}
              <div className={styles.formGroup}>
                <label htmlFor="so_luong">Số lượng</label>
                <input
                  type="text"
                  id="so_luong"
                  name="so_luong"
                  value={formData.so_luong}
                  onChange={handleChange}
                />
                {errors.so_luong && (
                  <span className="text-danger">{errors.so_luong}</span>
                )}
              </div>
              {/* Độ chịu nước */}
              <div className={styles.formGroup}>
                <label htmlFor="do_chiu_nuoc">Độ chịu nước</label>
                <input
                  type="text"
                  id="do_chiu_nuoc"
                  name="do_chiu_nuoc"
                  value={formData.do_chiu_nuoc}
                  onChange={handleChange}
                />
              </div>

              {/* Xuất xứ */}
              <div className={styles.formGroup}>
                <label htmlFor="xuat_xu">Xuất xứ</label>
                <input
                  type="text"
                  id="xuat_xu"
                  name="xuat_xu"
                  value={formData.xuat_xu}
                  onChange={handleChange}
                />
              </div>

              {/* Giới tính */}
              <div className={styles.formGroup}>
                <label htmlFor="gioi_tinh">Giới tính</label>
                <input
                  type="text"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  value={formData.gioi_tinh}
                  onChange={handleChange}
                />
              </div>

              {/* Loại */}
              <div className={styles.formGroup}>
                <label htmlFor="loai">Loại</label>
                <input
                  type="text"
                  id="loai"
                  name="loai"
                  value={formData.loai}
                  onChange={handleChange}
                />
              </div>

              {/* Loại máy */}
              <div className={styles.formGroup}>
                <label htmlFor="loai_may">Loại máy</label>
                <input
                  type="text"
                  id="loai_may"
                  name="loai_may"
                  value={formData.loai_may}
                  onChange={handleChange}
                />
              </div>

              {/* Đường kính */}
              <div className={styles.formGroup}>
                <label htmlFor="duong_kinh">Đường kính</label>
                <input
                  type="text"
                  id="duong_kinh"
                  name="duong_kinh"
                  value={formData.duong_kinh}
                  onChange={handleChange}
                />
              </div>

              {/* Chất liệu dây */}
              <div className={styles.formGroup}>
                <label htmlFor="chat_lieu_day">Chất liệu dây</label>
                <input
                  type="text"
                  id="chat_lieu_day"
                  name="chat_lieu_day"
                  value={formData.chat_lieu_day}
                  onChange={handleChange}
                />
              </div>

              {/* Chất liệu vỏ */}
              <div className={styles.formGroup}>
                <label htmlFor="chat_lieu_vo">Chất liệu vỏ</label>
                <input
                  type="text"
                  id="chat_lieu_vo"
                  name="chat_lieu_vo"
                  value={formData.chat_lieu_vo}
                  onChange={handleChange}
                />
              </div>

              {/* Mặt kính */}
              <div className={styles.formGroup}>
                <label htmlFor="mat_kinh">Mặt kính</label>
                <input
                  type="text"
                  id="mat_kinh"
                  name="mat_kinh"
                  value={formData.mat_kinh}
                  onChange={handleChange}
                />
              </div>

              {/* Màu mặt */}
              <div className={styles.formGroup}>
                <label htmlFor="mau_mat">Màu mặt</label>
                <input
                  type="text"
                  id="mau_mat"
                  name="mau_mat"
                  value={formData.mau_mat}
                  onChange={handleChange}
                />
              </div>

              {/* Phong cách */}
              <div className={styles.formGroup}>
                <label htmlFor="phong_cach">Phong cách</label>
                <input
                  type="text"
                  id="phong_cach"
                  name="phong_cach"
                  value={formData.phong_cach}
                  onChange={handleChange}
                />
              </div>

              {/* Kiểu dáng */}
              <div className={styles.formGroup}>
                <label htmlFor="kieu_dang">Kiểu dáng</label>
                <input
                  type="text"
                  id="kieu_dang"
                  name="kieu_dang"
                  value={formData.kieu_dang}
                  onChange={handleChange}
                />
              </div>

              {/* Size dây */}
              <div className={styles.formGroup}>
                <label htmlFor="size_day">Size dây</label>
                <input
                  type="text"
                  id="size_day"
                  name="size_day"
                  value={formData.size_day}
                  onChange={handleChange}
                />
              </div>

              {/* Màu dây */}
              <div className={styles.formGroup}>
                <label htmlFor="mau_day">Màu dây</label>
                <input
                  type="text"
                  id="mau_day"
                  name="mau_day"
                  value={formData.mau_day}
                  onChange={handleChange}
                />
              </div>

              {/* Độ dài dây */}
              <div className={styles.formGroup}>
                <label htmlFor="do_dai_day">Độ dài dây</label>
                <input
                  type="text"
                  id="do_dai_day"
                  name="do_dai_day"
                  value={formData.do_dai_day}
                  onChange={handleChange}
                />
              </div>

              {/* Hình ảnh */}
              <div className={styles.formGroup}>
                <label htmlFor="hinh_anh">Hình ảnh</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {errors.hinh_anh && (
                    <span className="text-danger">{errors.hinh_anh}</span>
                  )}
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className={styles.formGroup}>
                <label htmlFor="mo_ta">Mô tả sản phẩm</label>
                <textarea
                  id="mo_ta"
                  name="mo_ta"
                  value={formData.mo_ta}
                  onChange={handleChange}
                />
                {errors.mo_ta && (
                  <span className="text-danger">{errors.mo_ta}</span>
                )}
              </div>

              {/* Hiển thị thông báo lỗi */}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              {/* Submit and Cancel Buttons */}
              <button type="submit" className="btn btn-outline-primary">
                Cập Nhật
              </button>
              <Link href="/admin/components/quanlyadmin/sanpham">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                >
                  Hủy bỏ
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
