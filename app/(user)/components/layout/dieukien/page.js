"use client";
import React, { useState, useEffect } from "react";
import styles from "./dieukien.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VoucherModal({ isOpen, onRequestClose, voucherId }) {
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && voucherId) {
      setLoading(true); // Reset loading state khi mở modal
      fetch(`http://localhost:5000/voucher/getVoucherById/${voucherId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch voucher");
          }
          return response.json();
        })
        .then((data) => {
          setVoucher(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [isOpen, voucherId]);

  const handleCopy = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode)
      .then(() => {
        toast.success(`Mã ${voucherCode} đã được sao chép thành công!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch(() => {
        toast.error("Không thể sao chép mã. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  if (!isOpen) return null;
  if (loading) return <div className={styles.overlay}><p>Loading...</p></div>;
  if (error) return <div className={styles.overlay}><p>Error: {error.message}</p></div>;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white p-5 rounded-lg text-center w-full max-w-lg shadow-lg 
    lg:max-w-lg md:max-w-md sm:max-w-sm sm:px-4">
    <h3 className="text-xl font-bold mb-2">VOUCHER</h3>
    <div className="text-base mb-5 leading-6">
      <p>
        <strong>Mã khuyến mãi:</strong> {voucher?.ma_voucher}
      </p>
      <p>
        <strong>Điều kiện:</strong> {voucher?.mo_ta}
      </p>
    </div>
    <div className="flex justify-between gap-3">
      {voucher.so_luong > 0 ? (
        <button
          className="flex-1 py-3  bg-[#796752] border text-white rounded-full cursor-pointer"
          onClick={() => handleCopy(voucher.ma_voucher)}
        >
          Copy
        </button>
      ) : (
        <button className="flex-1 py-3 bg-gray-400 text-white rounded-full cursor-not-allowed">
          Hết Voucher
        </button>
      )}
      <button
        className="flex-1 py-3  bg-white text-black rounded-full border"
        onClick={onRequestClose}
      >
        Đóng
      </button>
    </div>
  </div>
</div>

    </>
  );
}

export default VoucherModal;
