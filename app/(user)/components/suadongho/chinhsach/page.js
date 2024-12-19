import Link from "next/link";
export default function chinhsach() {
  return (
    <nav className="lg:max-w-[1170px] md:max-w-[738px] sm:max-w-[357px] lg:ml-[10%] lg:mr-[10%] text-[14px] lg:text-[18px]">
      <div className="lg:flex w-full h-full">
        <div className="lg:w-3/4 p-1 w-[90%] mr-[5%] ml-[5%]">
        <div
        className={(
          "flex",
          "items-center uppercase  md:text-[16px] text-[10px] mb-5 mt-6"
        )}
      >
        <span className={("")}>
          <Link
            href="/"
            className={(" text-gray-800", "hover:text-[#796752]")}
          >
            Trang chủ
          </Link>
        </span>  
        <span className={("separator", "mx-3", "text-stone-400")}>
          {" "}
          &gt;{" "}
        </span>
  
        <span className={("", "text-red-500")}>
          <Link
            href="/components/components-thuonghieu/donghonam"
            className={("link", "text-red-500")}
          >
            {" "}
            CHÍNH SÁCH BẢO HÀNH
          </Link>
        </span>
      </div>
          <p className="text-center text-[18px] lg:text-2xl ml-5 mt-5">
            CHÍNH SÁCH BẢO HÀNH
          </p>
          <div className="flex w-auto border-b border-[#ddd]">
            <div className="flex mr-[5px]">
              <i className="fa-solid fa-star" style={{ color: "orange" }}></i>
              <i className="fa-solid fa-star" style={{ color: "orange" }}></i>
              <i className="fa-solid fa-star" style={{ color: "orange" }}></i>
              <i className="fa-solid fa-star" style={{ color: "orange" }}></i>
              <i className="fa-solid fa-star" style={{ color: "orange" }}></i>
            </div>
            <p className="mt-[-0.25px] ml-3.75">12/10/2024</p>
          </div>
          <br />
          <p className="mb-[10px] ">
            <strong>
              Theo chính sách bảo hành của các hãng đồng hồ, tất cả các đồng hồ
              chính hãng bán ra đều kèm theo 01 thẻ/ sổ/ giấy bảo hành chính
              hãng (Quốc tế) có giá trị bảo hành theo thời gian qui định của
              từng hãng đồng hồ khác nhau. Mỗi thẻ/ sổ/ giấy bảo hành chỉ được
              phát hành kèm theo mỗi chiếc đồng hồ bán ra một lần duy nhất và
              không cấp lại dưới bất kỳ hình thức nào.
            </strong>
          </p>
          <nav className="mt-[30px]mb-[30px] border border-[#ddd] p-5 relative">
            <h3 className="absolute mt-[-8.75px] left-1/2 transform -translate-x-1/2 bg-white px-2.5">
              NỘI DUNG BÀI VIẾT
            </h3>
            <ul className="list-none mt-5">
              <li className="mb-2.5">
                <a
                  href="#section1"
                  className="no-underline text-[#55554d] hover:underline">
                  I. BẢO HÀNH CHÍNH HÃNG (BẢO HÀNH QUỐC TẾ)
                </a>
              </li>
              <li className="mb-2.5">
                <a
                  href="#section2"
                  className="no-underline text-[#55554d] hover:underline">
                  II. CHÍNH SÁCH BẢO HÀNH RIÊNG CỦA ĐỒNG HỒ WRISTLY
                </a>
              </li>
            </ul>
          </nav>
          <img
            src="/image/banner/chinhsach1.jpg"
            alt="anh"
            srcset=""
            width="901px"
          />
          <p className="mb-2.5 text-justify leading-relaxed hyphens-auto">
            Theo chính sách bảo hành của các hãng đồng hồ, tất cả các đồng hồ
            chính hãng bán ra đều kèm theo 01 thẻ/ sổ/ giấy bảo hành chính hãng
            (Quốc tế) có giá trị bảo hành theo thời gian qui định của từng hãng
            đồng hồ khác nhau. <br />
            Mỗi thẻ/ sổ/ giấy bảo hành chỉ được phát hành kèm theo mỗi chiếc
            đồng hồ bán ra một lần duy nhất và không cấp lại dưới bất kỳ hình
            thức nào
          </p>
          <section id="section1">
            <p className="mb-2.5 text-[#333] mt-[10px]">
              I. BẢO HÀNH CHÍNH HÃNG (BẢO HÀNH QUỐC TẾ)
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto">
              Bảo hành Chính hãng (hầu hết là Bảo hành quốc tế) là chế độ Bảo
              hành do nhà sản xuất (hãng đồng hồ) cung cấp cho tất cả sản phẩm
              do chính họ sản xuất (sản phẩm chính hãng). Khi Quý khách mua đồng
              hồ chính hãng thì đồng hồ sẽ luôn đi kèm theo chế độ này (biểu thị
              bằng sổ/thẻ/giấy/... do nhà sản xuất cung cấp). Đồng hồ có Bảo
              hành chính hãng sẽ được đảm bảo những quyền lợi sau:
              <br />
              <br />
              1. Được tiếp nhận Bảo hành theo quy định của nhà sản xuất tại các
              Trung tâm Bảo hành chính hãng và hệ thống Đại lý Chính thức nơi
              Quý khách mua hàng. Ví dụ: Quý khách mua đồng hồ Tissot tại
              WRISTLY Watch thì sẽ được tiếp nhận bảo hành tại WRISTLY Watch và
              các Trung tâm Bảo hành chính hãng của Tissot.
              <br />
              <br />
              2. Được đặt mua các linh kiện, phụ kiện chính hãng (máy, chi tiết
              máy, dây, khóa, kính,...) theo quy định của từng hãng (ngay cả khi
              đã hết thời hạn bảo hành). Các hãng có quyền từ chối bán các linh
              kiện phụ kiện chính hãng nếu sản phẩm của Quý Khách không có bảo
              hành chính hãng với mục đích phòng chống hàng giả, hàng nhái, hàng
              dựng nhằm bảo vệ uy tín chung của thương hiệu và toàn thể khách
              hàng tin dùng sản phẩm của thương hiệu đó.
              <br />
              <br />
              3. Bảo hành chính hãng là minh chứng cho tính chính hãng của sản
              phẩm. Hãng không bảo hành cho hàng giả nên sản phẩm có bảo hành
              chính hãng chắc chắn là sản phẩm chính hãng. Đây là đặc điểm cơ
              bản, đơn giản nhất và chính xác tuyệt đối để phân biệt đồng hồ
              chính hãng trong bối cảnh hàng giả ngày càng tinh vi
              <br />- Bảo hành chỉ có giá trị khi đồng hồ có thẻ/ sổ/ giấy bảo
              hành chính thức đi kèm. Thẻ/ sổ/ giấy bảo hành phải được ghi đầy
              đủ và chính xác các thông tin như: Mã số đồng hồ, mã đáy đồng hồ
              (nếu có), địa chỉ bán, ngày mua hàng, ....Thẻ/ sổ/ giấy bảo hành
              phải được đóng dấu của Đại lý ủy quyền chính thức hoặc Cửa hàng
              bán ra.
              <br />- Thời gian bảo hành của đồng hồ được tính kể từ ngày mua
              ghi trên thẻ/ sổ/ giấy bảo hành và không được gia hạn sau khi hết
              thời hạn bảo hành. Cụ thể như sau:
              <br />+ Thời hạn bảo hành theo tiêu chuẩn Quốc tế của các hãng
              Đồng hồ Nhật Bản là 1 năm (riêng đối với đồng hồ Orient Star là 2
              năm). Bao gồm các thương hiệu: Seiko, Citizen, Orient, Casio
              (riêng dòng sản phẩm G-Shock bảo hành 5 năm quốc tế, các sản phẩm
              khác Bảo hành chính hãng 1 năm chính hãng toàn quốc)
              <br />+ Thời hạn bảo hành theo tiêu chuẩn Quốc tế của các hãng
              Đồng hồ Thụy Sỹ là 2 năm (riêng đối với dòng máy Chronometer của
              Tissot là 3 năm, Mido là 5 năm, dòng máy Automatic của Longines là
              5 năm). Bao gồm các thương hiệu: Longines, Mido, Tissot, Hamilton,
              Certina, Calvin Klein, Frederique Constant, Claude Bernard,
              Rotary, Charriol, Candino
              <br />+ Các thương hiệu khác có chế độ bảo hành riêng như sau: 2
              năm đối với thương hiệu Daniel Wellington, Olympia Star, Olym
              Pianus và bảo hành máy trọn đời đối với thương hiệu Skagen.
              <br />- Chỉ bảo hành miễn phí cho trường hợp hư hỏng về máy và các
              linh kiện bên trong của đồng hồ khi được xác định là do lỗi của
              nhà sản xuất.
              <br />- Chỉ bảo hành, sửa chữa hoặc thay thế mới cho các linh kiện
              bên trong đồng hồ. Không thay thế hoặc đổi bằng 1 chiếc đồng hồ
              khác.
              <br />
              <br />
              <strong>
                Lưu ý: Giấy tờ bảo hành chính hãng và bảo hành mở rộng của
                WRISTLY là căn cứ để hãng và WRISTLY cung cấp chế độ bảo hành
                cho khách hàng. Quý khách vui lòng lưu trữ cẩn thận và đầy đủ
                các giấy tờ theo quy định của WRISTLY và các hãng để đảm bảo
                quyền lợi bảo hành một cách đầy đủ WRISTLY và các hãng có quyền
                từ chối cung cấp chế độ/dịch vụ bảo hành cho Quý khách nếu Quý
                khách không cung cấp đủ các giấy tờ liên quan.
              </strong>
            </p>
          </section>

          <section id="section2">
            <p className="mb-2.5 text-[#333] mt-[10px]">
              II. CHÍNH SÁCH BẢO HÀNH RIÊNG CỦA ĐỒNG HỒ WRISTLY
            </p>
            <img
              src="/image/banner/chinhsach2.jpg"
              alt="anh"
              srcset=""
              width="901px"
            />
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto">
              Bắt đầu từ ngày 01/09/2018, khi mua đồng hồ tại WRISTLY (trừ đồng
              hồ treo tường, đồng hồ để bàn), Quý khách còn nhận được các chính
              sách bảo hành khác, cụ thể như sau:
              <br />+ Bảo hành máy đồng hồ trong thời hạn 5 năm kể từ ngày mua
              hàng: miễn phí công lắp đặt, sửa chữa, kiểm tra chống nước, căn
              chỉnh nhanh chậm, giao trả đồng hồ bảo hành,…
              <br />+ Miễn phí thay linh kiện lần đầu tiên và giảm 50% cho các
              lần thay kế tiếp <br />+ Miễn phí lau dầu, bảo dưỡng 5 năm đối với
              đồng hồ cơ (trừ các dòng đồng hồ Kinetic, Auto Quartz, Hybrid -
              đồng hồ thông minh máy cơ)
              <br />+ Miễn phí thay pin trọn đời đối với đồng hồ pin (ngoại trừ
              các dòng đồng hồ Eco-Drive, Solar, Kinetic, Auto Quartz, đồng hồ
              thông minh)
              <br />+ Miễn phí đánh bóng kính cứng đồng hồ trong vòng 06 tháng
              kể từ ngày mua
              <br />+ Tặng ngay 01 dây da ZRC (trị giá 500.000 VNĐ) nếu dây da
              nguyên bản bị hỏng trong vòng 06 tháng(Áp dụng cho đồng hồ có giá
              niêm yết từ 5.000.000VNĐ trở lên).
            </p>
            <strong>Lưu ý:</strong>
            <br />
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto">
              <strong>
                - Chế độ bảo hành mở rộng này đi kèm giấy bảo hành do Đồng hồ
                WRISTLY cấp khi Quý khách mua hàng. Quý khách vui lòng bảo quản
                các giấy tờ liên quan và cung cấp cho WRISTLY khi có nhu cầu sử
                dụng ưu đãi. WRISTLY có quyền từ chối cung cấp dịch vụ ưu đãi
                theo cam kết nếu khách hàng không cung cấp được các giấy tờ liên
                quan.
              </strong>
              <br />

              <strong>
                - Một số sản phẩm sẽ được áp dụng chính sách bảo hành riêng tùy
                từng thời điểm.
              </strong>
            </p>
          </section>
        </div>

        <div className="w-1/4 p-2.5 mr-[5%] ml-[5%]">
          <ul className="mt-[50px] list-none">
            <li className="w-[200px] py-2.5 border-b border-[#ddd] cursor-pointer hover:bg-[#f0f0f0]">
              <Link href={"/components/suadongho/gioithieu"}>GIỚI THIỆU</Link>
            </li>
            <li className="w-[200px] py-2.5 border-b border-[#ddd] cursor-pointer hover:bg-[#f0f0f0]">
              <Link href={"/components/suadongho/chinhsach"}>
                CHÍNH SÁCH BẢO HÀNH
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
