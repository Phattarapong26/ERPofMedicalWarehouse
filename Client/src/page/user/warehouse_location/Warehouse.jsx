import axios from "axios";
import Swal from "sweetalert2";
import "./warehouse.css";
import { Card } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useOutletContext } from "react-router";
import { ModalWarehouse } from "./Modal/ModalWarehouse";
import { ModalWarehouseDetail } from "./Modal/ModalWarehouseDetail";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

export function Warehouse() {
  const { addNew } = useOutletContext();
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState([]);
  const [warehouseInfo, setWarehouseInfo] = useState({});
  const localhost = "http://localhost:3000";
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // for modal warehouse detail
  const [warehouseID, setWarehouseID] = useState("");
  const [warehouseName, setWarehouseName] = useState("");

  //get all warehouse to show
  const getWarehouse = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get(localhost + "/getWarehouse")
        .then((response) => {
          resolve(response.data);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((response) => {
          reject([]);
        });
    });
  };

  const getWarehouseInfo = async (warehouse_id) => {
    try {
      const response = await fetch("http://localhost:3000/Warehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ warehouse_id: warehouse_id }),
      });
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching warehouse info:", error);
      return {}; // Return empty object on error
    }
  };

  const deleteWarehouse = (warehouse_id, warehouse_name) => {
    const jsonData = {
      warehouse_id: warehouse_id,
    };
    Swal.fire({
      position: "center",
      icon: "question",
      title: "คุณต้องการลบที่จัดเก็บ " + warehouse_name + " หรือไม่",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ยืนยันลบรายการ",
      cancelButtonText: "ปิด",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/deleteWarehouse", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              window.location.reload(false);
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "ไม่สามารถลบที่จัดเก็บ " + warehouse_name + " ได้",
                showConfirmButton: true,
              });
            }
          });
      }
    });
  };

  useEffect(() => {
    getWarehouse()
      .then((data) => {
        setWarehouse(Array.isArray(data) ? data : []);
      })
      .catch((data) => {
        console.log(data);
      });
  }, []);

  useEffect(() => {
    if (showDetail == false) {
      getWarehouse()
        .then((data) => {
          setWarehouse(Array.isArray(data) ? data : []);
        })
        .catch((data) => {
          console.log(data);
        });
    }
  }, [showDetail]);

  useEffect(() => {
    warehouse.forEach(async (wh) => {
      const info = await getWarehouseInfo(wh.warehouse_id);
      setWarehouseInfo((prev) => ({ ...prev, [wh.warehouse_id]: info }));
    });
  }, [warehouse]);

  const handleWarehouseClick = (warehouseId, warehouseName) => {
    setWarehouseID(warehouseId);
    setWarehouseName(warehouseName);
    setShowDetail(true);
  };

  return (
    <>
      <ModalWarehouse showAdd={showAdd} setShow={setShowAdd} />
      <ModalWarehouseDetail
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        warehouse_id={warehouseID}
        setWarehouseID={setWarehouseID}
        warehouse_name={warehouseName}
      />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ตำแหน่งจัดเก็บ</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                    <div className="col-md-4 col-sm-12">
                      <form className="d-flex flex-row flex-wrap justify-content-start align-items-center">
                        <input
                          className="form-control  col-md-9 col-sm-12 border-1 "
                          type="text"
                          placeholder="search"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                        />
                      </form>
                    </div>
                    {addNew == 1 ? (
                      <div
                        className="btn btn-secondary btn-sm col-md-2 col-sm-12"
                        onClick={() => setShowAdd(true)}
                      >
                        <i className="fa-solid fa-plus me-2"></i>
                        เพิ่มตำแหน่งจัดเก็บ
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div
                  className="card-body justify-content-center row d-flex flex-wrap"
                  style={{ maxHeight: "590px", overflowY: "auto" }}
                >
                  <div className="d-flex justify-content-center gap-3 flex-wrap ">
                    {(Array.isArray(warehouse) ? warehouse : [])
                      .filter((wh) =>
                        search
                          ? wh.warehouse_name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          : true
                      )
                      .map((wh) => (
                        <div
                          key={wh.warehouse_id}
                          onClick={() =>
                            warehouseInfo[wh.warehouse_id] &&
                            handleWarehouseClick(
                              wh.warehouse_id,
                              wh.warehouse_name
                            )
                          }
                          className="card-container row d-flex flex-warp col-md-4 col-sm-12"
                        >
                          <Card
                            title={
                              <>
                                <div className="row d-flex justify-content-between align-items-center p-0 m-0">
                                  <div className="col-6 p-0 py-2 m-0">
                                    <div className="fs-5 p-0 m-0">
                                      {wh.warehouse_name}
                                    </div>
                                    <small className="text-primary p-0 m-0">
                                      คลิกเพื่อดูรายละเอียด
                                    </small>
                                  </div>
                                  {addNew === 1 &&
                                  warehouseInfo[wh.warehouse_id] &&
                                  warehouseInfo[wh.warehouse_id]
                                    .total_locations === 0 ? (
                                    <div className="col-6 d-flex justify-content-end p-0 m-0">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          deleteWarehouse(
                                            wh.warehouse_id,
                                            wh.warehouse_name
                                          )
                                        }
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            }
                            className="border border-secondary-subtle my-2 shadow-sm hover-shadow-lg p-0 m-0"
                            bordered={true}
                          >
                            <div className="col-12 row p-0 m-0">
                              <table
                                className="col-md-8 col-sm-12"
                                style={{ fontSize: "1rem" }}
                              >
                                <tbody>
                                  <tr>
                                    <td>ที่เก็บ</td>
                                    <td className="col-3">
                                      {warehouseInfo[wh.warehouse_id]
                                        ?.total_locations || 0}
                                    </td>
                                    <td>ล็อต</td>
                                  </tr>
                                  <tr>
                                    <td>ว่าง</td>
                                    <td className="col-3">
                                      {(warehouseInfo[wh.warehouse_id]
                                        ?.total_locations || 0) -
                                        (warehouseInfo[wh.warehouse_id]
                                          ?.total_lots || 0)}
                                    </td>
                                    <td>ล็อต</td>
                                  </tr>
                                  <tr>
                                    <td>ใกล้หมดอายุ</td>
                                    <td
                                      className={`col-3 ${
                                        warehouseInfo[wh.warehouse_id]
                                          ?.total_lots_before_date === 0
                                          ? ""
                                          : "text-danger fw-bolder "
                                      }`}
                                    >
                                      {warehouseInfo[wh.warehouse_id]
                                        ?.total_lots_before_date || 0}
                                    </td>
                                    <td>ล็อต</td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="col-md-4 d-flex justify-content-center p-0 m-0">
                                <Gauge
                                  width={150}
                                  height={100}
                                  value={
                                    warehouseInfo[wh.warehouse_id]
                                      ?.total_lots || 0
                                  }
                                  valueMax={
                                    warehouseInfo[wh.warehouse_id]
                                      ?.total_locations || 0
                                  }
                                  startAngle={-90}
                                  endAngle={90}
                                  text={
                                    warehouseInfo[wh.warehouse_id]
                                      ?.total_locations === 0
                                      ? "0"
                                      : warehouseInfo[wh.warehouse_id]
                                          ?.total_locations ===
                                        warehouseInfo[wh.warehouse_id]
                                          ?.total_lots
                                      ? "เต็ม"
                                      : `${
                                          warehouseInfo[wh.warehouse_id]
                                            ?.total_lots || 0
                                        } / ${
                                          warehouseInfo[wh.warehouse_id]
                                            ?.total_locations || 0
                                        }`
                                  }
                                  sx={{
                                    [`& .${gaugeClasses.valueText}`]: {
                                      fontSize: 26,
                                      transform: "translate(0px, -15px)",
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                      fill: `${
                                        warehouseInfo[wh.warehouse_id]
                                          ?.total_lots ===
                                        warehouseInfo[wh.warehouse_id]
                                          ?.total_locations
                                          ? "#FC6A03"
                                          : "#52b202"
                                      }`,
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
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
