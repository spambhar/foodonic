import "../Home/Body.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router";



const EmailVerification = () => {
  const params = useParams();
  const history = useHistory();


  useEffect(() => {
    console.log("hii");
    axios({
      method: "GET",
      url: `http://127.0.0.1:8000/activate?tk=${params.tk}`,
    })
      .then((response) => {
        console.log(response.status);
        alert("Email is verified successfully.");
      })
      .catch((error) => {
        console.log(error);
        alert("Link has been expired.");
      });
    history.push("/");
  }, []);

  return (
    <div>
    </div>
  );
};

export default EmailVerification;
