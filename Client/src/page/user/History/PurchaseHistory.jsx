import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";

export function PurchaseHistory() {
  const localhost = "http://localhost:3000";

  const [search, setSearch] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const getPurchaseHistory = async () => {
    try {
      const response = await axios.get(localhost + "/purchaseHistory");
      if (response.data.status === "success") {
        setPurchaseHistory(response.data.data);
      } else if (response.data.status === "No data") {
        setPurchaseHistory([]);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    getPurchaseHistory();
  }, []);

  // Function to determine status based on conditions
  const getStatus = (details) => {
    if (
      details.some(
        (detail) => detail.exp_date === null && detail.due_date === null
      )
    ) {
      return "Waiting";
    } else if (
      details.some(
        (detail) => detail.location_id === null && detail.exp_date !== null
      )
    ) {
      return "waitLocation";
    } else {
      return "Success";
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">
                ประวัติการสั่งซื้อ
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <section className="content col">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header row">
                    <form className="d-flex flex-row flex-wrap justify-content-start align-items-center col-md-8 col-sm-12">
                      <input
                        className="form-control col-12 border-1 "
                        type="text"
                        placeholder="search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                    </form>
                    {/* <div className="col-md-3 col-sm-12 d-flex flex-row flex-wrap justify-content-center align-items-center">
                     
                    </div> */}
                  </div>

                  <div className="card-body"  style={{ maxHeight: "590px", overflowY: "auto" }}>
                    <Accordion alwaysOpen>
                      {purchaseHistory.length == 0 ? (
                        <div className="text-center fs-3">
                          ไม่มีประวัติคำสั่งซื้อ
                        </div>
                      ) : (
                        purchaseHistory
                          .filter(
                            (purchase) =>
                              purchase.purchase_id
                                .toLowerCase()
                                .includes(search) ||
                              purchase.date.toLowerCase().includes(search) ||
                              purchase.purcher.toLowerCase().includes(search)
                          )
                          .map((purchase) => (
                            <Accordion.Item
                              eventKey={purchase.purchase_id}
                              key={purchase.purchase_id}
                            >
                              <Accordion.Header>
                                <div className="row col-md-12 col-sm-12 d-flex justify-content-between align-items-center pe-5">
                                  <div className="col-2">
                                    รหัสคำสั่งซื้อ : {purchase.purchase_id}
                                  </div>
                                  <div className="col-2">
                                    วันที่ :{" "}
                                    {new Date(purchase.date).toLocaleDateString(
                                      "en-GB"
                                    )}
                                  </div>
                                  <div className="col-3">
                                    ออกโดย : {purchase.purcher}
                                  </div>
                                  {getStatus(purchase.details) == "Success" ? (
                                    <div className="col-3 fs-5 badge text-bg-success d-flex flex-row align-items-center justify-content-center rounded-pill"> 
                                      <div className="me-3">
                                        <i className="bi bi-check2-square"></i>
                                      </div>
                                      <div>
                                        ได้รับสินค้าแล้ว
                                      </div>
                                    </div>
                                  ) : getStatus(purchase.details) ==
                                    "waitLocation" ? (
                                      <div className="col-3 fs-5 badge text-bg-info d-flex flex-row align-items-center justify-content-center rounded-pill"> 
                                      <div className="me-3">
                                        <i className="bi bi-box2"></i>
                                      </div>
                                      <div>
                                        รอนำเข้าที่จัดเก็บ
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-md-3 fs-5 badge text-bg-warning d-flex flex-row align-items-center justify-content-center rounded-pill"> 
                                    <div className="me-3">
                                      <i className="bi bi-truck"></i>
                                    </div>
                                    <div>
                                      รอดำเนินการจัดส่ง
                                    </div>
                                  </div>
                                   
                                  )}
                                </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                <Table borderless>
                                  <tbody>
                                    {purchase.details.map((detail) => (
                                      <tr key={detail.id}>
                                        <td className="col-1">
                                          รหัสยา : {detail.p_id}
                                        </td>
                                        <td className="col-1">
                                          ชื่อยา : {detail.name}
                                        </td>
                                        <td className="col-1">
                                          จำนวน : {detail.quantity}{" "}
                                          {detail.unit_name}
                                        </td>
                                        <td className="col-1">
                                          วันหมดอายุ :{" "}
                                          {detail.exp_date == null
                                            ? "รอดำเนินการ"
                                            : new Date(
                                                detail.exp_date
                                              ).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="col-1">
                                          ตำแหน่งจัดเก็บ :{" "}
                                          {detail.location_id == null &&
                                          detail.quantity != 0
                                            ? "รอดำเนินการ"
                                            : detail.Location_name}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))
                      )}
                    </Accordion>
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
