import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function AllUser() {
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:3000/userList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "error") {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
          });
          setUserList([]);
        } else {
          setUserList(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 1: return "badge bg-danger"; // Admin
      case 2: return "badge bg-primary"; // User
      case 3: return "badge bg-success"; // Manager
      default: return "badge bg-secondary";
    }
  };

  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <i className="fas fa-check-circle text-success fs-5"></i>
    ) : (
      <i className="fas fa-times-circle text-danger fs-5"></i>
    );
  };

  const filteredUsers = userList.filter((user) => {
    return search.toLowerCase() === ""
      ? user
      : user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.surname.toLowerCase().includes(search.toLowerCase()) ||
          user.user_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">
                <i className="fas fa-users me-3"></i>
                จัดการผู้ใช้งาน
              </h1>
            </div>
            <div className="col-sm-6">
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => {
                    Swal.fire({
                      title: "เพิ่มผู้ใช้ใหม่",
                      text: "ฟีเจอร์นี้จะพัฒนาในอนาคต",
                      icon: "info"
                    });
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  เพิ่มผู้ใช้ใหม่
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{userList.length}</h3>
                  <p>ผู้ใช้ทั้งหมด</p>
                </div>
                <div className="icon">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{userList.filter(u => u.role === 1).length}</h3>
                  <p>ผู้ดูแลระบบ</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{userList.filter(u => u.role === 3).length}</h3>
                  <p>ผู้จัดการ</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user-tie"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{userList.filter(u => u.role === 2).length}</h3>
                  <p>พนักงาน</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-list me-2"></i>
                    รายชื่อผู้ใช้งาน
                  </h3>
                  <div className="card-tools">
                    <div className="input-group input-group-sm" style={{width: '300px'}}>
                      <input
                        type="text"
                        className="form-control float-right"
                        placeholder="ค้นหาชื่อ, นามสกุล หรือ username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button type="button" className="btn btn-default">
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-2">กำลังโหลดข้อมูล...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center p-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">ไม่พบข้อมูลผู้ใช้</h5>
                      <p className="text-muted">ลองเปลี่ยนคำค้นหาหรือรีเฟรชหน้าใหม่</p>
                      <button className="btn btn-primary" onClick={fetchUsers}>
                        <i className="fas fa-sync-alt me-2"></i>
                        รีเฟรช
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th className="text-center">#</th>
                            <th>ข้อมูลผู้ใช้</th>
                            <th className="text-center">ตำแหน่ง</th>
                            <th className="text-center">สิทธิ์การใช้งาน</th>
                            <th className="text-center">วันที่สร้าง</th>
                            <th className="text-center">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user, index) => {
                            return (
                              <tr key={user.user_name}>
                                <td className="text-center align-middle">
                                  <strong>{index + 1}</strong>
                                </td>
                                <td className="align-middle">
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-circle me-3">
                                      <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold">
                                        {user.name} {user.surname}
                                      </div>
                                      <small className="text-muted">
                                        @{user.user_name}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center align-middle">
                                  <span className={getRoleBadgeColor(user.role)}>
                                    {user.role_name}
                                  </span>
                                </td>
                                <td className="text-center align-middle">
                                  <div className="d-flex justify-content-center gap-3">
                                    <div className="text-center">
                                      {getPermissionIcon(user.add_new)}
                                      <br />
                                      <small className="text-muted">เพิ่มยา</small>
                                    </div>
                                    <div className="text-center">
                                      {getPermissionIcon(user.purchase)}
                                      <br />
                                      <small className="text-muted">สั่งซื้อ</small>
                                    </div>
                                    <div className="text-center">
                                      {getPermissionIcon(user.withdraw)}
                                      <br />
                                      <small className="text-muted">เบิกออก</small>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center align-middle">
                                  <small className="text-muted">
                                    {new Date(user.created_at).toLocaleDateString('th-TH', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </small>
                                </td>
                                <td className="text-center align-middle">
                                  <div className="btn-group" role="group">
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => {
                                        Swal.fire({
                                          title: "แก้ไขข้อมูลผู้ใช้",
                                          text: `แก้ไขข้อมูล ${user.name} ${user.surname}`,
                                          icon: "info",
                                          footer: "ฟีเจอร์นี้จะพัฒนาในอนาคต"
                                        });
                                      }}
                                      title="แก้ไข"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-info btn-sm"
                                      onClick={() => {
                                        const roleColor = user.role === 1 ? '#dc3545' : user.role === 3 ? '#28a745' : '#007bff';
                                        const roleIcon = user.role === 1 ? 'fas fa-user-shield' : user.role === 3 ? 'fas fa-user-tie' : 'fas fa-user';
                                        
                                        Swal.fire({
                                          title: '',
                                          html: `
                                            <div class="user-profile-popup">
                                              <!-- Header Section -->
                                              <div class="profile-header" style="background: linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%); padding: 30px 20px; margin: -20px -20px 25px -20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
                                                <div class="profile-avatar" style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 3px solid rgba(255,255,255,0.3);">
                                                  <i class="${roleIcon}" style="font-size: 35px; color: white;"></i>
                                                </div>
                                                <h3 style="margin: 0 0 5px 0; font-weight: bold;">${user.name} ${user.surname}</h3>
                                                <p style="margin: 0; opacity: 0.9; font-size: 16px;">@${user.user_name}</p>
                                                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 14px; margin-top: 10px; display: inline-block;">${user.role_name}</span>
                                              </div>
                                              
                                              <!-- Info Section -->
                                              <div class="profile-info" style="text-align: left;">
                                                <div class="info-row" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                                                  <div style="width: 40px; text-align: center; margin-right: 15px;">
                                                    <i class="fas fa-id-card" style="color: #6c757d; font-size: 18px;"></i>
                                                  </div>
                                                  <div>
                                                    <div style="font-weight: 600; color: #495057;">รหัสผู้ใช้</div>
                                                    <div style="color: #6c757d; font-size: 14px;">${user.user_name}</div>
                                                  </div>
                                                </div>
                                                
                                                <div class="info-row" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                                                  <div style="width: 40px; text-align: center; margin-right: 15px;">
                                                    <i class="fas fa-calendar-alt" style="color: #6c757d; font-size: 18px;"></i>
                                                  </div>
                                                  <div>
                                                    <div style="font-weight: 600; color: #495057;">วันที่เข้าร่วม</div>
                                                    <div style="color: #6c757d; font-size: 14px;">${new Date(user.created_at).toLocaleDateString('th-TH', {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric'
                                                    })}</div>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <!-- Permissions Section -->
                                              <div class="permissions-section" style="margin-top: 25px;">
                                                <h4 style="color: #495057; margin-bottom: 15px; font-size: 16px; font-weight: 600;">
                                                  <i class="fas fa-key" style="margin-right: 8px; color: #6c757d;"></i>
                                                  สิทธิ์การใช้งาน
                                                </h4>
                                                <div class="permissions-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                                                  <div class="permission-card" style="text-align: center; padding: 15px; border-radius: 10px; background: ${user.add_new ? '#d4edda' : '#f8d7da'}; border: 1px solid ${user.add_new ? '#c3e6cb' : '#f5c6cb'};">
                                                    <i class="fas fa-plus-circle" style="font-size: 24px; color: ${user.add_new ? '#155724' : '#721c24'}; margin-bottom: 8px;"></i>
                                                    <div style="font-weight: 600; color: ${user.add_new ? '#155724' : '#721c24'}; font-size: 14px;">เพิ่มยา</div>
                                                    <div style="font-size: 12px; color: ${user.add_new ? '#155724' : '#721c24'}; opacity: 0.8;">${user.add_new ? 'อนุญาต' : 'ไม่อนุญาต'}</div>
                                                  </div>
                                                  
                                                  <div class="permission-card" style="text-align: center; padding: 15px; border-radius: 10px; background: ${user.purchase ? '#d4edda' : '#f8d7da'}; border: 1px solid ${user.purchase ? '#c3e6cb' : '#f5c6cb'};">
                                                    <i class="fas fa-shopping-cart" style="font-size: 24px; color: ${user.purchase ? '#155724' : '#721c24'}; margin-bottom: 8px;"></i>
                                                    <div style="font-weight: 600; color: ${user.purchase ? '#155724' : '#721c24'}; font-size: 14px;">สั่งซื้อ</div>
                                                    <div style="font-size: 12px; color: ${user.purchase ? '#155724' : '#721c24'}; opacity: 0.8;">${user.purchase ? 'อนุญาต' : 'ไม่อนุญาต'}</div>
                                                  </div>
                                                  
                                                  <div class="permission-card" style="text-align: center; padding: 15px; border-radius: 10px; background: ${user.withdraw ? '#d4edda' : '#f8d7da'}; border: 1px solid ${user.withdraw ? '#c3e6cb' : '#f5c6cb'};">
                                                    <i class="fas fa-sign-out-alt" style="font-size: 24px; color: ${user.withdraw ? '#155724' : '#721c24'}; margin-bottom: 8px;"></i>
                                                    <div style="font-weight: 600; color: ${user.withdraw ? '#155724' : '#721c24'}; font-size: 14px;">เบิกออก</div>
                                                    <div style="font-size: 12px; color: ${user.withdraw ? '#155724' : '#721c24'}; opacity: 0.8;">${user.withdraw ? 'อนุญาต' : 'ไม่อนุญาต'}</div>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <!-- Footer -->
                                              <div class="profile-footer" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                                                <small style="color: #6c757d;">
                                                  <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                                                  ข้อมูลล่าสุด: ${new Date().toLocaleDateString('th-TH')}
                                                </small>
                                              </div>
                                            </div>
                                          `,
                                          showConfirmButton: true,
                                          confirmButtonText: 'ปิด',
                                          confirmButtonColor: roleColor,
                                          width: 600,
                                          padding: '20px',
                                          background: '#fff',
                                          backdrop: 'rgba(0,0,0,0.4)',
                                          showClass: {
                                            popup: 'animate__animated animate__fadeInUp animate__faster'
                                          },
                                          hideClass: {
                                            popup: 'animate__animated animate__fadeOutDown animate__faster'
                                          }
                                        });
                                      }}
                                      title="ดูรายละเอียด"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        Swal.fire({
                                          title: "ยืนยันการลบ",
                                          text: `คุณต้องการลบผู้ใช้ ${user.name} ${user.surname} หรือไม่?`,
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#d33",
                                          cancelButtonColor: "#3085d6",
                                          confirmButtonText: "ลบ",
                                          cancelButtonText: "ยกเลิก"
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            Swal.fire({
                                              title: "ฟีเจอร์การลบ",
                                              text: "ฟีเจอร์นี้จะพัฒนาในอนาคต",
                                              icon: "info"
                                            });
                                          }
                                        });
                                      }}
                                      title="ลบ"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .avatar-circle {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }
        
        .small-box {
          border-radius: 10px;
          position: relative;
          display: block;
          margin-bottom: 20px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.1);
        }
        
        .small-box > .inner {
          padding: 10px;
        }
        
        .small-box > .small-box-footer {
          position: relative;
          text-align: center;
          padding: 3px 0;
          color: #fff;
          color: rgba(255,255,255,0.8);
          display: block;
          z-index: 10;
          background: rgba(0,0,0,0.1);
          text-decoration: none;
        }
        
        .small-box > .small-box-footer:hover {
          color: #fff;
          background: rgba(0,0,0,0.15);
        }
        
        .small-box h3 {
          font-size: 2.2rem;
          font-weight: bold;
          margin: 0 0 10px 0;
          white-space: nowrap;
          padding: 0;
        }
        
        .small-box p {
          font-size: 1rem;
        }
        
        .small-box .icon {
          -webkit-transition: all .3s linear;
          -o-transition: all .3s linear;
          transition: all .3s linear;
          position: absolute;
          top: -10px;
          right: 10px;
          z-index: 0;
          font-size: 90px;
          color: rgba(0,0,0,0.15);
        }
        
        .small-box:hover {
          text-decoration: none;
          color: #f9f9f9;
        }
        
        .small-box:hover .icon {
          font-size: 95px;
        }
        
        .bg-info {
          background-color: #17a2b8 !important;
          color: white;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
          color: white;
        }
        
        .bg-success {
          background-color: #28a745 !important;
          color: white;
        }
        
        .bg-primary {
          background-color: #007bff !important;
          color: white;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(0,0,0,.075);
        }
        
        .btn-group .btn {
          margin-right: 2px;
        }
        
        .btn-group .btn:last-child {
          margin-right: 0;
        }
      `}</style>
    </>
  );
}
