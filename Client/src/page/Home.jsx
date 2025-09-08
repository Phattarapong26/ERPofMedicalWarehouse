import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';

export function Home() {
  const [isVisible, setIsVisible] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Bootstrap carousel
    if (typeof window !== 'undefined' && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(document.querySelector('#prCarousel'), {
        interval: 4000,
        wrap: true
      });
      
      // Smooth scrolling for anchor links
      const handleSmoothScroll = (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      };

      // Add smooth scrolling to all anchor links
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
      });

      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({
                ...prev,
                [entry.target.id]: true
              }));
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe sections
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));

      // Handle scroll for back to top button
      const handleScroll = () => {
        setShowBackToTop(window.scrollY > 300);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        carousel.dispose();
        anchorLinks.forEach(link => {
          link.removeEventListener('click', handleSmoothScroll);
        });
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const features = [
    {
      icon: "fa-solid fa-chart-line",
      title: "Dashboard ภาพรวม",
      description: "ติดตามสถานะสินค้าคงคลัง สต๊อกยา และข้อมูลสำคัญแบบเรียลไทม์",
      color: "#0057ff"
    },
    {
      icon: "fa-solid fa-pills",
      title: "จัดการยา",
      description: "เพิ่ม แก้ไข และติดตามข้อมูลยาทุกประเภท พร้อมระบบแจ้งเตือนหมดอายุ",
      color: "#00ab1b"
    },
    {
      icon: "fa-solid fa-warehouse",
      title: "จัดการคลังสินค้า",
      description: "บริหารตำแหน่งจัดเก็บ ติดตามพื้นที่ว่าง และจัดระเบียบคลังอย่างมีประสิทธิภาพ",
      color: "#fc3c00"
    },
    {
      icon: "fa-solid fa-truck-loading",
      title: "นำเข้า-ส่งออก",
      description: "จัดการการนำเข้าและส่งออกสินค้า พร้อมระบบติดตามและบันทึกประวัติ",
      color: "#01b3cc"
    },
    {
      icon: "fa-solid fa-shopping-cart",
      title: "จัดซื้อสินค้า",
      description: "วางแผนการจัดซื้อ ติดตามคำสั่งซื้อ และจัดการกับผู้จำหน่าย",
      color: "#fbb500"
    },
    {
      icon: "fa-solid fa-chart-bar",
      title: "รายงานและวิเคราะห์",
      description: "สร้างรายงานการเคลื่อนไหวสินค้า วิเคราะห์แนวโน้ม และสถิติการใช้งาน",
      color: "#ed0000"
    }
  ];

  const stats = [
    { number: "24/7", label: "ระบบทำงานต่อเนื่อง", icon: "fa-solid fa-clock" },
    { number: "100%", label: "ความปลอดภัยข้อมูล", icon: "fa-solid fa-shield-alt" },
    { number: "Real-time", label: "ข้อมูลแบบเรียลไทม์", icon: "fa-solid fa-sync-alt" },
    { number: "Multi-user", label: "รองรับผู้ใช้หลายคน", icon: "fa-solid fa-users" }
  ];

  return (
    <div className="vw-100 vh-100 m-0 p-0" style={{ backgroundColor: "#1c3e57", overflowX: "hidden" }}>
      {/* Hero Section */}
      <section className="position-relative d-flex align-items-center" 
               style={{ 
                 background: "linear-gradient(135deg, #1c3e57 0%, #2c5f7a 50%, #1c3e57 100%)",
                 minHeight: "100vh",
                 overflow: "visible"
               }}>
        <div className="container-fluid px-4 py-5">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-5 text-white">
              <div className="pe-lg-4">
                <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInUp">
                  <span className="text-info d-block mb-2">Medical</span>
                  Warehouse System
                </h1>
                <h2 className="h3 mb-4 fw-light animate__animated animate__fadeInUp animate__delay-1s" style={{ lineHeight: "1.5" }}>
                  ระบบบริหารจัดการคลังสินค้าทางการแพทย์ที่ครบวงจร
                </h2>
                <div className="bg-white bg-opacity-10 p-4 rounded-4 mb-5 animate__animated animate__fadeInUp animate__delay-2s">
                  <h3 className="h5 text-info mb-3">ระบบของเราช่วยคุณได้อย่างไร?</h3>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3 d-flex align-items-center">
                      <i className="fa-solid fa-check-circle text-success me-3"></i>
                      <span>ติดตามสินค้าคงคลังแบบเรียลไทม์</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <i className="fa-solid fa-check-circle text-success me-3"></i>
                      <span>แจ้งเตือนยาใกล้หมดอายุอัตโนมัติ</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <i className="fa-solid fa-check-circle text-success me-3"></i>
                      <span>วิเคราะห์การใช้งานยาและเวชภัณฑ์</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="fa-solid fa-check-circle text-success me-3"></i>
                      <span>จัดการคลังสินค้าอย่างมีประสิทธิภาพ</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center text-lg-start" style={{ zIndex: 1000, position: "relative" }}>
                  <div style={{ position: "relative", zIndex: 9999 }}>
                    <a 
                          href="/selectRole"
                          className="btn btn-info btn-lg px-5 py-3 rounded-pill me-3 mb-3 mb-lg-0 text-decoration-none"
                          style={{
                            background: "linear-gradient(45deg, #00a8ff, #0097e6)",
                            border: "2px solid transparent",
                            boxShadow: "0 4px 15px rgba(0, 168, 255, 0.3)",
                            transition: "all 0.3s ease",
                            zIndex: 9999,
                            position: "relative",
                            cursor: "pointer",
                            display: "inline-block",
                            color: "white !important",
                            pointerEvents: "auto",
                            textDecoration: "none !important"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 8px 25px rgba(0, 168, 255, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(0, 168, 255, 0.3)";
                          }}>
                      <i className="fa-solid fa-rocket me-2"></i>
                      เริ่มใช้งานระบบ
                    </a>
                  </div>
                  <a href="#features" 
                     className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill position-relative overflow-hidden"
                     style={{
                       borderWidth: "2px",
                       transition: "all 0.3s ease"
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                       e.target.style.transform = "translateY(-2px)";
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = "transparent";
                       e.target.style.transform = "translateY(0)";
                     }}>
                    <i className="fa-solid fa-play-circle me-2"></i>
                    ดูฟีเจอร์ทั้งหมด
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0">
              {/* PR Images Carousel */}
              <div id="prCarousel" 
                   className="carousel slide shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeIn" 
                   data-bs-ride="carousel"
                   style={{
                     border: "1px solid rgba(255, 255, 255, 0.1)",
                     background: "rgba(255, 255, 255, 0.05)"
                   }}>
                <div className="carousel-indicators">
                  <button type="button" data-bs-target="#prCarousel" data-bs-slide-to="0" className="active rounded-circle mx-2" style={{ width: "10px", height: "10px" }}></button>
                  <button type="button" data-bs-target="#prCarousel" data-bs-slide-to="1" className="rounded-circle mx-2" style={{ width: "10px", height: "10px" }}></button>
                  <button type="button" data-bs-target="#prCarousel" data-bs-slide-to="2" className="rounded-circle mx-2" style={{ width: "10px", height: "10px" }}></button>
                  <button type="button" data-bs-target="#prCarousel" data-bs-slide-to="3" className="rounded-circle mx-2" style={{ width: "10px", height: "10px" }}></button>
                  <button type="button" data-bs-target="#prCarousel" data-bs-slide-to="4" className="rounded-circle mx-2" style={{ width: "10px", height: "10px" }}></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="position-relative">
                      <img src="/PR/PR01.png" 
                           className="d-block w-100" 
                           alt="ระบบจัดการคลังยา" 
                           style={{ 
                             height: "500px", 
                             objectFit: "contain",
                             backgroundColor: "rgba(0, 0, 0, 0.02)",
                             padding: "20px"
                           }} />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4 mx-4">
                        <h5 className="mb-2 fw-bold">ระบบจัดการคลังยาที่ทันสมัย</h5>
                        <p className="mb-0 small">ควบคุมและติดตามสถานะยาได้แบบเรียลไทม์</p>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="position-relative">
                      <img src="/PR/PR02.png" 
                           className="d-block w-100" 
                           alt="การจัดการสต็อก" 
                           style={{ 
                             height: "500px", 
                             objectFit: "contain",
                             backgroundColor: "rgba(0, 0, 0, 0.02)",
                             padding: "20px"
                           }} />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4 mx-4">
                        <h5 className="mb-2 fw-bold">การจัดการสต็อกอัจฉริยะ</h5>
                        <p className="mb-0 small">ระบบแจ้งเตือนและติดตามสต็อกอัตโนมัติ</p>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="position-relative">
                      <img src="/PR/PR03.png" 
                           className="d-block w-100" 
                           alt="การติดตามสินค้า" 
                           style={{ 
                             height: "500px", 
                             objectFit: "contain",
                             backgroundColor: "rgba(0, 0, 0, 0.02)",
                             padding: "20px"
                           }} />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4 mx-4">
                        <h5 className="mb-2 fw-bold">ติดตามสินค้าแบบครบวงจร</h5>
                        <p className="mb-0 small">ระบบติดตามการเคลื่อนไหวสินค้าแบบเรียลไทม์</p>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="position-relative">
                      <img src="/PR/PR04.png" 
                           className="d-block w-100" 
                           alt="รายงานและวิเคราะห์" 
                           style={{ 
                             height: "500px", 
                             objectFit: "contain",
                             backgroundColor: "rgba(0, 0, 0, 0.02)",
                             padding: "20px"
                           }} />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4 mx-4">
                        <h5 className="mb-2 fw-bold">รายงานและการวิเคราะห์</h5>
                        <p className="mb-0 small">วิเคราะห์ข้อมูลเชิงลึกพร้อมรายงานที่ครบครัน</p>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="position-relative">
                      <img src="/PR/PR05.png" 
                           className="d-block w-100" 
                           alt="ภาพรวมระบบ" 
                           style={{ 
                             height: "500px", 
                             objectFit: "contain",
                             backgroundColor: "rgba(0, 0, 0, 0.02)",
                             padding: "20px"
                           }} />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4 mx-4">
                        <h5 className="mb-2 fw-bold">ภาพรวมระบบทั้งหมด</h5>
                        <p className="mb-0 small">ระบบจัดการคลังสินค้าที่ครบวงจร</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#prCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#prCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f8f9fa" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light position-relative">
        <div className="container-fluid px-4">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 text-center border-0 shadow-sm" 
                     style={{ 
                       transition: "transform 0.3s ease",
                       cursor: "pointer"
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                     onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-center mb-3 mx-auto" 
                         style={{
                           width: "80px",
                           height: "80px",
                           borderRadius: "50%",
                           background: "linear-gradient(135deg, #e6f3ff 0%, #f0f9ff 100%)"
                         }}>
                      <i className={`${stat.icon} display-4 text-primary`}></i>
                    </div>
                    <h3 className="h2 fw-bold text-dark mb-2">{stat.number}</h3>
                    <p className="text-muted mb-0 fs-6">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-5 bg-white ${isVisible.features ? 'animate__animated animate__fadeInUp' : ''}`}>
        <div className="container-fluid px-4">
          <div className="text-center mb-5">
            <span className="badge bg-info text-white px-3 py-2 rounded-pill mb-3">ฟีเจอร์ทั้งหมด</span>
            <h2 className="display-5 fw-bold text-dark mb-3">ฟีเจอร์หลักของระบบ</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              ระบบจัดการคลังสินค้าที่ครอบคลุมทุกความต้องการในการบริหารจัดการ พร้อมฟีเจอร์ที่ช่วยให้การทำงานของคุณง่ายขึ้น
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className={`card h-100 border-0 shadow-sm feature-card animate__animated animate__fadeInUp`}
                     style={{ 
                       transition: "all 0.3s ease",
                       cursor: "pointer",
                       background: `linear-gradient(180deg, white, ${feature.color}0A)`,
                       animationDelay: `${index * 0.1}s`
                     }}
                     onClick={() => navigate('/selectRole')}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                       e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
                       e.currentTarget.style.borderLeft = `4px solid ${feature.color}`;
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = "translateY(0) scale(1)";
                       e.currentTarget.style.boxShadow = "";
                       e.currentTarget.style.borderLeft = "none";
                     }}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon me-3 p-3 rounded-3" 
                           style={{ 
                             background: `${feature.color}1A`,
                             color: feature.color 
                           }}>
                        <i className={`${feature.icon} fs-3`}></i>
                      </div>
                      <h3 className="h5 fw-bold text-dark mb-0">{feature.title}</h3>
                    </div>
                    <p className="text-muted mb-0 fs-6">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid px-4">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold text-dark mb-4">ทำไมต้องเลือกระบบของเรา?</h2>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <i className="fa-solid fa-check-circle text-success fs-4 mt-1"></i>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-2">ใช้งานง่าย</h4>
                    <p className="text-muted mb-0">Interface ที่เป็นมิตรกับผู้ใช้ เรียนรู้ได้ง่าย</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <i className="fa-solid fa-check-circle text-success fs-4 mt-1"></i>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-2">ความปลอดภัยสูง</h4>
                    <p className="text-muted mb-0">ระบบรักษาความปลอดภัยข้อมูลระดับสูง</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <i className="fa-solid fa-check-circle text-success fs-4 mt-1"></i>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-2">รายงานครบถ้วน</h4>
                    <p className="text-muted mb-0">สร้างรายงานและวิเคราะห์ข้อมูลได้แบบเรียลไทม์</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <i className="fa-solid fa-check-circle text-success fs-4 mt-1"></i>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-2">ประหยัดเวลา</h4>
                    <p className="text-muted mb-0">ลดเวลาในการทำงาน เพิ่มประสิทธิภาพการจัดการ</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div className="d-flex align-items-end gap-3" style={{ height: "200px" }}>
                <div className="text-center">
                  <div className="bg-primary rounded-top" style={{ width: "60px", height: "160px" }}></div>
                  <small className="fw-bold text-dark mt-2 d-block">ประสิทธิภาพ</small>
                </div>
                <div className="text-center">
                  <div className="bg-success rounded-top" style={{ width: "60px", height: "190px" }}></div>
                  <small className="fw-bold text-dark mt-2 d-block">ความปลอดภัย</small>
                </div>
                <div className="text-center">
                  <div className="bg-warning rounded-top" style={{ width: "60px", height: "180px" }}></div>
                  <small className="fw-bold text-dark mt-2 d-block">ความสะดวก</small>
                </div>
                <div className="text-center">
                  <div className="bg-info rounded-top" style={{ width: "60px", height: "170px" }}></div>
                  <small className="fw-bold text-dark mt-2 d-block">ประหยัดต้นทุน</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-white" style={{ background: "linear-gradient(135deg, #1c3e57, #2c5f7a)" }}>
        <div className="container-fluid px-4 text-center">
          <h2 className="display-6 fw-bold mb-3">พร้อมเริ่มต้นใช้งานแล้วหรือยัง?</h2>
          <p className="lead mb-4">เข้าสู่ระบบและเริ่มจัดการคลังสินค้าของคุณอย่างมีประสิทธิภาพ</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button 
                  onClick={() => navigate('/selectRole')}
                  className="btn btn-success btn-lg px-4 py-3 rounded-pill position-relative overflow-hidden"
                  style={{
                    transition: "all 0.3s ease",
                    background: "linear-gradient(45deg, #28a745, #20c997)",
                    border: "none"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(40, 167, 69, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}>
              <i className="fa-solid fa-sign-in-alt me-2"></i>
              เข้าสู่ระบบ
            </button>
            <button 
                  className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill"
                  style={{
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => {
                    alert('ติดต่อเรา: support@warehouse-system.com หรือ โทร 02-XXX-XXXX');
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "translateY(0)";
                  }}>
              <i className="fa-solid fa-question-circle me-2"></i>
              ต้องการความช่วยเหลือ?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container-fluid px-4">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="h5 text-info mb-3">Warehouse Monitoring System</h3>
              <p className="text-light-emphasis">ระบบจัดการคลังสินค้าทางการแพทย์ที่ทันสมัยและมีประสิทธิภาพ</p>
            </div>
            <div className="col-lg-4">
              <h4 className="h6 text-info mb-3">ติดต่อเรา</h4>
              <p className="text-light-emphasis mb-2">
                <i className="fa-solid fa-envelope text-primary me-2"></i>
                support@warehouse-system.com
              </p>
              <p className="text-light-emphasis mb-0">
                <i className="fa-solid fa-phone text-primary me-2"></i>
                02-XXX-XXXX
              </p>
            </div>
            <div className="col-lg-4">
              <h4 className="h6 text-info mb-3">ลิงก์ด่วน</h4>
              <div className="d-flex flex-column gap-2">
                <Link to="/selectRole" 
                      className="text-light-emphasis text-decoration-none"
                      style={{ transition: "color 0.3s ease" }}
                      onMouseEnter={(e) => e.target.style.color = "#00a8ff"}
                      onMouseLeave={(e) => e.target.style.color = ""}>
                  เข้าสู่ระบบ
                </Link>
                <a href="#features" 
                   className="text-light-emphasis text-decoration-none"
                   style={{ transition: "color 0.3s ease" }}
                   onMouseEnter={(e) => e.target.style.color = "#00a8ff"}
                   onMouseLeave={(e) => e.target.style.color = ""}>
                  ฟีเจอร์
                </a>
                <button 
                   className="text-light-emphasis text-decoration-none bg-transparent border-0 p-0 text-start"
                   style={{ transition: "color 0.3s ease" }}
                   onClick={scrollToTop}
                   onMouseEnter={(e) => e.target.style.color = "#00a8ff"}
                   onMouseLeave={(e) => e.target.style.color = ""}>
                  กลับด้านบน
                </button>
              </div>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <div className="text-center text-light-emphasis">
            <p className="mb-0">&copy; 2024 Warehouse Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        className="btn btn-primary position-fixed rounded-circle shadow-lg"
        style={{
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          zIndex: 1000,
          background: "linear-gradient(45deg, #00a8ff, #0097e6)",
          border: "none",
          transition: "all 0.3s ease",
          opacity: showBackToTop ? 1 : 0,
          visibility: showBackToTop ? 'visible' : 'hidden'
        }}
        onClick={scrollToTop}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 8px 25px rgba(0, 168, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "";
        }}
      >
        <i className="fa-solid fa-arrow-up text-white"></i>
      </button>
    </div>
  );
}
