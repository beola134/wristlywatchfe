"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import styles from "./suadanhmuc.module.css";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";

export default function SuaDanhmuc() {
  const router = useRouter();
  const { id } = useParams();
  const [showInterface, setShowInterface] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [danhmuc, setdanhmuc] = useState({
    ten_danh_muc: "",
    hinh_anh: "",
    mo_ta: "",
  });
  const [comments, setComments] = useState([]); // State để lưu bình luận

  // Lấy thông tin danh mục
  useEffect(() => {
    const fetchDanhmuc = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cate/allcate/${id}`);
        if (response.ok) {
          const data = await response.json();
          setdanhmuc(data.cates);
        } else {
          Swal.fire("Error", "Không tìm thấy Danh mục!", "error");
        }
      } catch (error) {
        console.error("Error fetching Danh mục:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi tải thông tin!", "error");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/comment/getByCategory/${id}`); // API lấy bình luận theo danh mục
        if (response.ok) {
          const data = await response.json();
          setComments(data); // Cập nhật bình luận vào state
        } else {
          Swal.fire("Error", "Không tìm thấy bình luận!", "error");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi tải bình luận!", "error");
      }
    };

    fetchDanhmuc();
    fetchComments(); // Lấy bình luận khi component được render
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdanhmuc({ ...danhmuc, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!danhmuc.ten_danh_muc.trim()) {
      Swal.fire({
        title: "Lỗi",
        text: "Tên danh mục không được để trống!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("ten_danh_muc", danhmuc.ten_danh_muc);
    formData.append("mo_ta", danhmuc.mo_ta);

    if (ImageFile) {
      formData.append("hinh_anh", ImageFile);
    }

    try {
      const res = await fetch(`http://localhost:5000/cate/updatecate/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          title: "Thành công",
          text: "Cập nhật thông tin thành công",
          icon: "success",
          confirmButtonText: "OK",
        });
        setImageFile(null);
      } else {
        Swal.fire({
          title: "Thất bại",
          text: "Cập nhật thông tin thất bại",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra, vui lòng thử lại.",
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
            Cập nhật Danh mục
          </div>
        </div>
        <div className={styles.bg}>
          <form onSubmit={handleSubmit}>
            <div className={styles.container1}>
              <div className={styles.formGroup}>
                <label htmlFor="ten_danh_muc">Tên danh mục</label>
                <input
                  type="text"
                  id="ten_danh_muc"
                  name="ten_danh_muc"
                  value={danhmuc?.ten_danh_muc || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Mô tả Danh mục</label>
                <textarea
                  id="description"
                  name="mo_ta"
                  value={danhmuc?.mo_ta || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="hinhAnh">Hình ảnh</label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  <img
                    src={`http://localhost:5000/images/${danhmuc.hinh_anh}`}
                    style={{ width: "80px" }}
                  />
                  <input
                    style={{
                      height: "50px",
                      width: "90%",
                      marginTop: "15px",
                    }}
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-outline-primary"
                onClick={() => router.push("/admin/components/quanlyadmin/danhmuc")}>
                Cập nhật
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.push("/admin/components/quanlyadmin/danhmuc")}>
                Hủy bỏ
              </button>
            </div>
          </form>
          {/* Hiển thị bình luận */}
          <div className={styles.commentsSection}>
            <h4>Bình luận:</h4>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <p>{comment.noi_dung}</p>
                  <small>
                    <strong>Ngày bình luận: </strong>{comment.ngay_binh_luan}
                  </small>
                  {comment.tra_loi_binh_luan && (
                    <div>
                      <strong>Trả lời: </strong>
                      <p>{comment.tra_loi_binh_luan}</p>
                      <small>
                        <strong>Ngày trả lời: </strong>{comment.ngay_tra_loi}
                      </small>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
