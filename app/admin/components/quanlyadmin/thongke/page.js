'use client'
import styles from "./thongke.module.css";
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
const cx = classNames.bind(styles);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function AdminStatistics() {
  const [doanhthuTheoThoiGian, setDoanhthuTheoThoiGian] = useState([]);
  const [period, setPeriod] = useState('month'); // Added state for period
  const [spbanchay, setspbanchay]= useState([]);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`http://localhost:5000/thongke/getTotalRevenueByTime?period=${period}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoanhthuTheoThoiGian(data.doanhThuDonHangTheo); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [period]);  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTopProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setspbanchay(data.topProducts); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  const labels2 = spbanchay.map(product => product.ten_san_pham);
  const data2 = spbanchay.map(product => parseInt(product.total));


  const labelsDoanhThu = doanhthuTheoThoiGian.map(item => {
    switch (period) {
      case 'day':
        return `Ngày ${item.day}`;
      case 'month':
        return `Tháng ${item.month}`;
      case 'year':
        return `Năm ${item.year}`;
      default:
        return '';
    }
  });
  const dataDoanhThu = doanhthuTheoThoiGian.map(item => item.totalRevenue);

  const chartDataDoanhThu = {
    labels: labelsDoanhThu,
    datasets: [
      {
        label: `Doanh thu ${period}`,
        data: dataDoanhThu,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };
  
  const chartOptions2 = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };
  const chartData2 = {
  labels: labels2,
  datasets: [
    {
      label: 'Top 5 Sản Phẩm Bán Chạy',
      data: data2,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
  ],
};
  //fect dữ liệu
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [donHangs, setDonhangs] = useState([]);
  const [tongDoanhThu, setTongDoanhThu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNew, setUsernew] = useState([]);
  const [oder, setOder] = useState([]);
  const [showInterfaces, setShowInterfaces] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getAllOrdersWithUserDetails');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOder(data.orders); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getNewUsersToday');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsernew(data.usersToday); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTotalProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.getTotalProducts); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/thongke/getTotalUsersInWeek"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductsCount(data.totalUsersInWeek);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []); 
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTotalThuonghieu');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data.totalThuonghieu); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTotalUsers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.totalUsers); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTotalDonHang');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDonhangs(data.totalOrders); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/thongke/getTotalRevenue');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTongDoanhThu(data.doanhThu); 
        setLoading(false); 
      } catch (error) {
        setError(error.message); 
        setLoading(false);
      }
    };
    fetchData();
  }, []); 



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main id={cx("content")}>
      <ul className={cx("box-info")}>
        <li>
          <i
            className={cx("bx", " bxl-product-hunt", "bx bxl-product-hunt")}
          ></i>
          <span className={cx("text")}>
            <h3>{products}</h3>
            <p>Sản Phẩm</p>
          </span>
        </li>
        <li>
          <i className={cx("bx bx-cube", "bx")}></i>
          <span className={cx("text")}>
            <h3>{productsCount}</h3>
            <p>Người dùng trong tuần</p>
          </span>
        </li>
        <li>
          <i className={cx("bx", "bx bxs-category")}></i>
          <span className={cx("text")}>
            <h3>{categories}</h3>
            <p>Thương Hiệu</p>
          </span>
        </li>
      </ul>
      <ul className={cx("box-info1")}>
        <li>
          <i className={cx("bx", "bx bx-list-ul")}></i>
          <span className={cx("text")}>
            <h3>{donHangs}</h3>
            <p>Đơn Hàng</p>
          </span>
        </li>
        <li>
          <i className={cx("bx", "bx bxs-group")}></i>
          <span className={cx("text")}>
            <h3>{users}</h3>
            <p>Tổng người dùng</p>
          </span>
        </li>
        <li>
          <i className={cx("bx", "bx bxs-dollar-circle")}></i>
          <span className={cx("text")}>
            <h3>
              {tongDoanhThu ? tongDoanhThu.toLocaleString("vi-VN") : "0"}₫
            </h3>
            <p>Tổng Doanh Thu</p>
          </span>
        </li>
      </ul>
      <div className={cx("data")}>
        <div className={cx("content-data")}>
          <div className={cx("head")}>
            <h3>BIỂU ĐỒ DOANH THU THEO THỜI GIAN</h3>
            <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className={cx("select-period")}
          >
            <option value="day">Theo Ngày</option>
            <option value="month">Theo Tháng</option>
            <option value="year">Theo Năm</option>
          </select>
          </div>
          <div className={cx("chart")}>
            <div id="chart1">
            <Bar data={chartDataDoanhThu} />
            </div>
          </div>
        </div>
        <div className={cx("content-data")}>
          <div className={cx("head")}>
            <h3>TOP 5 SẢN PHẨM BÁN CHẠY</h3>
          </div>
          <div className={cx("chat-box")}>
            <div id="chart">
              <Bar data={chartData2} options={chartOptions2} />
            </div>
          </div>
        </div>
        <div className={cx("content-data")}>
          <div className={cx("head")}>
            <h3>Người dùng mới</h3>
          </div>
          <div className={cx("chat-box")}>
            {userNew.length > 0 ? (
              <table className={cx("customer-table")}>
                <thead className={cx("cuttom1")}>
                  <tr>
                    <th>ID</th>
                    <th>Tên khách hàng</th>
                    <th className="text-center">Email</th>
                    <th>Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {userNew.map((item, index) => (
                    <tr key={item._id} style={{ textAlign: "center" }}>
                      <td>{index + 1}</td>
                      <td>{item.ho_ten}</td>
                      <td>{item.email}</td>
                      <td>{item.dien_thoai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontStyle: "italic",
                }}
              >
                Không có người mới ngày hôm nay.
              </p>
            )}
          </div>
        </div>
        <div className={cx("content-data")}>
          <div className={cx("head")}>
            <h3>Trạng Thái Đơn Hàng</h3>
          </div>
          <div className={cx("chat-box")}>
            <div className={cx("table-container")}>
              <table className={cx("customer-table")}>
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Ngày đặc hàng</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {oder.map((item) => (
                    <tr>
                      <td>
                        <div className={cx("user-info")}>
                          <img
                            src={`http://localhost:5000/images/${item.user.hinh_anh}`}
                            alt="User Image"
                          />
                          <span>{item.user.ho_ten}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(item.thoi_gian_tao).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td>
                        <span className={`${cx("status", "completed")}`}>
                          {item.trang_thai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
