import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { ModalAddLocation } from "./ModalAddLocation";
import { useOutletContext } from "react-router";

export function ModalWarehouseDetail(props) {
  const { addNew } = useOutletContext();
  const warehouseID = props.warehouse_id;
  const setWarehouseID = props.setWarehouseID;
  const warehouseName = props.warehouse_name;

  const [lot, setLot] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  const [addLocation,setAddLocation] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/WarehouseDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ warehouse_id: warehouseID }),
      });
      const data = await response.json();
      // Normalize: API may return array or { status, data }
      if (Array.isArray(data)) {
        setLot(data);
      } else if (Array.isArray(data?.data)) {
        setLot(data.data);
      } else {
        setLot([]);
      }
    } catch (error) {
      console.error("Error fetching warehouse detail:", error);
    }
  }, [warehouseID]);

  useEffect(() => {
    fetchData();
  }, [fetchData, warehouseID]);

  const deleteLocation = (location_name) => {
    const jsonData = {
      location_name: location_name,
    };
    Swal.fire({
      position: "center",
      icon: "question",
      title: "คุณต้องการลบที่จัดเก็บ " + location_name + " หรือไม่",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ยืนยันลบรายการ",
      cancelButtonText: "ปิด",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/deleteLocation", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              fetchData();
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "ไม่สามารถลบที่จัดเก็บ " + location_name + " ได้",
                showConfirmButton: true,
              });
            }
          });
      }
    });
  };

  useEffect(() => {
    if(addLocation == false){
      fetchData()
    }
  }, [addLocation, fetchData]);

  return (
    <>
    <ModalAddLocation addLocation={addLocation} setAddLocation={setAddLocation} warehouseID={warehouseID} warehouseName={warehouseName}/>
    <Modal
      show={props.showDetail}
      onHide={() => {
        setWarehouseID("");
        props.setShowDetail(false);
      }}
      size="xl"
    >
      <Modal.Header closeButton className="bg-primary">
        <Modal.Title className="fw-bolder">
          ตำแหน่งจัดเก็บ {warehouseName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="col-12">
          <Card.Header>
            <form className="d-flex flex-row flex-wrap justify-content-start align-items-center m-0 p-0 input-group-lg">
              <input
                className="form-control col-12 border fs-4"
                type="text"
                placeholder="search"
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                }}
              />
            </form>
          </Card.Header>
          
          <ListGroup
            variant="flush"
            className="col-12 p-0 m-0"
            style={{ minHeight: "500px", maxHeight: "500px" }}
          >
            <ListGroup.Item className="col-12">
              <Table responsive="lg" borderless="true" striped>
                <thead className="col-12 border-bottom">
                  <tr>
                    <th className="col-1">ตำแหน่ง</th>
                    <th className="col-2 text-center">lot</th>
                    <th className="col-3 text-center">ชื่อยา</th>
                    <th className="col-2">จำนวน</th>
                    <th className="col-2">หน่วย</th>
                    <th className="col-2">วันหมดอายุ</th>
                    <th className="col-1 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(lot) ? lot.length === 0 : true) ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center fw-bold text-danger fs-5 bg-secondary-subtle"
                      >
                        ไม่มีตำแหน่งจัดเก็บย่อย
                        
                      </td>
                    </tr>
                  ) : (
                    (Array.isArray(lot) ? lot : [])
                      .filter((lot) => {
                        return searchLocation.toLowerCase() == ""
                          ? lot
                          : lot.Location_name.toLowerCase().includes(
                              searchLocation
                            );
                      })
                      .map((lot) => {
                        return lot.location_id == null ? (
                          <tr key={lot.Location_name}>
                            <td className="bg-success-subtle">
                              {lot.Location_name}
                            </td>
                            <td
                              colSpan={addNew == 1 ? 5 : 6}
                              className="text-center fw-bold text-info fs-5 bg-success-subtle"
                            >
                              ตำแหน่งจัดเก็บว่าง
                            </td>
                            {addNew == 1 ? <td className="text-center fw-bold text-info fs-5 bg-success-subtle">
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  deleteLocation(lot.Location_name)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td> : ""}
                          </tr>
                        ) : (
                          <tr key={lot.Location_name}>
                            <td>{lot.Location_name}</td>
                            <td className="text-center">{lot.lot_id}</td>
                            <td>{lot.name}</td>
                            <td>{lot.quantity}</td>
                            <td>{lot.unit_name}</td>
                            <td
                              colSpan={2}
                              className={
                                lot.days_left <= lot.before_date
                                  ? "text-danger fw-bolder"
                                  : ""
                              }
                            >
                              {new Date(lot.exp_date).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </Table>
            </ListGroup.Item>
          </ListGroup>
        </Card>
        {
          addNew == 1 ? <div className="col-12 d-flex justify-content-end  p-0">
          <button className="btn btn-success" onClick={()=>setAddLocation(true)}>เพิ่มตำแหน่งจัดเก็บย่อย</button>
        </div> : ""
        }
      </Modal.Body>
    </Modal></>
  );
}
