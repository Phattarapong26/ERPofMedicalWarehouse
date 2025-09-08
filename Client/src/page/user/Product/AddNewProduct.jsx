import axios from "axios";
import "../../../components/card.css";
import { useEffect, useState } from "react";

export function AddNewProduct() {
  const [id, setID] = useState(0);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState(0);
  const [type, setType] = useState(0);
  const [category, setCategory] = useState(0);
  const [detail, setDetail] = useState("");
  const [direction, setDirection] = useState("");

  const [unitSelect, setUnitSelect] = useState([]);
  const [typeSelect, setTypeSelect] = useState([]);
  const [categorySelect, setCategorySelect] = useState([]);

  const [idCount, setIdCount] = useState(0);

  const localhost = "http://localhost:3000";

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

  useEffect(() => {
    fetch(localhost + "/checkProductID")
    .then((data) => data.json())
    .then((idCount) => setIdCount(idCount))
  }, []);

  const addNewProduct = () => {
    fetch(localhost + "/checkProductID")
      .then((data) => data.json())
      .then((idCount) => setIdCount(idCount))
      .then(() => {
        const  IDcounter =idCount.map((idCount)=>idCount.countID)
        if (IDcounter > 0) { 
          alert("Not Insert")
        
        }else{
          axios
          .post("http://localhost:3000/addNewProduct",{
            id: id,
            name: name,
            unit: unit,
            type: type,
            category: category,
            detail: detail,
            direction: direction,
          }).then(()=>{
            window.location.reload(false);
          })
        }
      })
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: "Your work has been saved",
            //   showConfirmButton: true,
            //   timer: 5500,
            // });
  };

  return (
    <div className="content">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">สร้างรายการยาใหม่</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid row">
        <div className="col-md-12">
          <div className="card card-primary w-20">
            <div className="card-header">
              <div className="d-inline-flex justify-content-between align-items-center w-100">
                <h3 className="card-title">สร้างรายการยาใหม่</h3>

                {/* <div className="btn-menu">
                  <a
                    href="../warehouse/warehouse.php"
                    className="btn btn-secondary btn-sm"
                  >
                    <i className="fa-solid fa-plus"></i>
                    เพิ่มตำแหน่งจัดเก็บ
                  </a>
                </div> */}
              </div>
            </div>

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
                        required
                        onChange={(event) => {
                          setID(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>ชื่อ</label>
                      <input
                        type="text"
                        name="p_name"
                        className="form-control"
                        placeholder="ชื่อยา"
                        required
                        onChange={(event) => {
                          setName(event.target.value);
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
                        required
                        onChange={(event) => {
                          setUnit(event.target.value);
                        }}
                      >
                        <option value="">-- Please Select --</option>
                        {unitSelect.map((unit, i) => (
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
                        required
                        onChange={(event) => {
                          setType(event.target.value);
                        }}
                      >
                        <option value="">-- Please Select --</option>
                        {typeSelect.map((type, i) => (
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
                        required
                        onChange={(event) => {
                          setCategory(event.target.value);
                        }}
                      >
                        <option value="">-- Please Select --</option>
                        {categorySelect.map((category, i) => (
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
                        rows="3"
                        placeholder="Enter ..."
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
                        rows="3"
                        placeholder="Enter ..."
                        required
                        onChange={(event) => {
                          setDirection(event.target.value);
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <div className="form-group">
                        <button
                          type="submit"
                          name="submit"
                          className="btn btn-primary w-100"
                          onClick={addNewProduct}
                        >
                          ยืนยัน
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
