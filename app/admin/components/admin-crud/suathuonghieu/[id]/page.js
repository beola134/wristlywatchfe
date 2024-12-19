"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import styles from "./suadanhmuc.module.css";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function SuaThuongHieu() {
  const [product, setProduct] = useState({
    thuong_hieu: "",
    hinh_anh: "",
    hinh_anh2: "",
    mo_ta: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [productLogo, setProductLogo] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`https://wristlywatchbe-bd4bdd62f0ed.herokuapp.com/thuonghieu/allthuonghieu/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct({
            thuong_hieu: data.th.thuong_hieu || "",
            hinh_anh: data.th.hinh_anh || "",
            hinh_anh2: data.th.hinh_anh2 || "",
            mo_ta: data.th.mo_ta || "",
          });
        } else {
          Swal.fire("Error", "Không tìm thấy thương hiệu!", "error");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi tải thông tin!", "error");
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("thuong_hieu", product.thuong_hieu);
    formData.append("mo_ta", product.mo_ta);
    if (productImage) formData.append("hinh_anh", productImage);
    if (productLogo) formData.append("hinh_anh2", productLogo);

    try {
      const response = await fetch(`https://wristlywatchbe-bd4bdd62f0ed.herokuapp.com/thuonghieu/updatethuonghieu/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Sửa thương hiệu thành công!",
        }).then(() => {
          router.push("/admin/components/quanlyadmin/thuonghieu");
        });
      } else {
        Swal.fire("Error", "Có lỗi xảy ra!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Có lỗi xảy ra!", "error");
    }
  };

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Sửa Thương Hiệu
          </div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="product-name">Tên thương hiệu</label>
                <input
                  type="text"
                  id="product-name"
                  value={product.thuong_hieu}
                  onChange={(e) => setProduct({ ...product, thuong_hieu: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="product-image">Ảnh thương hiệu</label>
                {product.hinh_anh2 && (
                  <img
                    src={`https://wristlywatchbe-bd4bdd62f0ed.herokuapp.com/images/${product.hinh_anh2}`}
                    alt={product.thuong_hieu}
                    style={{ width: "70px", height: "70px" }}
                  />
                )}
                <input
                  type="file"
                  id="product-image"
                  className="file-input"
                  onChange={(e) => setProductImage(e.target.files[0])}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="product-logo">Ảnh thương hiệu 2 (logo)</label>
                {product.hinh_anh && (
                  <img
                    src={`https://wristlywatchbe-bd4bdd62f0ed.herokuapp.com/images/${product.hinh_anh}`}
                    alt={product.thuong_hieu}
                    style={{ width: "70px", height: "70px" }}
                  />
                )}
                <input
                  type="file"
                  id="product-logo"
                  className="file-input"
                  onChange={(e) => setProductLogo(e.target.files[0])}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Mô tả thương hiệu</label>
                <textarea
                  id="description"
                  value={product.mo_ta}
                  onChange={(e) => setProduct({ ...product, mo_ta: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-outline-primary">
                Cập nhật
              </button>
              <Link href="/admin/components/quanlyadmin/thuonghieu">
                <button type="button" className="btn btn-outline-secondary w-100">
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