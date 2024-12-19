"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import classNames from "classnames/bind";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loading from "../../loading/page";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../../components-giaodich/redux/slices/cartSilce";

const locTHNam = [
  { id: "thuong_hieu=CASIO&gioi_tinh=Nam", title: "CASIO" },
  { id: "thuong_hieu=MICHAELKORS&gioi_tinh=Nam", title: "MICHAELKORS" },
  { id: "thuong_hieu=HAMILTON&gioi_tinh=Nam", title: "HAMILTON" },
  { id: "thuong_hieu=TITONI&gioi_tinh=Nam", title: "TITONI" },
  { id: "thuong_hieu=CLAUDEBERNARD&gioi_tinh=Nam", title: "CLAUDEBERNARD" },
  { id: "thuong_hieu=OLYMPIANUS&gioi_tinh=Nam", title: "OLYMPIANUS" },
  {
    id: "thuong_hieu=FREDERIQUECONSTANT&gioi_tinh=Nam",
    title: "FREDERIQUECONSTANT",
  },
  { id: "thuong_hieu=EDOX&gioi_tinh=Nam", title: "EDOX" },
  { id: "thuong_hieu=CERTINA&gioi_tinh=Nam", title: "CERTINA" },
  { id: "thuong_hieu=CALVINKLEIN&gioi_tinh=Nam", title: "CALVINKLEIN" },
  {
    id: "thuong_hieu=DANIELWELLINGTON&gioi_tinh=Nam",
    title: "DANIELWELLINGTON",
  },
  { id: "thuong_hieu=MIDO&gioi_tinh=Nam", title: "MIDO" },
  { id: "thuong_hieu=CITIZEN&gioi_tinh=Nam", title: "CITIZEN" },
  { id: "thuong_hieu=SEIKO&gioi_tinh=Nam", title: "SEIKO" },
  { id: "thuong_hieu=ORIENT&gioi_tinh=Nam", title: "ORIENT" },
  { id: "thuong_hieu=FOSSIL&gioi_tinh=Nam", title: "FOSSIL" },
  { id: "thuong_hieu=SKAGEN&gioi_tinh=Nam", title: "SKAGEN" },
  { id: "thuong_hieu=LONGINES&gioi_tinh=Nam", title: "LONGINES" },
  { id: "thuong_hieu=TISSOT&gioi_tinh=Nam", title: "TISSOT" },
];
const locTHNu = [
  { id: "thuong_hieu=CASIO&gioi_tinh=Nữ", title: "CASIO" },
  { id: "thuong_hieu=MICHAELKORS&gioi_tinh=Nữ", title: "MICHAELKORS" },
  { id: "thuong_hieu=HAMILTON&gioi_tinh=Nữ", title: "HAMILTON" },
  { id: "thuong_hieu=TITONI&gioi_tinh=Nữ", title: "TITONI" },
  { id: "thuong_hieu=CLAUDEBERNARD&gioi_tinh=Nữ", title: "CLAUDEBERNARD" },
  { id: "thuong_hieu=OLYMPIANUS&gioi_tinh=Nữ", title: "OLYMPIANUS" },
  {
    id: "thuong_hieu=FREDERIQUECONSTANT&gioi_tinh=Nữ",
    title: "FREDERIQUECONSTANT",
  },
  { id: "thuong_hieu=EDOX&gioi_tinh=Nữ", title: "EDOX" },
  { id: "thuong_hieu=CERTINA&gioi_tinh=Nữ", title: "CERTINA" },
  { id: "thuong_hieu=CALVIN KLEIN&gioi_tinh=Nữ", title: "CALVIN KLEIN" },
  {
    id: "thuong_hieu=DANIELWELLINGTON&gioi_tinh=Nữ",
    title: "DANIELWELLINGTON",
  },
  { id: "thuong_hieu=MIDO&gioi_tinh=Nữ", title: "MIDO" },
  { id: "thuong_hieu=CITIZEN&gioi_tinh=Nữ", title: "CITIZEN" },
  { id: "thuong_hieu=SEIKO&gioi_tinh=Nữ", title: "SEIKO" },
  { id: "thuong_hieu=ORIENT&gioi_tinh=Nữ", title: "ORIENT" },
  { id: "thuong_hieu=FOSSIL&gioi_tinh=Nữ", title: "FOSSIL" },
  { id: "thuong_hieu=SKAGEN&gioi_tinh=Nữ", title: "SKAGEN" },
  { id: "thuong_hieu=LONGINES&gioi_tinh=Nữ", title: "LONGINES" },
  { id: "thuong_hieu=TISSOT&gioi_tinh=Nữ", title: "TISSOT" },
];
const locTHDoi = [
  { id: "thuong_hieu=CASIO&gioi_tinh=Đồng Hồ Đôi", title: "CASIO" },
  { id: "thuong_hieu=MICHAELKORS&gioi_tinh=Đồng Hồ Đôi", title: "MICHAELKORS" },
  { id: "thuong_hieu=HAMILTON&gioi_tinh=Đồng Hồ Đôi", title: "HAMILTON" },
  { id: "thuong_hieu=TITONI&gioi_tinh=Đồng Hồ Đôi", title: "TITONI" },
  {
    id: "thuong_hieu=CLAUDEBERNARD&gioi_tinh=Đồng Hồ Đôi",
    title: "CLAUDEBERNARD",
  },
  { id: "thuong_hieu=OLYMPIANUS&gioi_tinh=Đồng Hồ Đôi", title: "OLYMPIANUS" },
  {
    id: "thuong_hieu=FREDERIQUECONSTANT&gioi_tinh=Đồng Hồ Đôi",
    title: "FREDERIQUECONSTANT",
  },
  { id: "thuong_hieu=EDOX&gioi_tinh=Đồng Hồ Đôi", title: "EDOX" },
  { id: "thuong_hieu=CERTINA&gioi_tinh=Đồng Hồ Đôi", title: "CERTINA" },
  { id: "thuong_hieu=CALVINKLEIN&gioi_tinh=Đồng Hồ Đôi", title: "CALVINKLEIN" },
  {
    id: "thuong_hieu=DANIELWELLINGTON&gioi_tinh=Đồng Hồ Đôi",
    title: "DANIELWELLINGTON",
  },
  { id: "thuong_hieu=MIDO&gioi_tinh=Đồng Hồ Đôi", title: "MIDO" },
  { id: "thuong_hieu=CITIZEN&gioi_tinh=Đồng Hồ Đôi", title: "CITIZEN" },
  { id: "thuong_hieu=SEIKO&gioi_tinh=Đồng Hồ Đôi", title: "SEIKO" },
  { id: "thuong_hieu=ORIENT&gioi_tinh=Đồng Hồ Đôi", title: "ORIENT" },
  { id: "thuong_hieu=FOSSIL&gioi_tinh=Đồng Hồ Đôi", title: "FOSSIL" },
  { id: "thuong_hieu=SKAGEN&gioi_tinh=Đồng Hồ Đôi", title: "SKAGEN" },
  { id: "thuong_hieu=LONGINES&gioi_tinh=Đồng Hồ Đôi", title: "LONGINES" },
  { id: "thuong_hieu=TISSOT&gioi_tinh=Đồng Hồ Đôi", title: "TISSOT" },
];

const locgiaNam = [
  { id: "muc_gia=Dưới 2 triệu&gioi_tinh=Nam", title: "DƯỚI 2 TRIỆU" },
  {
    id: "muc_gia=Từ 2 triệu đến 5 triệu&gioi_tinh=Nam",
    title: "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
  },
  {
    id: "muc_gia=Từ 5 triệu đến 10 triệu&gioi_tinh=Nam",
    title: "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
  },
  {
    id: "muc_gia=Từ 10 triệu đến 20 triệu&gioi_tinh=Nam",
    title: "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
  },
  {
    id: "muc_gia=Từ 20 triệu đến 30 triệu&gioi_tinh=Nam",
    title: "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
  },
  {
    id: "muc_gia=Từ 30 triệu đến 50 triệu&gioi_tinh=Nam",
    title: "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
  },
  {
    id: "muc_gia=Từ 50 triệu đến 100 triệu&gioi_tinh=Nam",
    title: "TỪ 50 TRIỆU ĐẾN 100 TRIỆU ",
  },
  { id: "muc_gia=Trên 100 triệu&gioi_tinh=Nam", title: "TRÊN 100 TRIỆU" },
];
const locLoaiMayNam = [
  {
    id: "loai_may=Automatic&gioi_tinh=Nam",
    title: "Automatic (Máy cơ tự động)",
  },
  { id: "loai_may=Quartz&gioi_tinh=Nam", title: "Quartz (Máy pin - điện tử)" },
  {
    id: "loai_may=Eco-Drive&gioi_tinh=Nam",
    title: "Eco-Drive (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Quartz Chronograph&gioi_tinh=Nam",
    title: "Quartz Chronograph (Máy pin bấm giờ thể thao)",
  },
  {
    id: "loai_may=Automatic Chronometer&gioi_tinh=Nam",
    title: "Automatic Chronometer (Máy cơ tự động chuẩn COSC)",
  },
  {
    id: "loai_may=Quartz Chronometer&gioi_tinh=Nam",
    title: "Quartz Chronometer (Máy pin chuẩn COSC)",
  },
  {
    id: "loai_may=Automatic Chronograph&gioi_tinh=Nam",
    title: "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)",
  },
  {
    id: "loai_may=Quartz Solar&gioi_tinh=Nam",
    title: "Quartz Solar (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Manual winding&gioi_tinh=Nam",
    title: "Manual winding (Đồng hồ cơ lên dây cót bằng tay)",
  },
];
const locLoaiMayNu = [
  {
    id: "loai_may=Automatic&gioi_tinh=Nữ",
    title: "Automatic (Máy cơ tự động)",
  },
  { id: "loai_may=Quartz&gioi_tinh=Nữ", title: "Quartz (Máy pin - điện tử)" },
  {
    id: "loai_may=Eco-Drive&gioi_tinh=Nữ",
    title: "Eco-Drive (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Quartz Chronograph&gioi_tinh=Nữ",
    title: "Quartz Chronograph (Máy pin bấm giờ thể thao)",
  },
  {
    id: "loai_may=Automatic Chronometer&gioi_tinh=Nữ",
    title: "Automatic Chronometer (Máy cơ tự động chuẩn COSC)",
  },
  {
    id: "loai_may=Quartz Chronometer&gioi_tinh=Nữ",
    title: "Quartz Chronometer (Máy pin chuẩn COSC)",
  },
  {
    id: "loai_may=Automatic Chronograph&gioi_tinh=Nữ",
    title: "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)",
  },
  {
    id: "loai_may=Quartz Solar&gioi_tinh=Nữ",
    title: "Quartz Solar (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Manual winding&gioi_tinh=Nữ",
    title: "Manual winding (Đồng hồ cơ lên dây cót bằng tay)",
  },
];
const locLoaiMayDoi = [
  {
    id: "loai_may=Automatic&gioi_tinh=Đồng Hồ Đôi",
    title: "Automatic (Máy cơ tự động)",
  },
  {
    id: "loai_may=Quartz&gioi_tinh=Đồng Hồ Đôi",
    title: "Quartz (Máy pin - điện tử)",
  },
  {
    id: "loai_may=Eco-Drive&gioi_tinh=Đồng Hồ Đôi",
    title: "Eco-Drive (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Quartz Chronograph&gioi_tinh=Đồng Hồ Đôi",
    title: "Quartz Chronograph (Máy pin bấm giờ thể thao)",
  },
  {
    id: "loai_may=Automatic Chronometer&gioi_tinh=Đồng Hồ Đôi",
    title: "Automatic Chronometer (Máy cơ tự động chuẩn COSC)",
  },
  {
    id: "loai_may=Quartz Chronometer&gioi_tinh=Đồng Hồ Đôi",
    title: "Quartz Chronometer (Máy pin chuẩn COSC)",
  },
  {
    id: "loai_may=Automatic Chronograph&gioi_tinh=Đồng Hồ Đôi",
    title: "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)",
  },
  {
    id: "loai_may=Quartz Solar&gioi_tinh=Đồng Hồ Đôi",
    title: "Quartz Solar (Năng lượng ánh sáng)",
  },
  {
    id: "loai_may=Manual winding&gioi_tinh=Đồng Hồ Đôi",
    title: "Manual winding (Đồng hồ cơ lên dây cót bằng tay)",
  },
];
const locgiaNu = [
  { id: "muc_gia=Dưới 2 triệu&gioi_tinh=Nữ", title: "DƯỚI 2 TRIỆU" },
  {
    id: "muc_gia=Từ 2 triệu đến 5 triệu&gioi_tinh=Nữ",
    title: "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
  },
  {
    id: "muc_gia=Từ 5 triệu đến 10 triệu&gioi_tinh=Nữ",
    title: "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
  },
  {
    id: "muc_gia=Từ 10 triệu đến 20 triệu&gioi_tinh=Nữ",
    title: "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
  },
  {
    id: "muc_gia=Từ 20 triệu đến 30 triệu&gioi_tinh=Nữ",
    title: "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
  },
  {
    id: "muc_gia=Từ 30 triệu đến 50 triệu&gioi_tinh=Nữ",
    title: "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
  },
  {
    id: "muc_gia=Từ 50 triệu đến 100 triệu&gioi_tinh=Nữ",
    title: "TỪ 50 TRIỆU ĐẾN 100 TRIỆU ",
  },
  { id: "muc_gia=Trên 100 triệu&gioi_tinh=Nữ", title: "TRÊN 100 TRIỆU" },
];
const locgiaDoi = [
  { id: "muc_gia=Dưới 2 triệu&gioi_tinh=Đồng Hồ Đôi", title: "DƯỚI 2 TRIỆU" },
  {
    id: "muc_gia=Từ 2 triệu đến 5 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 2 TRIỆU ĐẾN 5 TRIỆU",
  },
  {
    id: "muc_gia=Từ 5 triệu đến 10 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 5 TRIỆU ĐẾN 10 TRIỆU",
  },
  {
    id: "muc_gia=Từ 10 triệu đến 20 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 10 TRIỆU ĐẾN 20 TRIỆU",
  },
  {
    id: "muc_gia=Từ 20 triệu đến 30 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 20 TRIỆU ĐẾN 30 TRIỆU",
  },
  {
    id: "muc_gia=Từ 30 triệu đến 50 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 30 TRIỆU ĐẾN 50 TRIỆU",
  },
  {
    id: "muc_gia=Từ 50 triệu đến 100 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TỪ 50 TRIỆU ĐẾN 100 TRIỆU ",
  },
  {
    id: "muc_gia=Trên 100 triệu&gioi_tinh=Đồng Hồ Đôi",
    title: "TRÊN 100 TRIỆU",
  },
];
const locDayNam = [
  { id: "chat_lieu_day=Dây da&gioi_tinh=Nam", title: "Dây da" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L mạ vàng công nghệ PVD&gioi_tinh=Nam",
    title: "Thép không gỉ 316L mạ vàng công nghệ PVD",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lưới&gioi_tinh=Nam",
    title: "Thép không gỉ 316L dạng lưới",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lắc&gioi_tinh=Nam",
    title: "Thép không gỉ 316L dạng lắc",
  },
  { id: "chat_lieu_day=Dây vải&gioi_tinh=Nam", title: "Dây vải" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Vàng 18K&gioi_tinh=Nam",
    title: "Thép không gỉ 316L/ Vàng 18K",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Ceramic&gioi_tinh=Nam",
    title: "Thép không gỉ 316L/ Ceramic",
  },
  { id: "chat_lieu_day=Dây cao su&gioi_tinh=Nam", title: "Dây cao su" },
];
const locDayNu = [
  { id: "chat_lieu_day=Dây da&gioi_tinh=Nữ", title: "Dây da" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L mạ vàng công nghệ PVD&gioi_tinh=Nữ",
    title: "Thép không gỉ 316L mạ vàng công nghệ PVD",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lưới&gioi_tinh=Nữ",
    title: "Thép không gỉ 316L dạng lưới",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lắc&gioi_tinh=Nữ",
    title: "Thép không gỉ 316L dạng lắc",
  },
  { id: "chat_lieu_day=Dây vải&gioi_tinh=Nữ", title: "Dây vải" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Vàng 18K&gioi_tinh=Nữ",
    title: "Thép không gỉ 316L/ Vàng 18K",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Ceramic&gioi_tinh=Nữ",
    title: "Thép không gỉ 316L/ Ceramic",
  },
  { id: "chat_lieu_day=Dây cao su&gioi_tinh=Nữ", title: "Dây cao su" },
];
const locDayDoi = [
  { id: "chat_lieu_day=Dây da&gioi_tinh=Đồng Hồ Đôi", title: "Dây da" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L mạ vàng công nghệ PVD&gioi_tinh=Đồng Hồ Đôi",
    title: "Thép không gỉ 316L mạ vàng công nghệ PVD",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lưới&gioi_tinh=Đồng Hồ Đôi",
    title: "Thép không gỉ 316L dạng lưới",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L dạng lắc&gioi_tinh=Đồng Hồ Đôi",
    title: "Thép không gỉ 316L dạng lắc",
  },
  { id: "chat_lieu_day=Dây vải&gioi_tinh=Đồng Hồ Đôi", title: "Dây vải" },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Vàng 18K&gioi_tinh=Đồng Hồ Đôi",
    title: "Thép không gỉ 316L/ Vàng 18K",
  },
  {
    id: "chat_lieu_day=Thép không gỉ 316L/ Ceramic&gioi_tinh=Đồng Hồ Đôi",
    title: "Thép không gỉ 316L/ Ceramic",
  },
  { id: "chat_lieu_day=Dây cao su&gioi_tinh=Đồng Hồ Đôi", title: "Dây cao su" },
];
const locPhongCachNu = [
  { id: "phong_cach=Sang trọng&gioi_tinh=Nữ", title: "Sang trọng" },
  { id: "phong_cach=Thể thao&gioi_tinh=Nữ", title: "Thể thao" },
  {
    id: "phong_cach=Thể thao sang trọng&gioi_tinh=Nữ",
    title: "Thể thao sang trọng",
  },
  { id: "phong_cach=Quân đội&gioi_tinh=Nữ", title: "quân đội" },
  { id: "phong_cach=Thời trang&gioi_tinh=Nữ", title: "thời trang" },
  { id: "phong_cach=Hiện đại&gioi_tinh=Nữ", title: "hiện đại" },
];
const locPhongCachNam = [
  { id: "phong_cach=Sang trọng&gioi_tinh=Nam", title: "Sang trọng" },
  { id: "phong_cach=Thể thao&gioi_tinh=Nam", title: "Thể thao" },
  {
    id: "phong_cach=Thể thao sang trọng&gioi_tinh=Nam",
    title: "Thể thao sang trọng",
  },
  { id: "phong_cach=Quân đội&gioi_tinh=Nam", title: "quân đội" },
  { id: "phong_cach=Thời trang&gioi_tinh=Nam", title: "thời trang" },
  { id: "phong_cach=Hiện đại&gioi_tinh=Nam", title: "hiện đại" },
];
const locPhongCachDoi = [
  { id: "phong_cach=Sang trọng&gioi_tinh=Đồng Hồ Đôi", title: "Sang trọng" },
  { id: "phong_cach=Thể thao&gioi_tinh=Đồng Hồ Đôi", title: "Thể thao" },
  {
    id: "phong_cach=Thể thao sang trọng&gioi_tinh=Đồng Hồ Đôi",
    title: "Thể thao sang trọng",
  },
  { id: "phong_cach=Quân đội&gioi_tinh=Đồng Hồ Đôi", title: "quân đội" },
  { id: "phong_cach=Thời trang&gioi_tinh=Đồng Hồ Đôi", title: "thời trang" },
  { id: "phong_cach=Hiện đại&gioi_tinh=Đồng Hồ Đôi", title: "hiện đại" },
];
const locttTH = [
  { id: "thuong_hieu=SEIKO", title: "SEIKO" },
  { id: "thuong_hieu=RHYTHM", title: "RHYTHM" },
];
const locttGia = [
  { id: "muc_gia=Dưới 2 triệu", title: "Dưới 2 triệu" },
  { id: "muc_gia=Từ 2 triệu đến 5 triệu", title: "Từ 2 triệu đến 5 triệu" },
  { id: "muc_gia=Trên 5 triệu", title: "Trên 5 triệu" },
];
const locttCL = [
  { id: "chat_lieu_vo=Thủy tinh", title: "Thủy Tinh" },
  { id: "chat_lieu_vo=Nhựa", title: "nhựa" },
  { id: "chat_lieu_vo=Gỗ", title: "gỗ" },
];

export default function Header() {
  const cx = classNames.bind(styles);
  const [category, setCategory] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Thay đổi trạng thái menu respon
  };

  useEffect(() => {
    setIsMounted(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.quyen === 2) {
        fetchUserDetails(decoded._id);
      }
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const handleSearch = (event) => {
    if ((event.type === "click" || event.key === "Enter") && inputData && isMounted) {
      router.push(`/components/layout/search?query=${inputData}`);
      setInputData("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/thuonghieu/allthuonghieu");
        if (!response.ok) {
          throw new Error("Lỗi không thể tải dữ liệu");
        }
        const data = await response.json();
        setCategory(data.th);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // gạch chân menu đang chọn
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu);
  };

  const handleLogoClick = () => {
    setSelectedMenu("HOME");
    localStorage.setItem("selectedMenu", "HOME");
  };

  const handleIconClick = () => {
    setSelectedMenu(null);
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("selectedMenu");
    if (savedMenu) {
      setSelectedMenu(savedMenu);
    }
  }, []);

  // lưu giỏ hàng vào local storage
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      if (savedCartItems) {
        dispatch(setCartItems(savedCartItems));
      }
    }
  }, [dispatch]);
  const cartCount = cartItems.reduce((count, item) => count + Number(item.so_luong), 0);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error:{error}</p>;
  }

  return (
    <>
      <header className={cx("header", "bg-black text-white text-sm py-2 max-h-[80px] overflow-hidden")}>
        <div className={cx("top-bar", "max-w-[1170px] grid grid-cols-12 items-center mx-auto gap-4")}>
          <div
            className={cx(
              "logo",
              "flex lg:col-span-5 lg:justify-self-start col-span-12 justify-self-center flex-col items-center text-center"
            )}
          >
            <Link href="/" onClick={handleLogoClick}>
              <img
                className={cx("img", "mt-[-55px] w-[250px] h-[170px] ml-[-40px]")}
                src="/image/item/icons/logo.png"
                alt="Wristly"
              />
            </Link>
          </div>
          <div
            className={cx(
              "search-bar",
              "mt-[-40px] col-span-2 lg:flex  relative hidden justify-end  items-center bg-[#ffffff24] rounded-full py-1 px-5 max-h-[30px] mr-[-70px]"
            )}
          >
            <input
              value={inputData}
              onChange={(event) => setInputData(event.target.value)}
              type="text"
              onKeyDown={handleSearch}
              placeholder="Bạn muốn tìm ..."
              className={cx("input", "border-none bg-transparent text-white outline-none w-[300px] py-2 text-sm")}
            />
            <button
              type="button"
              className={cx("button", "border-none bg-transparent text-white cursor-pointer")}
              onClick={handleSearch}
              disabled={!inputData}
            >
              <i className="fas fa-search" style={{ color: "white" }}></i>
            </button>
          </div>
          <div className={cx("col-span-1")}></div>
          <div
            className={cx(
              "contact-info",
              "lg:flex hidden col-span-4 justify-self-end items-center max-w-[40%] gap-6 mt-[-50px]"
            )}
          >
            <div className={cx("phone", "flex items-center")}>
              <img
                className={cx("phone-img", "w-[100px] ml-[-130px]")}
                src="/image/item/icons/icon_call.png"
                alt="Phone"
              />
              <span className={cx("phone-span", "text-left text-xs leading-[1.2]")}>
                GỌI NGAY
                <br />
                084.5487.339
              </span>
            </div>

            {user ? (
              <div
                className={cx(
                  "flex items-center justify-center max-w-[30px] border border-white rounded-full relative"
                )}
              >
                <Link href={`/components/components-login/user/${user.user._id}`} onClick={handleIconClick}>
                  <img
                    src={
                      user.user.hinh_anh.startsWith("http")
                        ? user.user.hinh_anh
                        : `http://localhost:5000/images/${user.user.hinh_anh}`
                    }
                    width="200"
                    height="100"
                    style={{
                      display: "inline-block",
                      width: "160px",
                      height: "29px",

                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            ) : (
              <div
                className={cx(
                  "user",
                  "flex items-center justify-center w-[30px] h-[30px] border border-white rounded-full relative"
                )}
              >
                <Link href="/components/components-login/login" onClick={handleIconClick}>
                  <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
                </Link>
              </div>
            )}
            <Link href="/components/components-giaodich/giohang" onClick={handleIconClick}>
              <div className={cx("cart", "flex items-center justify-center w-[30px] h-[30px] rounded-full relative")}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: "#ffffff" }} />

                <span
                  className={cx(
                    "cart-count",
                    "absolute text-white  w-[20px] h-[20px] top-[-5px] right-[-7px] border border-white rounded-full flex items-center justify-center"
                  )}
                >
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>
          <div className="menu-icon absolute top-[20px] right-[20px]  lg:hidden flex overflow-hidden  text-center">
            {user ? (
              <div
                className={cx(
                  "flex items-center justify-center mr-3 w-[30px] h-[30px] border border-white rounded-full"
                )}
              >
                <Link href={`/components/components-login/user/${user.user._id}`} onClick={handleIconClick}>
                  <img
                    src={
                      user.user.hinh_anh.startsWith("http")
                        ? user.user.hinh_anh
                        : `http://localhost:5000/images/${user.user.hinh_anh}`
                    }
                    width="200"
                    height="100"
                    style={{
                      display: "inline-block",
                      width: "160px",
                      height: "29px",

                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            ) : (
              <div
                className={cx(
                  "user",
                  "flex items-center justify-center mr-3 w-[30px] h-[30px] border border-white rounded-full "
                )}
              >
                <Link href="/components/components-login/login" onClick={handleIconClick}>
                  <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
                </Link>
              </div>
            )}
            <Link href="/components/components-giaodich/giohang" onClick={handleIconClick}>
              <div className={cx("cart", "flex  items-center justify-center  w-[30px] h-[30px] rounded-full relative")}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: "#ffffff" }} />

                <span
                  className={cx(
                    "cart-count",
                    "absolute text-white  w-[20px] h-[20px] top-[-5px] right-[-7px] border border-white rounded-full flex items-center justify-center"
                  )}
                >
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>

          <div className="menu-icon fixed top-[20px] left-[10px] w-[30px] h-[30px] lg:hidden block  text-center">
            <img src="/image/item/icons/bars.png" onClick={() => setMenuOpen(!menuOpen)} />
          </div>
          {menuOpen && (
            <div className="mobile-menu absolute top-[70px] uppercase left-0 w-[70%]  bg-[#796752] py-4 z-50">
              <ul className="flex flex-col ml-5 leading-[1.5] space-y-2 mr-5">
                <li>
                  <div className={cx(" mb-5 border border-white  h-12 flex items-center  rounded-full py-1 px-5 ")}>
                    <input
                      value={inputData}
                      onChange={(event) => setInputData(event.target.value)}
                      type="text"
                      onKeyDown={handleSearch}
                      placeholder="Bạn muốn tìm ..."
                      className={cx("input", "border-none bg-transparent w-[80%] text-red outline-none  py-2 text-md")}
                    />
                    <button
                      type="button"
                      className={cx("button", "border-none bg-transparent w-[10%] text-white ml-auto cursor-pointer")}
                      onClick={handleSearch}
                      disabled={!inputData}
                    >
                      <i className="fas fa-search" style={{ color: "white" }}></i>
                    </button>
                  </div>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white  flex-1 px-3" href="/">
                    Trang chủ
                  </Link>
                </li>
                <li className="border border-gray-600   h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-thuonghieu/thuonghieu">
                    Thương hiệu
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-thuonghieu/donghonam">
                    Đồng hồ nam
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-thuonghieu/donghonu">
                    Đồng hồ nữ
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-thuonghieu/donghodoi">
                    Đồng hồ đôi
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link
                    className="text-white  border-gray-600   flex-1 px-3"
                    href="/components/components-danhmuc/donghotreotuong"
                  >
                    Đồng hồ treo tường
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-danhmuc/daydongho">
                    Dây đồng hồ
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/components-danhmuc/sanphamkhac">
                    Sản phẩm khác
                  </Link>
                </li>
                <li className="border border-gray-600  h-12 flex items-center">
                  <Link className="text-white    flex-1 px-3" href="/components/suadongho">
                    Sửa đồng hồ
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <nav class={cx("navbar", " lg:block  hidden")}>
        <ul class={cx("nav-list")}>
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "HOME",
            })}
          >
            <Link href="/" className={cx("nav-list-home")} onClick={() => handleMenuClick("HOME")}>
              {/* Sử dụng cx để kết hợp class từ CSS Modules với các class toàn cục */}
              <i className={cx("nav-list-li-i", "fas", "fa-home")}></i>
            </Link>
          </li>
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "THƯƠNG HIỆU",
            })}
          >
            <Link
              href={"/components/components-thuonghieu/thuonghieu"}
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("THƯƠNG HIỆU")}
            >
              THƯƠNG HIỆU
            </Link>
            <ul className={cx("dropdown-menu")}>
              {category
                .filter((item) => item.thuong_hieu !== "RHYTHM")
                .map((item) => (
                  <li className={cx("dropdown-menu-li")} key={item.thuong_hieu}>
                    <Link
                      href={`/components/components-thuonghieu/chitietthuonghieu/${item.thuong_hieu}`}
                      style={{ color: "white" }}
                    >
                      <img
                        className={cx("dropdown-menu-img")}
                        src={`http://localhost:5000/images/${item.hinh_anh}`}
                        alt=""
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "ĐỒNG HỒ NAM",
            })}
          >
            <Link
              href="/components/components-thuonghieu/donghonam"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("ĐỒNG HỒ NAM")}
            >
              ĐỒNG HỒ NAM
            </Link>
            <ul className={cx("dropdown-menu-dhn")}>
              {/* Danh sách thương hiệu */}
              <li className={cx("dropdown-menu-dhn-li1")}>
                <h3 className={cx("dropdown-menu-dhn-h3")}>THƯƠNG HIỆU</h3>
                <ul className={cx("dropdown-menu-dhn-ul")}>
                  {locTHNam.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Danh sách mức giá */}
              <li className={cx("dropdown-menu-dhn-li1")}>
                <h3 className={cx("dropdown-menu-dhn-h3")}>MỨC GIÁ</h3>
                <ul className={cx("dropdown-menu-dhn-ul")}>
                  {locgiaNam.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Danh sách loại máy */}
              <li className={cx("dropdown-menu-dhn-li1")}>
                <h3 className={cx("dropdown-menu-dhn-h3")}>LOẠI MÁY</h3>
                <ul className={cx("dropdown-menu-dhn-ul")}>
                  {locLoaiMayNam.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Danh sách chất liệu dây */}
              <li className={cx("dropdown-menu-dhnu-li1")}>
                <h3 className={cx("dropdown-menu-dhnu-h3")}>CHẤT LIỆU DÂY</h3>
                <ul className={cx("dropdown-menu-dhnu-ul")}>
                  {locDayNam.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Danh sách phong cách */}
              <li className={cx("dropdown-menu-dhn-li1")}>
                <h3 className={cx("dropdown-menu-dhn-h3")}>PHONG CÁCH</h3>
                <ul className={cx("dropdown-menu-dhn-ul")}>
                  {locPhongCachNam.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/*Đồng hồ nữ */}
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "ĐỒNG HỒ NỮ",
            })}
          >
            <Link
              href="/components/components-thuonghieu/donghonu"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("ĐỒNG HỒ NỮ")}
            >
              ĐỒNG HỒ NỮ
            </Link>
            <ul className={cx("dropdown-menu-dhnu")}>
              <li className={cx("dropdown-menu-dhnu-li1")}>
                <h3 className={cx("dropdown-menu-dhnu-h3")}>THƯƠNG HIỆU</h3>
                <ul className={cx("dropdown-menu-dhnu-ul")}>
                  {locTHNu.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhnu-li1")}>
                <h3 className={cx("dropdown-menu-dhnu-h3")}>MỨC GIÁ</h3>
                <ul className={cx("dropdown-menu-dhnu-ul")}>
                  {locgiaNu.map((item) => (
                    <li key={item.gia} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>LOẠI MÁY</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locLoaiMayNu.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhnu-li1")}>
                <h3 className={cx("dropdown-menu-dhnu-h3")}>CHẤT LIỆU DÂY</h3>
                <ul className={cx("dropdown-menu-dhnu-ul")}>
                  {locDayNu.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhnu-li1")}>
                <h3 className={cx("dropdown-menu-dhnu-h3")}>PHONG CÁCH</h3>
                <ul className={cx("dropdown-menu-dhnu-ul")}>
                  {locPhongCachNu.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/*Đồng hồ đôi*/}
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "ĐỒNG HỒ ĐÔI",
            })}
          >
            <Link
              href="/components/components-thuonghieu/donghodoi"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("ĐỒNG HỒ ĐÔI")}
            >
              ĐỒNG HỒ ĐÔI
            </Link>
            <ul className={cx("dropdown-menu-dhd")}>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>THƯƠNG HIỆU</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locTHDoi.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>MỨC GIÁ</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locgiaDoi.map((item) => (
                    <li key={item.gia} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>LOẠI MÁY</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locLoaiMayDoi.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>CHẤT LIỆU DÂY</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locDayDoi.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhd-li1")}>
                <h3 className={cx("dropdown-menu-dhd-h3")}>PHONG CÁCH</h3>
                <ul className={cx("dropdown-menu-dhd-ul")}>
                  {locPhongCachDoi.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-thuonghieu/locgia?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/*Đồng hồ treo tường*/}
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "ĐỒNG HỒ TREO TƯỜNG",
            })}
          >
            <Link
              href="/components/components-danhmuc/donghotreotuong"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("ĐỒNG HỒ TREO TƯỜNG")}
            >
              ĐỒNG HỒ TREO TƯỜNG
            </Link>
            <ul className={cx("dropdown-menu-dhtt")}>
              <li className={cx("dropdown-menu-dhtt-li1")}>
                <h3 className={cx("dropdown-menu-dhtt-h3")}>THƯƠNG HIỆU</h3>
                <ul className={cx("dropdown-menu-dhtt-ul")}>
                  {locttTH.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-danhmuc/loctreotuong?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhtt-li1")}>
                <h3 className={cx("dropdown-menu-dhtt-h3")}>MỨC GIÁ</h3>
                <ul className={cx("dropdown-menu-dhtt-ul")}>
                  {locttGia.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-danhmuc/loctreotuong?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={cx("dropdown-menu-dhtt-li1")}>
                <h3 className={cx("dropdown-menu-dhtt-h3")}>VỎ MÁY</h3>
                <ul className={cx("dropdown-menu-dhtt-ul")}>
                  {locttCL.map((item) => (
                    <li key={item.id} className={cx("dropdown-menu-dhn-li2")}>
                      <Link
                        href={`/components/components-danhmuc/loctreotuong?query=${encodeURIComponent(item.id)}`}
                        className={cx("cxcx")}
                        style={{ textTransform: "uppercase" }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "DÂY ĐỒNG HỒ",
            })}
          >
            <Link
              href="/components/components-danhmuc/daydongho"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("DÂY ĐỒNG HỒ")}
            >
              DÂY ĐỒNG HỒ
            </Link>
          </li>
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "SẢN PHẨM KHÁC",
            })}
          >
            <Link
              href="/components/components-danhmuc/sanphamkhac"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("SẢN PHẨM KHÁC")}
            >
              SẢN PHẨM KHÁC
            </Link>
            <ul className={cx("dropdown-menu-doc")}>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-thuonghieu/donghothuysi" className={cx("dropdown-menu-doc-a")}>
                  ĐỒNG HỒ THỤY SĨ
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-thuonghieu/donghonhatban" className={cx("dropdown-menu-doc-a")}>
                  ĐỒNG HỒ NHẬT BẢN
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-danhmuc/daydongho" className={cx("dropdown-menu-doc-a")}>
                  DÂY TREO ĐỒNG HỒ
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-danhmuc/trangsucCK" className={cx("dropdown-menu-doc-a")}>
                  TRANG SỨC CALVIN KLEIN
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-danhmuc/trangsucDW" className={cx("dropdown-menu-doc-a")}>
                  TRANG SỨC DW
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-danhmuc/donghobaothuc" className={cx("dropdown-menu-doc-a")}>
                  ĐỒNG HỒ BÁO THỨC
                </Link>
              </li>
              <li className={cx("dropdown-menu-doc-li")}>
                <Link href="/components/components-danhmuc/donghodeban" className={cx("dropdown-menu-doc-a")}>
                  ĐỒNG HỒ ĐỂ BÀN
                </Link>
              </li>
            </ul>
          </li>
          <li
            className={cx("nav-list-li", {
              active: selectedMenu === "SỬA ĐỒNG HỒ",
            })}
          >
            <Link
              href="/components/suadongho"
              className={cx("nav-list-li-a")}
              onClick={() => handleMenuClick("SỬA ĐỒNG HỒ")}
            >
              SỬA ĐỒNG HỒ
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
