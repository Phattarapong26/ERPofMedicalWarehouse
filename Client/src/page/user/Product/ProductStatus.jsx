import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ProductChart from "../../../components/ProductChart";

export function ProductStatus() {
  const [outOfStock, setOutOfStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [overdue, setOverdue] = useState([]);

  const fetchDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setLowStock(data.low_stock_products);
        setOverdue(data.overdue_lots);
        setOutOfStock(data.out_of_stock_products);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    fetchDate();
  }, []);

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">สถานะยาในคลัง</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <section className="content col">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 col-sm-12">
                <div className="col-12">
                  <div className="card" style={{ height: "300px" }}>
                    <div
                      className="card-body p-0 m-0"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <ProductChart
                        lowStockCount={Array.isArray(lowStock) ? lowStock.length : 0}
                        outOfStockCount={Array.isArray(outOfStock) ? outOfStock.length : 0}
                        overdueCount={Array.isArray(overdue) ? overdue.length : 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="col-12">
                  <div className="card" style={{ height: "300px" }}>
                    <div className="card-header px-3">
                      <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                        <div className="col-12">
                          <h3 className="card-title">ยาหมดสต๊อก</h3>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>รหัสยา</th>
                            <th>ชื่อ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outOfStock.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.p_id}</td>
                              <td>{item.p_name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-5 col-sm-12">
                <div className="col-12">
                  <div className="card" style={{ height: "330px" }}>
                    <div className="card-header px-3">
                      <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                        <div className="col-md-4 col-sm-12">
                          <h3 className="card-title">ยาเหลือน้อย</h3>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body"
                      style={{ maxHeight: "330px", overflowY: "auto" }}
                    >
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>รหัสยา</th>
                            <th>ชื่อ</th>
                            <th>ขั่นต่ำ</th>
                            <th>ในคลัง</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStock.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.p_id}</td>
                              <td>{item.p_name}</td>
                              <td>{item.low_stock}</td>
                              <td>
                                {item.total_quantity} {item.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-7 col-sm-12">
                <div className="col-12">
                  <div className="card" style={{ height: "330px" }}>
                    <div className="card-header px-3">
                      <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                        <div className="col-md-6 col-sm-12">
                          <h3 className="card-title col-12">ยาใกล้หมดอายุ</h3>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body"
                      style={{ maxHeight: "330px", overflowY: "auto" }}
                    >
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>ล็อต</th>
                            <th>ตำแหน่งจัดเก็บ</th>
                            <th>รหัสยา</th>
                            <th>ชื่อ</th>
                            <th>วันหมดอายุ</th>
                            <th>เหลืออีก</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overdue.map((item, index) => (
                            <tr key={index}>
                              <td>{item.lot_id}</td>
                              <td>
                                {item.warehouse_name} - {item.location_name || item.Location_name}
                              </td>
                              <td>{item.p_id}</td>
                              <td>{item.product_name || item.name}</td>
                              <td>
                                {new Date(item.exp_date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>{item.days_overdue} วัน</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
