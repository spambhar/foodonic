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

const ForgotPassword = () => {
  const params = useParams();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const history = useHistory();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    console.log("hii");
    axios({
      method: "POST",
      url: `http://127.0.0.1:8000/password-reset/validate_token/`,
      data: {
        token: params.token,
      },
    })
      .then((response) => {
        console.log(response.status);
        setShowSpinner(false);
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert("Link has been expired.");
        history.push("/");
      });
  }, []);

  const sendReq = () => {
    if (password1 != password2) {
      alert("Passwords do not match!!");
      return;
    }
    setShowSpinner(true);

    axios({
      method: "POST",
      url: `http://127.0.0.1:8000/password-reset/confirm/`,
      data: {
        token: params.token,
        password: password1,
      },
    })
      .then((response) => {
        console.log(response);
        alert("Password changed successfully.");

        setShowSpinner(false);
        history.push("/");
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log(error);
        if (error.response.status == 404) alert("Link expired.");
        else {
          alert(error.response.data.password);
        }
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
              Enter New Password
            </label>
            <CDBInput
              id="defaultRegisterName"
              className="mt-n3"
              type="password"
              onChange={(e) => setPassword1(e.target.value)}
            />
            <label htmlFor="defaultRegisterEmail" className="text-muted m-0">
              Confirm New Password
            </label>
            <CDBInput
              id="defaultRegisterEmail"
              className="mt-n3"
              type="password"
              onChange={(e) => setPassword2(e.target.value)}
            />

            <CDBBtn
              color="success"
              style={{ width: "40%" }}
              className="btn-block mt-5 mx-auto fs-4 mb-3"
              onClick={() => sendReq()}
            >
              Update Password
            </CDBBtn>
          </CDBCardBody>
        </CDBCard>
      </CDBContainer>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
