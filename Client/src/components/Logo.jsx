import MedlabLogo from "/img/LogoWhite.png";

export function Logo() {
  return (
    <div className="icon d-flex justify-content-center align-items-center py-2 ">
      <div
        className="logo-icon justify-content-center align-items-center"
      >
        <img src={MedlabLogo} alt="Medlab Logo" className="logo-icon" style={{ width: "60px", height: "60px" }}/>
      </div>
    </div>
  );
}
