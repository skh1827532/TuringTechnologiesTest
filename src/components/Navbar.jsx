import React from "react";
import TTLogo from "../assets/Logo.png";
import "../App.css";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "10vh",

        paddingRight: "2rem",
        overflow: "hidden",
        paddingLeft: "2rem",
        // marginTop: "1rem",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        borderBottom: "2px solid #dee2e6",
      }}
    >
      <div>
        <img src={TTLogo} style={{ width: "300px" }} alt="image Not Found" />
      </div>
      {location.pathname === "/" ? (
        <div>
          <Button
            variant="primary"
            style={{ width: "10vw" }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
