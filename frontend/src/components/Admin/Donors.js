import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../Home/Navbar";
import {
  CDBTable,
  CDBTableHeader,
  CDBTableBody,
  CDBBtn,
  CDBBadge,
  CDBContainer,
  CDBCard,
  CDBCardBody,
  CDBDataTable,
  CDBSpinner,
} from "cdbreact";
import axios from "axios";

const Donors = () => {
  const [ngo, setngo] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/all-donor/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setngo(response.data);
      console.log(response.data);
    });
    setShowSpinner(false);
  }, []);

  function testClickEvent(param) {
    alert("Row Click Event");
  }

  const data = () => {
    return {
      columns: [
        {
          label: "Name",
          field: "name",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Name",
          },
        },
        {
          label: "Email",
          field: "email",
          width: 270,
        },
        {
          label: "Mobile No.",
          field: "mobile",
          width: 200,
        },
        {
          label: "City",
          field: "city_name",
          sort: "asc",
          width: 100,
        },
        // {
        //   label: "Start date",
        //   field: "date",
        //   sort: "disabled",
        //   width: 150,
        // },
        // {
        //   label: "Salary",
        //   field: "salary",
        //   sort: "disabled",
        //   width: 100,
        // },
      ],
      rows: ngo,
    };
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
                      gridTemplateColumns: "repeat(1, minmax(200px, 900px))",
                    }}
                  >
                    <div className="mt-5 fs-4">
                      <h3 className="font-weight-bold mb-3">Donors</h3>
                      {/* <CDBTable responsive>
                        <CDBTableHeader color="light">
                          <tr>
                            <th>Id</th>
                            <th>Donor Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>City</th>
                          </tr>
                        </CDBTableHeader>
                        <CDBTableBody>
                          {ngo.map((ng) => {
                            return (
                              <tr key={ng.id}>
                                <td>{ng.id}</td>
                                <td>{ng.name}</td>
                                <td>{ng.email}</td>
                                <td>{ng.mobile}</td>
                                <td>{ng.city_name}</td>
                              </tr>
                            );
                          })}
                        </CDBTableBody>
                      </CDBTable> */}

                      {showSpinner && (
                        <CDBSpinner
                          multicolor
                          size="small"
                          className="mx-auto"
                        />
                      )}
                      <CDBContainer>
                        <CDBCard>
                          <CDBCardBody>
                            <CDBDataTable
                              striped
                              bordered
                              hover
                              entriesOptions={[5, 20, 25]}
                              entries={5}
                              pagesAmount={4}
                              data={data()}
                              materialSearch={true}
                              responsive
                            />
                          </CDBCardBody>
                        </CDBCard>
                      </CDBContainer>
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

export default Donors;
