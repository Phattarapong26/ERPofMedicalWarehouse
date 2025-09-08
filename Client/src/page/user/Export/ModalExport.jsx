import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Check from "../../../assets/Check.json";
import Lottie from "lottie-react";
import Table from "react-bootstrap/Table";
import { Button } from "antd";

export function ModalExport(props) {
    const show =props.showExport;
  const exportID = props.exportID;
  const receiver = props.receiver;
  const desiredLength = Math.max(String(exportID).length, 5); // Ensure minimum length of 5
  const formattedNumber = String(exportID).padStart(desiredLength, "0");

  const [exportDetail, setExportDetail] = useState([]);

  useEffect(() => {
    if(show == true){
        const fetchData = async () => {
            try {
              const jsonData = {
                  export_id: exportID,
              };
              const response = await fetch("http://localhost:3000/exportDetail", {
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
                setExportDetail(data);
              } else {
                console.error("Received data is not an array:", data);
              }
            } catch (error) {
              console.error("Error fetching purchase detail:", error);
            }
          };
      
          if (exportID !== 0) {
            fetchData();
          }
    }
  }, [exportID,show]);

  return (
    <>
      <Modal
        show={props.showExport}
        onHide={() => {
          props.setShowExport(false);
          window.location.reload()
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title className="fw-bolder">รายละเอียดการเบิก</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row d-flex justify-content-center">
            <div className="col-4 mb-3">
              <Lottie
                animationData={Check}
                height={50}
                width={50}
                loop={false}
              />
            </div>
            <h2 className="text-center fw-bolder">
              ใบเบิกหมายเลข {formattedNumber}
            </h2>
            
            <Table responsive="lg" borderless="true" hover>
              <tbody>
                {exportDetail.map((item, index) => (
                  <tr key={item.p_id}>
                    <td>{index + 1}</td>
                    <td>รหัสยา : {item.p_id}</td>
                    <td>ชื่อ : {item.name}</td>
                    <td>
                      {item.quantity} {item.unit_name}
                    </td>
                    <td>
                      จาก : {item.Location_name}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h3 className="text-center ">
              ผู้รับ : {receiver}
            </h3>
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
