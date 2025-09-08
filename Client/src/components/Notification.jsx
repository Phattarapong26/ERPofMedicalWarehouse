import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Notification() {
  const [lowStock, setLowStock] = useState(0);
  const [outStock, setOutStock] = useState(0);
  const [overdue, setOverdue] = useState(0);

  const fetchDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setLowStock(data.low_stock_products.length);
        setOutStock(data.out_of_stock_products.length);
        setOverdue(data.overdue_lots.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    fetchDate();
  }, []);

  return (
    <ul className="navbar-nav me-3">
      <li className="nav-item dropdown mr-2">
        <a className="nav-link p-0 m-0" data-toggle="dropdown" href="#">
          <i className="far fa-bell fs-4 position-relative"></i>
          {lowStock + overdue + outStock > 0 ? (
            <span
              className="position-absolute badge translate-middle rounded-pill bg-danger text-center"
              style={{ top: "20px" }}
            >
              {lowStock + overdue + outStock}
            </span>
          ) : null}
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0">
          <span className="dropdown-header p-0">List</span>
          <div className="dropdown-divider"></div>
          <Link to="/user/ProductStatus" className="dropdown-item py-0">
            <i className="fa-solid fa-calendar-days"></i> ยาใกล้หมดอายุ
            <span className="float-right text-muted font-weight-bold">
              {overdue}
            </span>
          </Link>
          <Link to="/user/ProductStatus" className="dropdown-item py-0">
            <i className="fa-solid fa-box"></i> ยาเหลือน้อย
            <span className="float-right text-muted font-weight-bold">
              {lowStock}
            </span>
          </Link>
          <Link to="/user/ProductStatus" className="dropdown-item py-0">
            <i className="fa-regular fa-circle-xmark"></i> ยาหมดสต๊อก
            <span className="float-right text-muted font-weight-bold">
              {outStock}
            </span>
          </Link>
        </div>
      </li>
    </ul>
  );
}
