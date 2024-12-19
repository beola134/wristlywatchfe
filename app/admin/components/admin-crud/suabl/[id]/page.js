"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import styles from "./suabl.module.css";
import { useRouter, useParams } from "next/navigation";
import Swal from 'sweetalert2';  

export default function SuaVoucher() {
  const router = useRouter();
  const { id } = useParams();
  const [binhluan, setbinhluan] = useState({
    noi_dung: "",
    tra_loi_binh_luan: "",
    ngay_binh_luan: "",
    id_nguoi_dung: "",
    id_san_pham: "",
  });

  // Lấy thông tin bình luận
  useEffect(() => {
    const fetchBinhluan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/comment/get/${id}`);
        if (response.ok) {
          const data = await response.json();
          setbinhluan(data.comment); 
        } else {
          Swal.fire("Error", "Không tìm thấy bình luận!", "error");
        }
      } catch (error) {
        console.error("Error fetching Bình luận:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi tải thông tin!", "error");
      }
    };
    fetchBinhluan();
  }, [id]);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { tra_loi_binh_luan } = binhluan;  
  
    try {
      const response = await fetch(`http://localhost:5000/comment/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tra_loi_binh_luan,  
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        Swal.fire("Success", data.message, "success");
        router.push("/admin/components/quanlyadmin/comments"); 
      } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.message || "Cập nhật không thành công", "error");
      }
    } catch (error) {
      console.error("Error updating Bình luận:", error);
      Swal.fire("Error", "Có lỗi xảy ra khi cập nhật bình luận!", "error");
    }
  };
  

  return (
    <div className={styles.SidebarContainer}>
      <section id={styles.content}>
        <div className={styles.header1}>
          <div className={styles.title} style={{ fontWeight: "bold" }}>
            Trả Lời Bình Luận
          </div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="noi_dung">Nội dung bình luận</label>
                <textarea
                  id="noi_dung"
                  className="noi_dung"
                  value={binhluan.noi_dung}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tra_loi_binh_luan">Trả lời bình luận</label>
                <textarea
                  id="tra_loi_binh_luan"
                  className="tra_loi_binh_luan"
                  value={binhluan.tra_loi_binh_luan}
                  onChange={(e) => setbinhluan({ ...binhluan, tra_loi_binh_luan: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="ngay_binh_luan">Ngày bình luận</label>
                <input
                  type="text"
                  id="ngay_binh_luan"
                  className="ngay_binh_luan"
                  value={binhluan.ngay_binh_luan}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="id_nguoi_dung">ID Người dùng</label>
                <input
                  type="text"
                  id="id_nguoi_dung"
                  className="id_nguoi_dung"
                  value={binhluan.id_nguoi_dung}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="id_san_pham">ID Sản phẩm</label>
                <input
                  type="text"
                  id="id_san_pham"
                  className="id_san_pham"
                  value={binhluan.id_san_pham}
                  readOnly
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary"
              >
                Cập nhật
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.push("/admin/components/quanlyadmin/voucher")}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
