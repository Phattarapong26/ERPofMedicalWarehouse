import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router";

export function Import() {
  const { userName } = useOutletContext();
  const localhost = "http://localhost:3000";

  const [purchaseID, setPurchaseID] = useState("");
  const [detail, setDetail] = useState([]);
  const [locationSelect, setLocationSelect] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [updateList, setUpdateList] = useState([]);

  const getDetail = async () => {
    const jsonData = {
      purchase_id: purchaseID,
    };

    try {
      const response = await fetch(`${localhost}/getDetailForImport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      if (data.status === "Not found") {
        console.log("No records found for the given purchase ID");
      } else {
        setDetail(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPurchaseDetail = (purchaseID) => {
    if (purchaseID !== "") {
      const jsonData = {
        purchase_id: purchaseID,
      };
      fetch("http://localhost:3000/getDetailForImport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "No purchase order") {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ไม่พบข้อมูลการสั่งซื้อ",
              showConfirmButton: true,
            });
            setDetail([]);
          } else if (data.status === "Imported") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "รายการสั่งซื้อนี้ถูกนำเข้าแล้ว",
              showConfirmButton: true,
            });
            setDetail([]);
            
          } else if (data.status === "Waiting") {
            Swal.fire({
              position: "center",
              icon: "info",
              title: "รอการดำเนินการจากผู้จัดส่ง",
              showConfirmButton: true,
            });
            setDetail([]);
          }  else if (data.status === "success") {
            getDetail();
          }
        });
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "กรุณากรอกรหัสการสั่งซื้อ",
        showConfirmButton: true,
      });
    }
  };

  const fetchEmptyLocations = async () => {
    try {
      const response = await fetch(`${localhost}/getEmptyLocation`);
      if (!response.ok) {
        throw new Error("Failed to fetch empty locations");
      }
      const locationData = await response.json();
      setLocationSelect(locationData);
    } catch (error) {
      console.error("Error fetching empty locations:", error);
      // Handle error condition, such as displaying an error message
    }
  };

  useEffect(() => {
    fetchEmptyLocations();
  }, []);

  useEffect(() => {
    console.log(updateList);
  }, [updateList]);

  const handleLocationChange = (e, index, lotId) => {
    const { value } = e.target;
  
    const beforeDateValue = detail[index]?.before_date || 30;
  
    // Remove the old entry from updateList if it exists
    const updatedList = updateList.filter((item) => item.lot_id !== lotId);
  
    if (value !== "") {
      updatedList.push({
        lot_id: parseInt(lotId, 10),
        location_id: parseInt(value, 10),
        before_date: beforeDateValue, 
      });
    }
  
    // Update the updateList state
    setUpdateList(updatedList);
  
    setSelectedLocations((prevLocations) => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = value;
      return updatedLocations;
    });
  };
  const handleBeforeDateChange = (e, index) => {
    const { value } = e.target;
    const newDetail = [...detail];
    let parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
        parsedValue = 30; 
    }
    newDetail[index] = {
        ...newDetail[index],
        before_date: parsedValue,
    };
    setDetail(newDetail);
  
    const updatedList = updateList.map((item) => {
        if (item.lot_id === newDetail[index].lot_id) {
            return {
                ...item,
                before_date: parsedValue,
            };
        }
        return item;
    });
    setUpdateList(updatedList);
};

  const handleSubmit = async () => {
    const jsonData = {
      purchase_id: purchaseID,
      user_name: userName,
      updateList: updateList,
    };

    try {
      const response = await fetch(`http://localhost:3000/import`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      // Handle the response
      const data = await response.json();
      if (data.status === "success") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "นำเข้าสำเร็จ",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            setPurchaseID("");
            setDetail([]);
            fetchEmptyLocations();
            setSelectedLocations([]);
            setUpdateList([]);
            window.location.reload(false);
          }
        });

        // Perform any additional actions upon successful import
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error importing:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล",
        showConfirmButton: true,
      });
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">เพิ่มยาจากคำสั่งซื้อ</h1>
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
                    <div className="col-md-6 col-sm-12">
                      <form className="d-flex flex-row flex-wrap justify-content-start align-items-center">
                        <div className="me-2 fs-5">รหัสคำสั่งซื้อ : </div>
                        <input
                          className="form-control col-md-5 col-sm-12 border-1 fs-5 rounded-end-0"
                          type="number"
                          placeholder="search"
                          value={purchaseID}
                          onChange={(e) => {
                            setPurchaseID(parseInt(e.target.value, 10));
                          }}
                        />
                        <button
                          className="btn btn-secondary rounded-start-0"
                          onClick={(e) => {
                            e.preventDefault();
                            getPurchaseDetail(purchaseID);
                          }}
                        >
                          ค้นหา
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="card-body px-2">
                  <Table borderless className="border-bottom">
                    <thead className="border-bottom">
                      <tr>
                        <th className="col-1 text-center">รหัสยา</th>
                        <th className="col-1">ชื่อ</th>
                        <th className="col-1 ">จำนวน</th>
                        <th className="col-1 ">หน่วย</th>
                        <th className="col-1 ">วันหมดอายุ</th>
                        <th className="col-1 ">แจ้งเตือนก่อนหมดอายุ</th>
                        <th className="col-1 ">เลือกตำแหน่งจัดเก็บ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="fs-5 text-center">
                            กรุณากรอกรหัสการสั่งซื้อ
                          </td>
                        </tr>
                      ) : (
                        detail.map((item, index) => (
                          <tr key={item.id}>
                            <td className="text-center">{item.p_id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit_name}</td>
                            <td>
                              {new Date(item.exp_date).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                            <td className="d-flex justify-content-center align-items-center">
                              <input
                                className="form-control col-6"
                                type="number"
                                value={item.before_date || ""}
                                onChange={(e) => handleBeforeDateChange(e, index)}
                              />
                            </td>
                            <td>
                              <Form.Select
                                aria-label="Default select example"
                                value={selectedLocations[index] || ""}
                                onChange={(e) =>
                                  handleLocationChange(e, index, item.lot_id)
                                }
                              >
                                <option value="">เลือกตำแหน่งจัดเก็บ</option>
                                {locationSelect.length == 0 ? (
                                  <option value="">
                                    ไม่มีตำแหน่งจัดเก็บว่าง
                                  </option>
                                ) : (
                                  locationSelect.map((location) => (
                                    <option
                                      key={location.location_id}
                                      value={location.location_id}
                                      disabled={selectedLocations.includes(
                                        location.location_id
                                      )}
                                    >
                                      {location.Location_name}
                                    </option>
                                  ))
                                )}
                              </Form.Select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  <div className="row mt-5 justify-content-end">
                    {selectedLocations.length == 0
                      ? ""
                      : selectedLocations.length === detail.length &&
                        selectedLocations.every(
                          (location) => location !== ""
                        ) && (
                          <button
                            className="btn btn-success col-2 me-2"
                            onClick={handleSubmit}
                          >
                            ยืนยันคำสั่งซื้อ
                          </button>
                        )}
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
