import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Home/Navbar";
import Sidebar from "./Sidebar";
import { CDBSwitch, CDBContainer, CDBBadge, CDBSpinner } from "cdbreact";

const Ngo = () => {
  const [onDrive, setOnDrive] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  var a = 0;

  const toggleDriveMode = () => {
    setShowSpinner(true);
    axios({
      method: "POST",
      url: "http://127.0.0.1:8000/user/update/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
        "Content-Type": "multipart/form-data",
      },
      data: {
        is_ondrive: onDrive ? 0 : 1,
      },
    }).then((response) => {
      setShowSpinner(false);
      setOnDrive((prev) => {
        return !prev;
      });
      window.location.reload();
    });
  };

  const acceptRequest = (id, values) => {
    setShowSpinner(true);
    axios({
      method: "GET",
      url: `http://127.0.0.1:8000/accept-food-request/${id}/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        alert("Request Accepted successfully");

        setShowSpinner(false);
        window.location.reload();
      })
      .catch((err) => {
        setShowSpinner(false);
        console.log(err);
      });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/user/details/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setOnDrive(response.data.is_ondrive);
    });

    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/current-requests/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setShowSpinner(false);
      setRequests(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      {localStorage.getItem("type") === "Ngo" && (
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
                height: "100%",
                // overflowY: "scroll",
              }}
            >
              <div className="m-5 fs-2" style={{ width: "68rem" }}>
                {showSpinner && (
                  <CDBSpinner multicolor size="small" className="mx-auto" />
                )}
                {onDrive == false && (
                  <p>
                    Turn on below button to start receiving e-mails and SMS for
                    food request.
                  </p>
                )}
                {onDrive == true && (
                  <p className="text-muted">
                    Turn off below button to stop receiving e-mails and SMS for
                    food request.
                  </p>
                )}
                <CDBContainer>
                  {onDrive == true && (
                    <>
                      <CDBSwitch
                        onClick={() => {
                          toggleDriveMode();
                        }}
                        checked
                      />
                      <p>Stop Drive</p>
                    </>
                  )}
                  {onDrive == false && (
                    <>
                      <CDBSwitch
                        onClick={() => {
                          toggleDriveMode();
                        }}
                      />
                      <p>Start Drive</p>
                    </>
                  )}
                </CDBContainer>

                <div className="m-5 fs-2 p-4" style={{ width: "68rem" }}>
                  <CDBContainer className="mb-3">
                    <CDBBadge
                      color="primary"
                      className="text-white"
                      size="large"
                      borderType="none"
                    >
                      <h3 className="font-weight-bold mt-2">
                        Available Food Requests
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
                                class="btn btn-info text-white fs-4"
                                onClick={() =>
                                  acceptRequest(request.id, request)
                                }
                              >
                                Accept
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
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Ngo;

// if verified or not (Box)
// See available food request (Home) -if he want to accept
// Past completed request
// Account details (update)
