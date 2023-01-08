// import { useState, useEffect } from "react";
// import axios from "axios";
import Sidebar from "./Sidebar";
import React, { useState, useEffect } from "react";
import {
  CDBTable,
  CDBTableHeader,
  CDBTableBody,
  CDBBtn,
  CDBSpinner,
} from "cdbreact";
import axios from "axios";
import Navbar from "../Home/Navbar";

const PendingVerification = () => {
  const [ngo, setngo] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  var a = 0;

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/all-ngo/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setngo(response.data);
      console.log(response.data);
    });
    setShowSpinner(false);
  }, []);

  const verifyNgo = (id) => {
    setShowSpinner(true);
    axios({
      method: "GET",
      url: `http://127.0.0.1:8000/verify-ngo/${id}/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        alert(response.data.message);
        window.location.reload();

        setShowSpinner(false);
      })
      .catch((err) => {
        setShowSpinner(false);
        // alert(err.data.message);
      });
  };

  return (
    <>
      {localStorage.getItem("type") === "Admin" && (
        <>
          <Navbar />
          <div className="d-flex">
            <div>
              <Sidebar />
            </div>
            <div
              style={{
                flex: "1 1 auto",
                display: "flex",
                flexFlow: "column",
                height: "100vh",
                overflowY: "hidden",
              }}
            >
              <div style={{ height: "100%" }}>
                <div
                  style={{
                    padding: "20px 5%",
                    height: "calc(100% - 64px)",
                    overflowY: "scroll",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(1, minmax(200px, 700px))",
                    }}
                  >
                    {showSpinner && (
                      <CDBSpinner multicolor size="small" className="mx-auto" />
                    )}
                    <div className="mt-5 fs-4">
                      <h3 className="font-weight-bold mb-3">
                        NGO verification
                      </h3>
                      <h5>Unverified NGOs</h5>
                      <CDBTable responsive>
                        <CDBTableHeader color="dark">
                          <tr>
                            <th>id</th>
                            <th>Ngo Name</th>
                            <th>Email</th>
                            <th>Registration Number</th>
                            <th>City</th>
                            <th>Verify</th>
                          </tr>
                        </CDBTableHeader>
                        <CDBTableBody>
                          {ngo.map((ng) => {
                            if (ng.verification_status == "details_filled") {
                              a = 1;
                              return (
                                <tr key={ng.id}>
                                  <td>{ng.id}</td>
                                  <td>{ng.name}</td>
                                  <td>{ng.email}</td>
                                  <td>{ng.registration_number}</td>
                                  <td>{ng.city_name}</td>
                                  <td>
                                    <CDBBtn
                                      style={{ background: "#333" }}
                                      flat
                                      size="medium"
                                      className="border-0 ml-auto px-4"
                                    >
                                      <span
                                        className="msg-rem"
                                        onClick={() => verifyNgo(ng.id)}
                                      >
                                        Verify
                                      </span>
                                    </CDBBtn>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </CDBTableBody>
                      </CDBTable>
                      {(ngo.length == 0 || a == 0) && (
                        <p className="text-center">No content to show</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PendingVerification;
