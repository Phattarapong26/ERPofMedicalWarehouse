import Axios from "axios";
import { useEffect, useState } from "react";

import "../../../components/card.css";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

export function Dashboard() {
  const [product, setProduct] = useState([]);
  const localhost = "http://localhost:3000";
  const [lowStock, setLowStock] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  // const [totalProduct, setTotalProduct] = useState(0);
  const [quantity, setQuantity] = useState({});

  const [search, setSearch] = useState("");

  const getProduct = async () => {
    try {
      const response = await Axios.get(localhost + "/product");
      return response.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return [];
    }
  };

  const getQuantity = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/getQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching quantity data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productData = await getProduct();
        setProduct(productData);

        // Fetch quantities for each product
        const quantityData = await Promise.all(
          productData.map((product) => getQuantity(product.id))
        );

        const quantityObj = {};
        quantityData.forEach((quantity, index) => {
          quantityObj[productData[index].id] = quantity;
        });

        setQuantity(quantityObj);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  const fetchDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setLowStock(data.low_stock_products.length);
        setOverdue(data.overdue_lots.length);
        setOutOfStock(data.out_of_stock_products.length);
        // setTotalProduct(data.total_product_count);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const [allLocation, setAllLocation] = useState(0);
  const [emptyLocation, setEmptyLocation] = useState(0);

  const getLocationDetail = async () => {
    try {
      const response = await fetch("http://localhost:3000/getAllLocation");
      const data = await response.json();
      if (data.status === "success") {
        setAllLocation(data.all_locations.length);
        setEmptyLocation(data.empty_locations.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    fetchDate();
    getLocationDetail();
  }, []);

  // Render the table only when both product and quantity data are available
  if (product.length === 0 || Object.keys(quantity).length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ภาพรวม</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div
          className="container-fluid"
          style={{ maxHeight: "700px", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="card">
                <div className="card-header px-3">
                  <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                    <div className="col-md-4 col-sm-12">
                      <h3 className="card-title">รายการยา</h3>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <Link to="/user/AllProduct">
                        <div className="d-flex justify-content-center fw-bold btn btn-outline-info btn-sm">
                          ดูรายละเอียด
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 p-4 m-0">
                  <form className="d-flex flex-row flex-wrap justify-content-start align-items-center">
                    <input
                      className="form-control  col-12 border-1 "
                      type="text"
                      placeholder="search"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                  </form>
                </div>
                <div
                  className="card-body p-0"
                  style={{
                    height: "510px",
                    maxHeight: "510px",
                    overflowY: "auto",
                  }}
                >
                  <Table striped>
                    <thead
                      style={{ position: "sticky", top: "0", zIndex: "1" }}
                    >
                      <tr>
                        <th>รหัสยา</th>
                        <th>ชื่อ</th>
                        <th>ชนิด</th>
                        <th>ประเภท</th>
                        <th className="text-center ">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product
                        .filter((product) => {
                          return search.toLowerCase() == ""
                            ? product
                            : product.id.toLowerCase().includes(search) ||
                                product.name.toLowerCase().includes(search);
                        })
                        .map((product) => {
                          return (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.type_name}</td>
                              <td>{product.category_name}</td>
                              <td
                                className="col-2"
                                style={{ fontSize: "1.2rem", zIndex: "0" }}
                              >
                                {quantity[product.id][0]?.p_quantity !== 0 &&
                                quantity[product.id][0]?.p_quantity <=
                                  product.low_stock &&
                                quantity[product.id][0]?.p_quantity != null ? (
                                  <div
                                    className="badge col-12 rounded-pill"
                                    style={{
                                      backgroundColor: "#FFD770",
                                      color: "#1f1f1f",
                                    }}
                                  >
                                    เหลือน้อย
                                  </div>
                                ) : quantity[product.id][0]?.p_quantity === 0 ||
                                  quantity[product.id][0]?.p_quantity ===
                                    null ? (
                                  <div
                                    className="badge col-12 rounded-pill"
                                    style={{
                                      backgroundColor: "#FC6A03",
                                      color: "#1f1f1f",
                                    }}
                                  >
                                    หมด
                                  </div>
                                ) : (
                                  <div
                                    className="badge col-12 rounded-pill"
                                    style={{
                                      backgroundColor: "#39e75f",
                                      color: "#1f1f1f",
                                    }}
                                  >
                                    มีของ
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="col-12">
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-warning elevation-1">
                    <i className="fa-solid fa-calendar-days"></i>
                  </span>
                  <Link to="/user/ProductStatus" className="info-box-content">
                    <span className="info-box-text">
                      ล็อตใกล้หมดอายุ <small>คลิกเพื่อดูรายละเอียด</small>
                    </span>
                    <span className="info-box-number fs-5">{overdue}</span>
                  </Link>
                </div>
              </div>

              <div className="col-12">
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-success elevation-1">
                    <i className="fa-solid fa-box"></i>
                  </span>
                  <Link to="/user/ProductStatus" className="info-box-content">
                    <span className="info-box-text">
                      ยาเหลือน้อย <small>คลิกเพื่อดูรายละเอียด</small>
                    </span>
                    <span className="info-box-number fs-5">{lowStock}</span>
                  </Link>
                </div>
              </div>

              <div className="col-12">
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-danger elevation-1">
                    <i className="fa-regular fa-circle-xmark"></i>
                  </span>
                  <Link to="/user/ProductStatus" className="info-box-content">
                    <span className="info-box-text">
                      ยาหมดสต๊อก <small>คลิกเพื่อดูรายละเอียด</small>
                    </span>
                    <span className="info-box-number fs-5">{outOfStock}</span>
                  </Link>
                </div>
              </div>
              <div className="col-12">
                <div
                  className="info-box mb-3 d-flex flex-column justify-content-center align-items-center"
                  // style={{
                  //   height: "362px",
                  // }}
                >
                  <div className="row fs-4">ตำแหน่งจัดเก็บ</div>
                  <div className="col-12 d-flex justify-content-around align-items-center p-0 m-0">
                    <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
                      <Gauge
                        width={200}
                        height={200}
                        cornerRadius="50%"
                        value={allLocation - emptyLocation}
                        valueMax={allLocation}
                        text={
                          emptyLocation == 0
                            ? "เต็ม"
                            : `${allLocation - emptyLocation} / ${allLocation}`
                        }
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: `${
                              emptyLocation != 0 && emptyLocation <= Math.floor(allLocation*0.5)
                                ? "#FFD770" : emptyLocation == 0
                                ? "#FC6A03"
                                : "#52b202"
                            }`,
                          },
                          [`& .${gaugeClasses.valueMax}`]: {
                            fill: "#1f1f1f",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                          },
                        })}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 fs-5">
                      <div>ทั้งหมด {allLocation}</div>
                      <div>ใช้ไป {allLocation - emptyLocation}</div>
                      <div>เหลือ {emptyLocation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
