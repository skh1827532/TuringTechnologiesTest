import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import AppContext from "../context/AppContext";

const Login = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: "30vw",
    height: "38px", // Adjust height as needed for a smaller appearance
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4EEED",
        height: "90vh",

        width: "100vw",
      }}
    >
      <Container
        style={{
          padding: "50px",
          background: "white",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "40%",
        }}
      >
        <Form style={{ width: "100%" }}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="12">
              Email
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="12">
              Password
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Col>
          </Form.Group>

          <Button
            variant="primary"
            onClick={() =>
              login(userDetails.email, userDetails.password, () =>
                navigate("/")
              )
            }
            style={{ width: "20%" }}
          >
            Log in
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
