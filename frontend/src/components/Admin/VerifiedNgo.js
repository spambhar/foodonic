import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../Home/Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody, CDBBtn, CDBContainer,CDBCard, CDBCardBody, CDBDataTable } from "cdbreact";
import axios from "axios";

const VerifiedNgo = () => {
  const [ngo, setngo] = useState([]);
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
  }, []);

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
          label: "City",
          field: "city_name",
          sort: "asc",
          width: 100,
        },
        
        {
          label: "Registration No.",
          field: "registration_number",
          width: 200,
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
      rows: ngo.filter(data=> data.verification_status=='admin_verified'),
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
                      gridTemplateColumns: "repeat(1, minmax(200px, 900))",
                    }}
                  >
                    <div className="mt-5 fs-4">
                      <h3 className="font-weight-bold mb-3">Verified NGO</h3>

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

export default VerifiedNgo;
