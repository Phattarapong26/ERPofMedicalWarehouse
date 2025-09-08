import { Menu } from "antd";
import {
  AreaChartOutlined,
  InboxOutlined,
  PrinterOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export function MenuList() {
  const [withdraw, setWithdraw] = useState(false);
  const [purchase, setPurchase] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/authen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "error") {
          window.location = "/";
        } else {
          setWithdraw(() => data[0].withdraw);
          setPurchase(() => data[0].purchase);
        }
      });
  }, []);

  const items = [
    {
      key: "Dashboard",
      icon: <AreaChartOutlined className="fs-5" />,
      label: <Link to="dashboard">ภาพรวม</Link>,
    },
    {
      key: "medicine",
      icon: <i className="bi bi-capsule-pill fs-5"></i>,
      label: "จัดการคลังยา",
      children: [
        {
          key: "allProduct",
          label: <Link to="allProduct">ข้อมูลยาทั้งหมด</Link>,
        },
        {
          key: "productStatus",
          label: <Link to="productStatus">สถานะยาในคลัง</Link>,
        },
        {
          key: "import",
          label: <Link to="import">เพิ่มยาจากคำสั่งซื้อ</Link>,
        },
        {
          key: "addNewProduct",
          className: "d-none",
          label: <Link to="addNewProduct">เพิ่มยาใหม่</Link>,
        },
      ],
    },
    {
      key: "warehouse",
      icon: <InboxOutlined className="fs-5" />,
      label: <Link to="warehouse">ตำแหน่งจัดเก็บ</Link>,
    },
    {
      key: "print",
      icon: <PrinterOutlined className="fs-5" />,
      label: "ออกเอกสาร",
      children: [
        {
          key: "exportProduct",
          label: <Link to="allProduct">เอกสารรายการยา</Link>,
        },
        ...(purchase == 1
          ? [{ key: "purchase", label: <Link to="purchase">ออกใบสั่งซื้อ</Link> }]
          : []),
        ...(withdraw == 1
          ? [{ key: "export", label: <Link to="export">ออกใบเบิก</Link> }]
          : []),
      ],
    },
    {
      key: "history",
      icon: <HistoryOutlined className="fs-5" />,
      label: "ประวัติ",
      children: [
        {
          key: "history_purchase",
          label: <Link to="purchaseHistory">การสั่งซื้อ</Link>,
        },
        {
          key: "history_import",
          label: <Link to="importHistory">การนำเข้า</Link>,
        },
        {
          key: "history_export",
          label: <Link to="exportHistory">การส่งออก</Link>,
        },
      ],
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      className="d-flex flex-column mt-3"
      style={{
        height: "88dvh",
        gap: "15px",
        fontSize: "1rem",
        marginTop: "2rem",
        position: "relative",
      }}
      items={items}
    />
  );
}
