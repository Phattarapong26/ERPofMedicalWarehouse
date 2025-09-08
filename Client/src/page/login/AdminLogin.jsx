import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) =>{
    e.preventDefault()
    const data = {
      user_name: username,
      user_password: password,
      role: 1
    }
    if(username == "" || password == ""){
      Swal.fire({
        position: "center",
        icon: "info",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        showConfirmButton: true,
      });
    }else{
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify(data),
      }).then(response => response.json())
      .then(data =>{
        if(data.status == "success"){
          sessionStorage.setItem('token',data.token)
          sessionStorage.setItem('username',data.user_name)
          window.location = '/admin/showAllUser'
        }else if(data.status == "not found"){
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "ไม่พบชื่อผู้ใช้",
            text: "กรุณาตรวจสอบชื่อผู้ใช้อีกครั้ง",
            showConfirmButton: true,
          });
        }else if(data.status == "error"){
          Swal.fire({
            position: "center",
            icon: "error",
            title: "รหัสผ่านไม่ถูกต้อง",
            showConfirmButton: true,
          });
        }
      }).catch((error)=>{
        console.log(error)
      })
    }
    
  }
  return (
    <>
      <div
        className="row h-auto col-lg-4 col-md-4 col-sm-12 d-flex flex-column justify-content-start align-items-center rounded-3 "
        style={{ backgroundColor: "var(--green)" }}
      >
        <div className="row h-auto mt-4">
          <Link to="/">
            <i className="fa-solid fa-arrow-left fs-2 text-white"></i>
          </Link>
        </div>
        <div className="row my-3">
          <i
            className="col-12 fa-solid fa-database d-flex flex-column justify-content-center align-items-center text-white"
            style={{ fontSize: "7rem" }}
          ></i>
          <div className="col fw-bold fs-2 d-flex flex-column justify-content-center align-items-center text-white">
            เข้าสู่ระบบผู้ดูแล
          </div>
        </div>

        <div className="row my-3">
          <form
            action="./method/loginOfficeDB.php"
            id="LoginFrom"
            method="POST"
            className="row h-auto d-flex flex-column justify-content-center align-items-center"
          >
            <div className="row">
              <div className="form-label text-white fs-4 fw-normal">
                รหัสประจำตัว
              </div>
              <input
                type="text"
                className="form-control form-control-lg"
                name="username"
                placeholder="กรอกรหัสประจำตัว"
                id="username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="row mt-3">
              <label className="form-label text-white fs-4 fw-normal">
                รหัสผ่าน
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                placeholder="กรอกรหัสผ่าน"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="row mt-5 mb-3">
              <button type="submit" className="col-12 btn btn-dark btn-lg" onClick={handleSubmit}>
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
