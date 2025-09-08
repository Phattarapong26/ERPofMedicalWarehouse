import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";

export function ExportHistory() {
  const localhost = "http://localhost:3000";

  const [search, setSearch] = useState("");
  const [exportHistory, setExportHistory] = useState([]);

  const getPurchaseHistory = async () => {
    try {
      const response = await axios.get(localhost + "/exportHistory");
      if(response.data.status === "success"){
        setExportHistory(response.data.data);
      }else if(response.data.status === "No import"){
        setExportHistory([]);
      }
      
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    getPurchaseHistory();
  }, []);


  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ประวัติการเบิกออก</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <section className="content col">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header row">
                    <form className="d-flex flex-row flex-wrap justify-content-start align-items-center col-md-8 col-sm-12">
                      <input
                        className="form-control col-12 border-1 "
                        type="text"
                        placeholder="search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                    </form>
                  </div>

                  <div className="card-body" style={{ maxHeight: "590px", overflowY: "auto" }}>
                    <Accordion alwaysOpen>
                      {exportHistory.length == 0 ? <div className="text-center fs-3">ไม่มีรายการนำเข้า</div> :
                      exportHistory
                      .filter(
                        (item) =>
                        item.export_id
                            .toLowerCase()
                            .includes(search) ||
                            item.date.toLowerCase().includes(search) ||
                            item.importer.toLowerCase().includes(search)
                      )
                      .map((item) => (
                        <Accordion.Item
                          eventKey={item.export_id}
                          key={item.export_id}
                        >
                          <Accordion.Header>
                            <div className="row col-12 d-flex justify-content-between align-items-center px-5">
                              <div className="col-3">
                                ใบเบิกหมายเลข : {item.export_id}
                              </div>
                              <div className="col-2">
                                วันที่ :{" "}
                                {new Date(item.date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </div>
                              <div className="col-3">
                                นำเข้าโดย : {item.exporter}
                              </div>
                              <div className="col-3">
                                ผู้รับ : {item.receiver}
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Table borderless>
                            <tbody>
                              {item.details.map((detail) => (
                                <tr key={detail.id}>
                                  <td className="col-1">
                                    รหัสยา : {detail.p_id}
                                  </td>
                                  <td className="col-1">
                                    ชื่อยา : {detail.name}
                                  </td>
                                  <td className="col-1">
                                    จำนวน : {detail.quantity}{" "}
                                    {detail.unit_name}
                                  </td>
                                  <td className="col-1">
                                    วันหมดอายุ :{" "}
                                    {new Date(
                                          detail.exp_date
                                        ).toLocaleDateString("en-GB")}
                                  </td>
                                  <td className="col-1">
                                    ตำแหน่งจัดเก็บ :{" "}
                                    {detail.Location_name}
                                  </td>
                                </tr>
                              ))}
                              </tbody>
                              </Table>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                    </Accordion>
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
