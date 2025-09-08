import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
export function ModalWarehouse(props) {
  const [name, setName] = useState("");

  const addNewWarehouse = (e) => {
    e.preventDefault();
    if (name == "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        showConfirmButton: true,
      });
    } else {
      const jsonData = {
        name: name,
      };
      fetch("http://localhost:3000/createWarehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "Already") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "ชื่อนี้ถูกใช้แล้ว",
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มตำแหน่งจัดเก็บ สำเร็จ!",
              showConfirmButton: true,
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonText: "เพิ่มรายการ",
              cancelButtonText: "ปิด",
            }).then((result) => {
              if (!result.isConfirmed) {
                window.location.reload(false);
              } else {
                setName("");
              }
            });
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  return (
    <>
      {/* Modal add new warehouse */}
      <Modal show={props.showAdd} onHide={() => {props.setShow(false); window.location.reload(false); }}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="fw-bolder">เพิ่มตำแหน่งจัดเก็บ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <div className="form-group input-group-lg">
                    <label>ชื่อ</label>
                    <input
                      type="text"
                      name="p_name"
                      className="form-control"
                      placeholder="ชื่อตำแหน่งจัดเก็บ"
                      value={name}
                      required
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      type="submit"
                      name="submit"
                      className="btn btn-lg btn-success w-100 fw-bold"
                      onClick={addNewWarehouse}
                    >
                      เพิ่มตำแหน่งจัดเก็บ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
