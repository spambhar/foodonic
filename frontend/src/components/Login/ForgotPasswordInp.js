import "../Home/Body.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Footer from "../Home/Footer";
import Navbar from "../Home/Navbar";
import {
  CDBInput,
  CDBCard,
  CDBCardBody,
  CDBBtn,
  CDBSpinner,
  CDBContainer,
} from "cdbreact";
import axios from "axios";
import { useParams, useHistory } from "react-router";

const ForgotPasswordInp = () => {
  const [email, setEmail] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const sendReq = () => {
    setShowSpinner(true);
    axios({
      method: "POST",
      url: "http://localhost:8000/password-reset/",
      data: { email: email },
    })
      .then((response) => {
        alert("Reset link sent to your email id.");
        setShowSpinner(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.email);
        setShowSpinner(false);
      });
  };
  return (
    <div>
      <Navbar />
      <CDBContainer className="fs-4 d-flex justify-content-center py-5 mt-5">
        <CDBCard style={{ width: "50rem" }}>
          <CDBCardBody className="mx-4">
            <div className="text-center mt-4 mb-4">
              <p className="h4 fs-2"> Reset password for account </p>
              {showSpinner && (
                <CDBSpinner multicolor size="small" className="mx-auto" />
              )}
            </div>
            <label htmlFor="defaultRegisterName" className="text-muted m-0">
              Enter Your Email
            </label>
            <CDBInput
              id="defaultRegisterName"
              className="mt-n3"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <CDBBtn
              color="primary"
              style={{ width: "40%" }}
              className="btn-block mt-5 mx-auto fs-4 mb-3"
              onClick={() => sendReq()}
            >
              Submit
            </CDBBtn>
          </CDBCardBody>
        </CDBCard>
      </CDBContainer>
      <Footer />
    </div>
  );
};

export default ForgotPasswordInp;
