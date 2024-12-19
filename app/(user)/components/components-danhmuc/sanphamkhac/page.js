import Link from "next/link";
import styles from "../sanphamkhac/sanphamkhac.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Sanphamkhac() {
  return (
    <>
      <div className="container">
        <div className={styles["container"]}>
          <div id="main-container" className={styles["mt20"]}>
            <div className={styles["main-column"]}>
              <div className={styles["center-1col"]}>
                <div className={styles["menu-home"]}>
                  <div
                          className={cx(
                            
                            "flex",
                            "items-center uppercase mb-5 mt-5"
                          )}
                        >
                          <span className={cx( "text-sm")}>
                            <Link
                              href="/"
                              className={cx(
                                
                                " text-gray-800",
                                "hover:text-[#796752]"
                              )}
                            >
                              Trang chủ
                            </Link>
                          </span>
                          <span className={cx("separator", "mx-3", "text-stone-400")}>
                            {" "}
                            &gt;{" "}
                          </span>
                          
                          
                          <span className={cx( "text-sm", "text-red-500")}>
                            <Link
                              href="/components/components-danhmuc/sanphamkhac"
                              className={cx("link", "text-red-500")}
                            >
                              SẢn phẩm khác
                              
                            </Link>
                          </span>
                        </div>
                  <h1 className={styles["title-page-menu"]}>
                    <span>Sản phẩm khác</span>
                  </h1>
                  <div
                    className={`${styles["all-menu-other"]} flex flex-wrap phone-sm:grid phone-sm: grid-cols-2`}>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px]  mx-4 mb-8  md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          className="w-auto "
                          href={
                            "/components/components-thuonghieu/donghothuysi"
                          }>
                          ĐỒNG HỒ THỤY SĨ
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-thuonghieu/donghothuysi"}
                        title="ĐỒNG HỒ THỤY SĨ">
                        <img
                          className={styles.lazy}
                          alt="ĐỒNG HỒ THỤY SĨ"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-donghothuysi.webp"
                          srcSet="/image/item/sanphamkhac-donghothuysi.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          href={
                            "/components/components-thuonghieu/donghonhatban"
                          }>
                          ĐỒNG HỒ NHẬT BẢN
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-thuonghieu/donghonhatban"}
                        title="ĐỒNG HỒ NHẬT BẢN">
                        <img
                          className={styles.lazy}
                          alt="ĐỒNG HỒ NHẬT BẢN"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-donghonhatban.webp"
                          srcSet="/image/item/sanphamkhac-donghonhatban.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          href={"/components/components-danhmuc/trangsucDW"}>
                          TRANG SỨC DW
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-danhmuc/trangsucDW"}
                        title="TRANG SỨC DW">
                        <img
                          className={styles.lazy}
                          alt="TRANG SỨC DW"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-trangsucDW.webp"
                          srcSet="/image/item/sanphamkhac-trangsucDW.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link href={"/components/components-danhmuc/daydongho"}>
                          DÂY ĐEO ĐỒNG HỒ
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-danhmuc/daydongho"}
                        title="DÂY ĐEO ĐỒNG HỒ">
                        <img
                          className={styles.lazy}
                          alt="DÂY ĐEO ĐỒNG HỒ"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-daydeodongho.webp"
                          srcSet="/image/item/sanphamkhac-daydeodongho.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          href={"/components/components-danhmuc/donghodeban"}>
                          ĐỒNG HỒ ĐỂ BÀN
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-danhmuc/donghodeban"}
                        title="ĐỒNG HỒ ĐỂ BÀN">
                        <img
                          className={styles.lazy}
                          alt="ĐỒNG HỒ ĐỂ BÀN"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-donghodeban.webp"
                          srcSet="/image/item/sanphamkhac-donghodeban.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          href={"/components/components-danhmuc/donghobaothuc"}>
                          ĐỒNG HỒ BÁO THỨC
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-danhmuc/donghobaothuc"}
                        title="ĐỒNG HỒ BÁO THỨC">
                        <img
                          className={styles.lazy}
                          alt="ĐỒNG HỒ BÁO THỨC"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-donghobaothuc.webp"
                          srcSet="/image/item/sanphamkhac-donghobaothuc.webp"
                        />
                      </Link>
                    </div>
                    <div
                      className={`${styles["item"]}lg:w-calc phone-sm:p-[10px] mx-4 mb-8   md:mx-auto`}>
                      <h3
                        className={`${styles["name"]} text-[18px] phone-sm:text-[14px] sm:text-[14px] md:text-[16px]`}>
                        <Link
                          href={"/components/components-danhmuc/trangsucCK"}>
                          TRANG SỨC CALVIN KLEIN
                        </Link>
                      </h3>
                      <Link
                        href={"/components/components-danhmuc/trangsucCK"}
                        title="TRANG SỨC CALVIN KLEIN">
                        <img
                          className={styles.lazy}
                          alt="TRANG SỨC CALVIN KLEIN"
                          width="370"
                          height="196"
                          style={{ display: "inline-block", opacity: "1" }}
                          src="/image/item/sanphamkhac-trangsucCalvinKlein.webp"
                          srcSet="/image/item/sanphamkhac-trangsucCalvinKlein.webp"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.clear}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
