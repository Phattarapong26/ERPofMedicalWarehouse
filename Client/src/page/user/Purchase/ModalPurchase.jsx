import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Check from "../../../assets/Check.json";
import Lottie from "lottie-react";
import Table from "react-bootstrap/Table";
import { Button } from "antd";

export function ModalPurchase(props) {
  const show =props.showPurchase
  const purchaseID = props.purchaseID;
  const desiredLength = Math.max(String(purchaseID).length, 5); // Ensure minimum length of 5
  const formattedNumber = String(purchaseID).padStart(desiredLength, "0");

  const [purchaseDetail, setPurchaseDetail] = useState([]);

  useEffect(() => {
   if(show == true){
    const fetchData = async () => {
      try {
        const jsonData = {
          purchase_id: purchaseID,
        };
        const response = await fetch("http://localhost:3000/purchaseDetail", {
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
        if (Array.isArray(data)) {
          setPurchaseDetail(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching purchase detail:", error);
      }
    };

    if (purchaseID !== 0) {
      fetchData();
    }
   }
  }, [purchaseID,show]);

  return (
    <>
      <Modal
        show={props.showPurchase}
        onHide={() => {
          props.setShowPurchase(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title className="fw-bolder">รายละเอียดคำสั่งซื้อ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row d-flex justify-content-center">
            <div className="col-4 mb-3">
              <Lottie animationData={Check} height={50} width={50} loop={false} />
            </div>
            <h2 className="text-center fw-bolder">คำสั่งซื้อ {formattedNumber}</h2>
            <Table responsive="lg" borderless="true" hover>
              <tbody>
                {purchaseDetail.map((item,index) => (
                  <tr key={item.p_id}>
                    <td>{index+1}</td>
                    <td>รหัสยา : {item.p_id}</td>
                    <td>ชื่อ : {item.name}</td>
                    <td>{item.quantity}{" "}{item.unit_name}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="col-12">
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
