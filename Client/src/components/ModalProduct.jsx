import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";


export function ModalProduct(props) {
  const localhost = "http://localhost:3000";

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [lowStock, setLowStock] = useState(50);
  const [unit, setUnit] = useState(0);
  const [type, setType] = useState(0);
  const [category, setCategory] = useState(0);
  const [detail, setDetail] = useState("");
  const [direction, setDirection] = useState("");

  const [unitSelect, setUnitSelect] = useState([]);
  const [typeSelect, setTypeSelect] = useState([]);
  const [categorySelect, setCategorySelect] = useState([]);

//   const [showAddProduct, setShowAddProduct] = useState(false);

  const addNewProduct = (e) => {
    e.preventDefault();
    const jsonData = {
      id: id,
      name: name,
      low_stock: lowStock,
      unit: unit,
      type: type,
      category: category,
      detail: detail,
      direction: direction,
    };
    fetch("http://localhost:3000/checkProductID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0].countID != 0) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "รหัสยานี้ถูกเพิ่มแล้ว",
            showConfirmButton: true,
          });
        } else {
          fetch("http://localhost:3000/addNewProduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "เพิ่มยา สำเร็จ!",
                  showConfirmButton: true,
                  showCancelButton: true,
                  cancelButtonColor: "#d33",
                  confirmButtonText: "เพิ่มรายการ",
                  cancelButtonText: "ปิด",
                }).then((result) => {
                  if (result.isConfirmed) {
                    setID("");
                    setName("");
                    setLowStock(50);
                    setUnit(0);
                    setType(0);
                    setCategory(0);
                    setDetail("");
                    setDirection("");
                  }else{
                    setID("");
                    setName("");
                    setLowStock(50);
                    setUnit(0);
                    setType(0);
                    setCategory(0);
                    setDetail("");
                    setDirection("");
                    props.setShow(false)
                    window.location.reload()
                  }
                });
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                  showConfirmButton: true,
                });
              }
            });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  //get unit data to show at select option
  useEffect(() => {
    fetch(localhost + "/getUnit")
      .then((data) => data.json())
      .then((unit) => setUnitSelect(unit));
  }, []);

  //get type data to show at select option
  useEffect(() => {
    fetch(localhost + "/getType")
      .then((data) => data.json())
      .then((type) => setTypeSelect(type));
  }, []);

  //get category data to show at select option
  useEffect(() => {
    fetch(localhost + "/getCategory")
      .then((data) => data.json())
      .then((category) => setCategorySelect(category));
  }, []);

  return (
    <>
      {/* Modal add new product */}
      <Modal show={props.showAdd} onHide={()=>{props.setShow(false); window.location.reload()}}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="fw-bolder">สร้างรายการยาใหม่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>รหัสยา</label>
                    <input
                      type="text"
                      name="p_id"
                      className="form-control"
                      placeholder="รหัสยา"
                      value={id}
                      required
                      onChange={(event) => {
                        setID(event.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>ชื่อ</label>
                    <input
                      type="text"
                      name="p_name"
                      className="form-control"
                      placeholder="ชื่อยา"
                      value={name}
                      required
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>จำนวนขั่นต่ำ</label>
                    <input
                      type="text"
                      name="p_name"
                      className="form-control"
                      placeholder="ชื่อยา"
                      value={lowStock}
                      required
                      onChange={(event) => {
                        setLowStock(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>หน่วย</label>
                    <select
                      name="p_type"
                      className="form-control select2"
                      value={unit}
                      required
                      onChange={(event) => {
                        setUnit(event.target.value);
                      }}
                    >
                      <option value="">เลือก</option>
                      {(Array.isArray(unitSelect) ? unitSelect : []).map((unit, i) => (
                        <option key={i} value={unit.unit_id}>
                          {unit.unit_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>ชนิด</label>
                    <select
                      name="p_type"
                      className="form-control select2"
                      value={type}
                      required
                      onChange={(event) => {
                        setType(event.target.value);
                      }}
                    >
                      <option value="">เลือก</option>
                      {(Array.isArray(typeSelect) ? typeSelect : []).map((type, i) => (
                        <option key={i} value={type.type_id}>
                          {type.type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>ประเภท</label>
                    <select
                      name="p_type"
                      className="form-control select2"
                      value={category}
                      required
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                    >
                      <option value="">เลือก</option>
                      {(Array.isArray(categorySelect) ? categorySelect : []).map((category, i) => (
                        <option key={i} value={category.category_id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>รายละเอียด</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Enter ..."
                      value={detail}
                      required
                      onChange={(event) => {
                        setDetail(event.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>วิธีใช้</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Enter ..."
                      value={direction}
                      required
                      onChange={(event) => {
                        setDirection(event.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      type="submit"
                      name="submit"
                      className="btn btn-lg btn-success w-100 fw-bold"
                      onClick={addNewProduct}
                    >
                      สร้างรายการยาใหม่
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={addNewProduct}>
            Save
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}
