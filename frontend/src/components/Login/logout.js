// import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import React from 'react';

const Logout = () => {
  axios({
    method: "POST",
    url: "http://127.0.0.1:8000/api-auth/revoke-token/",
    data: {
      token: localStorage.getItem("accesstoken"),
      client_id: "K4fJ8Qy5enPBVQVmTDiCwtC2Wz2yuS4vMIIsL9WR",
      client_secret:
        "aKo87PCMmBQN5DGzYxPPz11tnPKliJG4qbuAZ0gfgMOFInPCjhyfM20cLUHXZxUm2yrWqb3YzJlSqfdPtjY0bOt4YExG9nh7J7EqJimUGZP3lZp82FC34CSI9NCk1BKj",
    },
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accesstoken"),
    },
  })
    .then((response) => {
      alert("Logged out successfully");
    })
    .catch((error) => {
      alert(error.message);
    });

  localStorage.setItem("isLogin", "false");
  localStorage.setItem("accesstoken", "");
  localStorage.setItem("refreshtoken", "");
  localStorage.setItem("type", "");
  localStorage.setItem("email", "");
  localStorage.setItem("username", "");
  return <Redirect to="/home" />;
};

export default Logout;
