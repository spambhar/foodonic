import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Home/Navbar";
import Sidebar from "./Sidebar";
import {
  CDBCard,
  CDBCardBody,
  CDBCardTitle,
  CDBCardText,
  CDBBtn,
  CDBContainer,
  CDBBadge,
  CDBModal,
  CDBSpinner,
} from "cdbreact";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import Card from "react-bootstrap/Card";

const Donor = () => {
  const [requests, setRequests] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  const completeRequest = (id, values) => {
    setShowSpinner(true);
    axios({
      method: "GET",
      url: `http://127.0.0.1:8000/complete-food-request/${id}/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        alert("Request Completed successfully");
        setShowSpinner(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setShowSpinner(false);
      });
  };

  const deleteRequest = (id) => {
    setShowSpinner(true);
    axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/food-request/${id}/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      alert("Request Deleted successfully");
      window.location.reload();
      setShowSpinner(false);
    });
  };

  var a = 0,
    b = 0;
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/current-requests/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setRequests(response.data);
      console.log(response.data);
    });
    setShowSpinner(false);
  }, []);

  return (
    <>
      {localStorage.getItem("type") === "Donor" && (
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
                // overflowY: "scroll",
              }}
            >
              {showSpinner && (
                <CDBSpinner multicolor size="small" className="mx-auto" />
              )}
              <div className="m-5 fs-2 p-4" style={{ width: "68rem" }}>
                <CDBContainer className="mb-3">
                  <CDBBadge
                    color="primary"
                    className="text-white"
                    size="large"
                    borderType="none"
                  >
                    <h3 className="font-weight-bold mt-2">
                      Pending Food Requests
                    </h3>
                  </CDBBadge>
                </CDBContainer>

                {requests.map((request) => {
                  if (request.status === "pending") {
                    a = 1;
                    return (
                      <>
                        <div class="card mb-4">
                          <div class="card-header">{request.food_name}</div>
                          <div class="card-body">
                            {request.img && (
                              <img
                                src={`http://127.0.0.1:8000${request.img}`}
                                height="200rem"
                              />
                            )}
                            <h4 class="card-title">
                              Quantity: {request.quantity} Kg
                            </h4>
                            <h4 class="card-text">
                              City: <b>{request.city_name}</b>
                            </h4>
                            <h4 class="card-text">
                              Area: <b>{request.area_name}</b>
                            </h4>
                            <h4 class="card-text">
                              Location:{" "}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
                              >{`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}</a>
                            </h4>

                            <h5 class="card-text text-muted">
                              Posted on{" "}
                              <b>
                                {request.date_time.substr(0, 10) +
                                  " " +
                                  request.date_time.substr(11, 8)}
                              </b>
                            </h5>

                            <button
                              href="#"
                              class="btn btn-danger fs-4"
                              onClick={() => deleteRequest(request.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
                {(requests.length == 0 || a == 0) && (
                  <p className="text-center">No content to show</p>
                )}
              </div>

              <div className="m-5 fs-2" style={{ width: "68rem" }}>
                <CDBContainer className="mb-3 text-center">
                  <CDBBadge
                    color="success"
                    className="text-white"
                    size="large"
                    borderType="none"
                  >
                    <h3 className="font-weight-bold mt-2">
                      Accepted Food Requests
                    </h3>
                  </CDBBadge>
                </CDBContainer>
                {requests.length > 0 &&
                  requests.map((request) => {
                    if (request.status === "accept") {
                      b = 1;
                      return (
                        <div class="card mb-4">
                          <div class="card-header">{request.food_name}</div>
                          <div class="card-body">
                            {request.img && (
                              <img
                                src={`http://127.0.0.1:8000${request.img}`}
                                height="200rem"
                              />
                            )}
                            <h4 class="card-title">
                              Quantity: {request.quantity} Kg
                            </h4>
                            <h4 class="card-text">
                              City: <b>{request.city_name}</b>
                            </h4>
                            <h4 class="card-text">
                              Area: <b>{request.area_name}</b>
                            </h4>
                            <h4 class="card-text">
                              Location:{" "}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
                              >{`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}</a>
                            </h4>
                            <h4 class="card-text">
                              <p className="text-success">Accepted by:</p>{" "}
                              <span> Volunteer name:</span>{" "}
                              <b> {request.ngo_d.volunteer_name}</b>
                              <br />
                              <span> Ngo name:</span>{" "}
                              <b> {request.ngo_d.name}</b>
                              <br />
                              <span> Mobile number:</span>{" "}
                              <b> {request.ngo_d.mobile}</b>
                              <br />
                            </h4>

                            <h5 class="card-text text-muted">
                              Posted on{" "}
                              <b>
                                {request.date_time.substr(0, 10) +
                                  " " +
                                  request.date_time.substr(11, 8)}
                              </b>
                            </h5>
                            <button
                              href="#"
                              class="btn btn-warning fs-4"
                              onClick={() =>
                                completeRequest(request.id, request)
                              }
                            >
                              Picked Up
                            </button>
                            <button
                              href="#"
                              class="btn btn-danger fs-4 m-3"
                              onClick={() => deleteRequest(request.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                {(requests.length == 0 || b == 0) && (
                  <p className="text-center">No content to show</p>
                )}
              </div>
            </div>
            <div
              style={{
                flex: "1 1 auto",
                display: "flex",
                flexFlow: "column",
                height: "100vh",
                // overflowY: "scroll",
              }}
              className="p-4"
            >
              <NavLink to="/donor/add-request">
                <button className="btn btn-primary btn-lg py-3">
                  {" "}
                  Add Food Donation Request
                </button>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Donor;

// post food request  (Google Map)
// status of pending request
// past data
// Account details (Update)
