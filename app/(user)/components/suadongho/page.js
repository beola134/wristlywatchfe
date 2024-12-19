import Link from "next/link";

export default function suadongho() {
  return (
    <nav className="lg:max-w-[1170px] md:max-w-[738px] sm:max-w-[357px] lg:ml-[10%] lg:mr-[10%] text-[14px] lg:text-[18px]">
      <div className="lg:flex w-full  h-full">
        <div className="lg:w-3/4 p-1 w-[90%] mr-[5%] ml-[5%]">
          <div className={("flex", "items-center uppercase  md:text-[16px] text-[10px] mb-5 mt-6")}>
            <span className={""}>
              <Link href="/" className={(" text-gray-800", "hover:text-[#796752]")}>
                Trang chủ
              </Link>
            </span>
            <span className={("separator", "mx-3", "text-stone-400")}> &gt; </span>

            <span className={("", "text-red-500")}>
              <Link href="/components/components-thuonghieu/donghonam" className={("link", "text-red-500")}>
                {" "}
                SỬA ĐỒNG HỒ
              </Link>
            </span>
          </div>
          <p className="text-center text-[18px] lg:text-2xl ml-5 mt-5 mb-5">DỊCH VỤ SỬA CHỮA ĐỒNG HỒ</p>
          <br />
          <nav className="mt-7.5 mb-[30px] border border-[#ddd] p-5 relative">
            <h3 className="absolute mt-[-8.75px] left-1/2 transform -translate-x-1/2 bg-white px-2.5 ">
              NỘI DUNG BÀI VIẾT
            </h3>
            <ul className="list-none mt-5">
              <li className="mb-2.5">
                <a href="#section1" className="no-underline text-[#55554d] mb-1 ">
                  1. THAY PIN
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section2" className="no-underline text-[#55554d] mb-1 ">
                  2. THAY DÂY ĐỒNG HỒ
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section3" className="no-underline text-[#55554d] mb-1 ">
                  3. LAU DẦU
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section4" className="no-underline text-[#55554d] mb-1  ">
                  4. XỬ LÝ ĐỒNG HỒ BỊ VÀO NƯỚC
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section5" className="no-underline text-[#55554d] mb-1 ">
                  5. THAY KÍNH
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section6" className="no-underline text-[#55554d] mb-1 ">
                  6. ĐÁNH BÓNG DÂY, VỎ, KÍNH
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section7" className="no-underline text-[#55554d] mb-1 ">
                  7. CĂN CHỈNH ĐỘ SAI SỐ ĐỒNG HỒ CƠ
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section8" className="no-underline text-[#55554d] mb-1 ">
                  8.QUY TRÌNH BẢO HÀNH
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#section9" className="no-underline text-[#55554d] mb-1 ">
                  9. ĐỊA CHỈ
                </a>
              </li>
            </ul>
          </nav>
          <img src="/image/item/Untitled-3(2).jpg" alt="" srcset="" width="901px" />
          <section id="section1">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">1. THAY PIN</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Vì sao cần chú ý đến pin của đồng hồ? Mặc dù hiện nay pin đồng hồ được chế tạo tốt nhưng khi pin đã hết để
              quá lâu trong đồng hồ, nó có thể bị gỉ và gây hư hại cho những bộ phận khác của đồng hồ. Để tránh những
              hỏng hóc không mong muốn làm ảnh hưởng đến đồng hồ, hãy luôn chú ý đến thời điểm phải thay pin cho đồng
              hồ.
            </p>
            <img src="/image/item/Untitled-5.jpg" alt="" srcset="" width="901px" />
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Trung tâm bảo hành Wristly hỗ trợ thay pin Nhật và pin Thụy Sĩ mới cho khách hàng đúng theo tiêu chuẩn
              chính hãng và với mức giá tùy theo các sản phẩm. Đặc biệt, với những khách hàng đã mua đồng hồ tại
              Wristly, chúng tôi áp dụng chính sách “Thay pin miễn phí trọn đời” cho sản phẩm của quý khách.
            </p>
          </section>

          <section id="section2">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">2. THAY DÂY ĐỒNG HỒ</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Nhằm phục vụ những phong cách thời trang đa dạng cũng như sở thích của tối đa khách hành, Wristly Watch hỗ
              trợ dịch vụ thay thế dây đồng hồ từ dây da sang dây kim loại, từ dây kim loại sang dây da, cắt mắt dây kim
              loại, …. Chúng tôi hỗ trợ cung cấp các sản phẩm chính hãng được đặt hàng từ các thương hiệu đồng hồ hàng
              đầu thế giới, cùng với đó cũng cung cấp một số sản phẩm đến từ các nhà sản xuất dây đồng hồ nổi tiếng.
            </p>
            <img src="/image/item/Untitled-6.jpg" alt="" srcset="" width="901px" />
          </section>

          <section id="section3">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">3. LAU DẦU</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Trong các mẫu đồng hồ cơ, ngoài việc vệ sinh đồng hồ thì lau dầu cũng là một trong những công việc quan
              trọng để giữ cho đồng hồ có tuổi thọ lâu dài và hoạt động chính xác, trơn tru hơn. Dù là việc làm quan
              trọng nhưng lau dầu lại thường bị người dùng bỏ qua, nên đôi khi sử dụng đồng hồ mà người dùng lại không
              biết lí do vì sao đồng hồ của mình bị hỏng, chạy chậm hơn so với bình thường. Đối với đồng hồ pin, việc
              lau dầu sẽ tùy thuộc vào thời gian sử dụng và tình trạng của máy đồng hồ. Nhưng đối với đồng hồ cơ, đây là
              một quy trình vô cùng quan trọng. Đồng hồ cơ thường phải được lau dầu toàn bộ từ 3 hoặc 5 năm, tùy thuộc
              vào thông số kỹ thuật bộ máy của từng thương hiệu.
            </p>
            <img src="/image/item/laudau.jpg" alt="" srcset="" width="901px" />
          </section>

          <section id="section4">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">4. XỬ LÝ ĐỒNG HỒ BỊ VÀO NƯỚC</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Có thể nói rằng vấn đề đồng hồ vào nước luôn là vần đề mà rất nhiều người quan tâm. Mọi đồng hồ (bao gồm
              cả đồng hồ chính hãng) đều có nguy cơ bị vào nước nếu như khách hàng không chú ý trong quá trình sử dụng.
              Để hỗ trợ khách hàng, Trung tâm bảo hành Wristly hỗ trợ xử lí các trường hợp đồng hồ bị vào nước. Hãy
              nhanh chóng mang đồng hồ của bạn đến những trung tâm bảo hành uy tín để tránh tối đa thiệt hại do nước gây
              lên những linh kiên bên trong đồng hồ.
            </p>
          </section>
          <section id="section5">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">5. THAY KÍNH</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Nhiệm vụ chính của kính đồng hồ chính là bảo vệ cho mặt số và giúp cho người dùng có cái nhìn dễ dàng nhất
              khi theo dõi thời gian. Tuy nhiên, những rắc rối gặp phải khi mặt kính bị nứt vỡ cũng có thể gây ra ảnh
              hưởng nghiêm trọng cho bộ máy hoặc mặt số. Nếu bạn gặp phải những vấn đề về mặt kính đồng hồ của mình, hãy
              mang chúng đến với Đồng hồ Wristly để nhận được những hỗ trợ kĩ thuật cần thiết với mức giá hợp lí.
            </p>
          </section>
          <section id="section6">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">6. ĐÁNH BÓNG DÂY, VỎ, KÍNH</p>

            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Sau một thời gian dài sử dụng, phần dây kim loại, vỏ và mặt đồng hồ dù chất lượng tốt đến đâu cũng đều có
              thể sẽ bị trầy xước. Đây là kết quả của sự hao mòn cơ học. Nhằm cung cấp một quy trình hoàn chỉnh làm mới
              cho vỏ, mặt kính cũng như dây đeo của đồng hồ, Trung tâm bảo hành Wristly cung cấp dịch vụ đánh bóng dây
              đeo, vỏ và mặt kính đồng hồ.
            </p>
          </section>
          <section id="section7">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">7. CĂN CHỈNH ĐỘ SAI SỐ ĐỒNG HỒ CƠ</p>

            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Đồng hồ cơ với những chi tiết máy móc phức tạp và độ tinh xảo cao luôn nhận được sự ưu ái của những người
              yêu thích đồng hồ. Mỗi một cỗ máy đồng hồ cơ đều có một mức sai số nhất định, được nhà sản xuất đưa ra
              trong thông số kĩ thuật. Nếu như mức sai số trên đồng hồ của bạn không giống với thông số kĩ thuật mà hãng
              đưa ra thì quý khách có thể mang sản phẩm đến Trung tâm bảo hành Wristly để được kiểm tra.
            </p>
          </section>
          <section id="section8">
            <p className="mb-2.5 text-[#333] mt-[10px] text-[#2e74b5] font-bold">8.QUY TRÌNH BẢO HÀNH</p>

            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Những sản phẩm đồng hồ bảo hành mà quý khách mang đến Trung tâm bảo hành Wristly sẽ được thao tác qua các
              bước sau đây:
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 1:Nhận dạng nguồn gốc của thương hiệu trên đồng hồ. Chúng tôi chỉ nhận bảo hành, sửa chữa các sản
              phẩm đồng hồ chính hãng (do thương hiệu cung cấp có đầy đủ giấy tờ hoặc mua tại Đồng hồ Wristly)
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 2: Kiểm tra chi tiết tình trạng đồng hồ Nhận dạng các yếu tố bên ngoài đồng hồ như: dây đeo, vỏ đồng
              hồ, mặt số và kim. Còn đối với các linh kiện bên trong, bộ phận kỹ thuật sẽ tiếp nhận và kiểm tra chi tiết
              cho khách hàng. Nhân viên tiếp nhận sẽ báo với quý khách về tình trạng đồng hồ và các biện pháp xử lí cần
              thiết nếu có vấn đề phát sinh.
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 3: Viết biên nhận Trung tâm bảo hành Wristly sẽ ghi lại chi tiết Tên thương hiệu, mã số, số máy của
              đồng hồ, đặc điểm nhận dạng cơ bản bên ngoài, tình trạng máy và các công việc cần thực hiện vào biên nhận.
              Tùy vào trường hợp có thể sửa đồng hồ ngay hoặc để lại từ 1 đến 7 ngày vì phụ thuộc vào sự phức tạp của
              mỗi đồng hồ và kỹ thuật cần thời gian để kiểm tra cân chỉnh độ chính xác của đồng hồ trước khi giao cho
              khách hàng.
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 4: Vệ sinh dây vỏ bên ngoài, sau đó làm khô
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 5: Tháo rời các bộ phận Bộ phận kỹ thuật tiến hành tháo rời các bộ phận bên ngoài đồng hồ.
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto">
              Bước 6: Tháo kim và mặt số để trong hộp riêng biệt. Và tháo rời các linh kiện trong máy đồng hồ.
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 7: Các linh kiện của máy đồng hồ sẽ được vệ sinh bằng dung dịch đặc biệt để loại bỏ hoàn toàn dầu cũ,
              sau đó lau dầu mới để hỗ trợ khả năng hoạt động của bộ máy và lắp đặt cỗ máy hoàn chỉnh như ban đầu
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 8: Kiểm tra tất cả các hệ thống gioăng cao su, kính, niềng, ti nút ống, nắp đáy, các nút bấm (nếu
              có), … trên đồng hồ
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 9: Lắp kim và mặt số, đóng nắp đáy phía dưới Bước 10: Kiểm tra độ chịu nước và sai số của đồng hồ
            </p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Bước 10: Hoàn thành kiểm tra tổng thể đồng hồ trước khi giao trả lại cho khách hàng Ngoài ra, với mỗi một
              vấn đề khác nhau mà khách hàng gặp phải, chúng tôi cũng đưa ra những quy trình phù hợp để hỗ trợ tối đa
              cho vấn đề của Quý khách.
            </p>
          </section>
          <section id="section9">
            <p className="mb-2.5 text-[#333] mt-[10px]">9. ĐỊA CHỈ</p>
            <p className="mb-2.5 text-justify leading-relaxed hyphens-auto text-[16px]">
              Liên hệ với chúng tôi qua số điện thoại hoặc email để được hỗ trợ tốt nhất.
            </p>
          </section>
        </div>

        <div className="w-1/4 p-2.5 mr-[5%] ml-[5%]">
          <ul className="mt-[50px] list-none">
            <li className="w-[200px] py-2.5 border-b border-[#ddd] cursor-pointer hover:bg-[#f0f0f0] text-[14px]">
              <Link href={"/components/suadongho/gioithieu"}>GIỚI THIỆU</Link>
            </li>
            <li className="w-[200px] py-2.5 border-b border-[#ddd] cursor-pointer hover:bg-[#f0f0f0] text-[14px]">
              <Link href={"/components/suadongho/chinhsach"}>CHÍNH SÁCH BẢO HÀNH</Link>
            </li>
            <li className="w-[200px] py-2.5 border-b border-[#ddd] cursor-pointer hover:bg-[#f0f0f0] text-[14px]">
              <Link href={"/components/suadongho/chinhsach"}>DỊCH VỤ SỬA CHỮA ĐỒNG HỒ</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
