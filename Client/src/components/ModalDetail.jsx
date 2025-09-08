import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

export function ModalDetail(props) {
  const localhost = "http://localhost:3000";

  const id = props.keyID || ''; // Default value for id

  const withdraw = props.withdraw;
  const [name, setName] = useState('');
  const [lowStock, setLowStock] = useState(50);
  const [unit, setUnit] = useState(0);
  const [type, setType] = useState(0);
  const [category, setCategory] = useState(0);
  const [detail, setDetail] = useState('');
  const [direction, setDirection] = useState('');
  const [quantity, setQuantity] = useState(0);

  const [unitSelect, setUnitSelect] = useState([]);
  const [typeSelect, setTypeSelect] = useState([]);
  const [categorySelect, setCategorySelect] = useState([]);

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
 
  const getQuantity = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/getQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      setQuantity(data[0].p_quantity);
    } catch (error) {
      console.error("Error fetching quantity data:", error);
      return [];
    }
  };
  
  useEffect(() => {
    if (id) {
      const jsonData = {
        id: id,
      };
      // Fetch product details
      fetch("http://localhost:3000/getDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const productData = data[0];
            setName(productData.name);
            setLowStock(productData.low_stock);
            setUnit(productData.unit);
            setType(productData.type);
            setCategory(productData.category);
            setDetail(productData.detail);
            setDirection(productData.direction);
          }
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
  
      getQuantity(id); // Call getQuantity using await
    }
  }, [id]);
  
  
  

  const update = (e) => {
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
    fetch("http://localhost:3000/updateProduct", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "error") {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update",
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  return (
    <>
      {/* Modal add new product */}
      <Modal
        show={props.showDetail}
        onHide={() => {
          props.setShow(false);
          window.location.reload();
        }}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="fw-bolder">รายละเอียด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>รหัสยา</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="รหัสยา"
                      value={id}
                      readOnly
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
                      className="form-control"
                      placeholder="ชื่อยา"
                      value={name}
                      required
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                      readOnly={withdraw == 1 ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>จำนวนขั่นต่ำ</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ชื่อยา"
                      value={lowStock}
                      required
                      onChange={(event) => {
                        setLowStock(event.target.value);
                      }}
                      readOnly={withdraw == 1 ? false : true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>จำนวนในคลัง</label>
                    <input
                      type="text"
                      className={`form-control ${
                        quantity <= lowStock && quantity != 0 ? 'bg-warning-subtle' : quantity > lowStock  ? '' : 'bg-danger-subtle'
                      }`}
                      value={quantity}
                      required
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>หน่วย</label>
                    <select
                      className="form-control select2"
                      value={unit}
                      required
                      onChange={(event) => {
                        setUnit(event.target.value);
                      }}
                      disabled={withdraw == 1 ? false : true}
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
                      className="form-control select2"
                      value={type}
                      required
                      onChange={(event) => {
                        setType(event.target.value);
                      }}
                      disabled={withdraw == 1 ? false : true}
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
                      className="form-control select2"
                      value={category}
                      required
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                      disabled={withdraw == 1 ? false : true}
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
                      readOnly={withdraw == 1 ? false : true}
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
                      readOnly={withdraw == 1 ? false : true}
                    ></textarea>
                  </div>
                </div>
                {withdraw == 1 ? (
                  <div className="col-md-12">
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100 fw-bold"
                        onClick={update}
                      >
                        อัปเดตข้อมูล
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
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
