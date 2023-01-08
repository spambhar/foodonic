// import { useState, useEffect } from "react";
// import axios from "axios";
import Sidebar from "./Sidebar";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Navbar from "../Home/Navbar";
import generatePDF from "./generatePDF";
import { CDBSpinner } from "cdbreact";

const reducer = (state, action) => {
  return { ...state, ...action.data };
};

const Admin = () => {
  const [data, dispatch] = useReducer(reducer, {});
  const [loading, setLoading] = useState(true);
  const [listarea, setListarea] = useState([]);
  const [area, setArea] = useState("");

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/statistics/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch({
          data: {
            ...response.data,
          },
        });
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        alert(error);
      });

    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/area/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        setListarea(response.data);
        console.log(response.data);
        setShowSpinner(false);
      })
      .catch((error) => {
        alert(error);
      });
  }, [data["food_quantity"]]);

  const getFoodRequests = () => {
    console.log(area);
    setShowSpinner(true);
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/generate-report/" + area + "/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        console.log(response.data);
        generatePDF(response.data);

        setShowSpinner(false);
      })
      .catch((error) => {
        console.log(error);

        setShowSpinner(false);
      });
  };

  return (
    <>
      {localStorage.getItem("type") === "Admin" && loading === false && (
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
                overflowY: "hidden",
              }}
            >
              <div style={{ height: "100%" }}>
                <div
                  style={{
                    padding: "20px 5%",
                    height: "100%",
                    overflowY: "",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(1, minmax(100px, 700px))",
                    }}
                  >
                    {showSpinner && (
                      <CDBSpinner multicolor size="small" className="mx-auto" />
                    )}
                    <div className="cards-container py-4 fs-2">
                      <p className="text-muted">
                        Select area and generate report:
                      </p>
                      <select
                        name="area"
                        color="white"
                        onChange={(e) => setArea(e.target.value)}
                      >
                        <option>--select area--</option>
                        {listarea.map((area) => {
                          return <option value={area.id}>{area.name}</option>;
                        })}
                      </select>
                      <button
                        className="btn btn-primary btn-lg py-3 mb-2"
                        onClick={() => getFoodRequests()}
                      >
                        {" "}
                        Generate Report
                      </button>

                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="m-0 h2 font-weight-bold text-dark fs-3 fw-bold">
                              Total quantity of foods saved
                            </h4>
                            <div className="py-1 px-2 bg-grey rounded-circle h1">
                              <i className="fas fa-suitcase"></i>
                            </div>
                          </div>
                          <h4 className="my-4 text-right text-dark h2 font-weight-bold">
                            {data.food_quantity} KG
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="cards-container py-4">
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="m-0 h5 font-weight-bold text-dark fs-3 fw-bold">
                              Total Users
                            </h4>
                            <div className="py-1 px-2 bg-grey rounded-circle h1">
                              <i className="fas fa-user"></i>
                            </div>
                          </div>
                          <h4 className="my-4 text-right text-dark h2 font-weight-bold">
                            {data["total_user"]}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="cards-container  py-4">
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="m-0 h5 font-weight-bold text-dark fs-3 fw-bold">
                              Total food requests
                            </h4>
                            <div className="py-1 px-2 bg-grey rounded-circle h1">
                              <i className="fas fa-chart-line"></i>
                            </div>
                          </div>
                          <h4 className="my-4 text-right text-dark h2 font-weight-bold">
                            {data["total_foodrequest"]}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="cards-container  py-4">
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <h4 className="m-0 h5 font-weight-bold text-dark fs-3 fw-bold">
                              Serving in Cities
                            </h4>
                            <div className="py-1 px-2 bg-grey rounded-circle">
                              <i className="fas fa-globe h1"></i>
                            </div>
                          </div>
                          <h4 className="my-4 text-right text-dark h2 font-weight-bold">
                            {data["total_city"]}
                          </h4>
                        </div>
                      </div>
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

export default Admin;

// ngo verified
// ngo verification
// Donor
// Stat:
// -Total food request
// -Total completed request
// -Total number of user

//Report
