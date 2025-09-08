import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useOutletContext } from "react-router";
import Swal from "sweetalert2";
import { ModalPurchase } from "./ModalPurchase";
export function Purchase() {
  const { userName } = useOutletContext();
  const [validated, setValidated] = useState(false);

  const [productID, setProductID] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(50);
  const [inputAmount, setInputAmount] = useState(true);
  const [warning, setWarning] = useState(false);

  const [orderList, setOrderList] = useState([]);

  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseID,setPurchaseID] = useState();

  useEffect(() => {
    if (productID != "") {
      const jsonData = {
        id: productID,
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
          if (data[0].countID > 0) {
            fetch("http://localhost:3000/getDetail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsonData),
            })
              .then((response) => response.json())
              .then((data) => {
                setWarning(false);
                setValidated(true);
                setName(() => data[0].name);
                setUnit(() => data[0].unit_name);
                setType(() => data[0].type_name);
                setCategory(() => data[0].category_name);
                setInputAmount(false);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            setName("");
            setUnit("");
            setType("");
            setCategory("");
            setInputAmount(true);
            setValidated(false);
            setWarning(true)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }setWarning(false)
  }, [productID]);

  function handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setOrderList([
        ...orderList,
        {
          p_id: productID,
          name: name,
          quantity: amount,
          unit: unit,
          type: type,
          category: category,
        },
      ]);
      setProductID("");
      setName("");
      setUnit("");
      setType("");
      setCategory("");
      console.log(orderList);
    }
    setValidated(true);
  }

  const deleteOrder = (p_id) => {
    const updatedOrders = orderList.filter(order => order.p_id !== p_id);
    setOrderList(updatedOrders);
  };

  const orderSubmit = (e) => {
    e.preventDefault();
    const order = {
      user_name: userName,
      orderList: orderList,
    };
    fetch("http://localhost:3000/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "success") {
          const purchase_id = data.purchase_id;
          setPurchaseID(purchase_id);
          setShowPurchase(true);
          setName("");
          setUnit("");
          setType("");
          setCategory("");
          setInputAmount(true);
          setOrderList([])
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const cancelOrderList = () => {
    setProductID("");
    setName("");
    setUnit("");
    setType("");
    setCategory("");
    setInputAmount(true);
    setOrderList([]);
  };

  return (
    <>
  <ModalPurchase showPurchase={showPurchase} setShowPurchase={setShowPurchase} purchaseID={purchaseID} />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ใบสั่งซื้อยา</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <section className="content col-4">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header ">
                    <h3 className="card-title fw-bolder">รายการยา</h3>
                  </div>
                  <div className="card-body">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustom01"
                        >
                          <Form.Label>รหัสยา</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="รหัสยาที่ต้องการสั่งซื้อ"
                            value={productID}
                            onChange={(e) => {
                              setProductID(e.target.value);
                            }}
                          />
                          {warning ? (
                            <p className="text-danger p-0 m-0">
                              ไม่พบยารหัส {productID}
                            </p>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustom02"
                        >
                          <Form.Label>ชื่อยา</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ชื่อยา"
                            readOnly
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom01"
                        >
                          <Form.Label>หน่วย</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="หน่วย"
                            readOnly
                            value={unit}
                            onChange={(e) => {
                              setUnit(e.target.value);
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom01"
                        >
                          <Form.Label>ชนิด</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ชนิด"
                            readOnly
                            value={type}
                            onChange={(e) => {
                              setType(e.target.value);
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom01"
                        >
                          <Form.Label>ประเภท</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ประเภท"
                            readOnly
                            value={category}
                            onChange={(e) => {
                              setCategory(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustomUsername"
                        >
                          <Form.Label>จำนวน</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="number"
                              placeholder="จำนวนที่ต้องการสั่งซื้อ"
                              required
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                              }}
                              readOnly={inputAmount}
                            />
                          </InputGroup>
                        </Form.Group>
                      </Row>
                      <Button
                        className="col-12 fs-5 fw-bolder mt-4"
                        type="submit"
                        disabled={inputAmount}
                      >
                        เพิ่มรายการ
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content col">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">รายการคำสั่งซื้อ</h3>
                  </div>

                  <div className="card-body" style={{ minHeight: "438px" }}>
                    <table
                      id="example1"
                      className="table table-bordered table-striped"
                    >
                      <thead>
                        <tr>
                          <th className="col-1 text-center">รหัสยา</th>
                          <th>ชื่อ</th>
                          <th className="col-2 text-center">ชนิด</th>
                          <th className="col-2 text-center">ประเภท</th>
                          <th className="col-1 text-center">จำนวน</th>
                          <th className="col-2 ">หน่วย</th>
                          <th className="col-1 "></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderList.length == 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center">
                              ยังไม่มีรายการสั่งซื้อ{" "}
                            </td>
                          </tr>
                        ) : (
                          orderList.map((order) => {
                            return (
                              <tr key={order.p_id}>
                                <td>{order.p_id}</td>
                                <td>{order.name}</td>
                                <td>{order.type}</td>
                                <td>{order.category}</td>
                                <td>{order.quantity}</td>
                                <td>{order.unit}</td>
                                <td className="p-0 m-0 col-1">
                                  <button className="btn btn-lg btn-danger col-md-12 col-sm-12 rounded-0" onClick={() => deleteOrder(order.p_id)}>
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    <div className="row mt-5 justify-content-end">
                      {orderList.length == 0 ? (
                        ""
                      ) : (
                        <>
                          <button
                            className="btn btn-secondary col-2 me-4"
                            onClick={cancelOrderList}
                          >
                            ยกเลิก
                          </button>
                          <button
                            className="btn btn-success col-2 me-2"
                            onClick={orderSubmit}
                          >
                            ยืนยันคำสั่งซื้อ
                          </button>
                        </>
                      )}
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
