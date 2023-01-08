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
} from "cdbreact";
import axios from "axios";

const PastDrives = () => {
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/past-donations/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    }).then((response) => {
      setDonations(response.data);
      console.log(response.data);
    });
  }, []);

  const data = () => {
    return {
      columns: [
        {
          label: "Food Name",
          field: "food_name",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
            "aria-label": "Food Name",
          },
        },
        {
          label: "Date",
          field: "date_time",
          width: 270,
        },
        {
          label: "Donor",
          field: "donor_name",
          width: 200,
        },
        {
          label: "Quantity",
          field: "quantity",
          sort: "asc",
          width: 100,
        },
        {
          label: "City",
          field: "city_name",
          sort: "asc",
          width: 100,
        },
        {
          label: "Area",
          field: "area_name",
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
      rows: donations,
    };
  };

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
                      <CDBContainer className="mb-3 text-center">
                        <CDBBadge
                          color="primary"
                          className="text-white mb-3 "
                          size="large"
                          borderType="none"
                        >
                          <h3 className="font-weight-bold mt-2">
                            Food Donation History
                          </h3>
                        </CDBBadge>
                        {/* <CDBTable responsive>
                          <CDBTableHeader color="dark">
                            <tr>
                              <th>Food Name</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>NGO</th>
                              <th>Quantity</th>
                              <th>City</th>
                              <th>Area</th>
                            </tr>
                          </CDBTableHeader>
                          <CDBTableBody>
                            {donations.map((donation) => {
                              return (
                                <tr key={donation.id}>
                                  <td>{donation.food_name}</td>
                                  <td>{donation.date_time.substr(0, 10)}</td>
                                  <td>{donation.date_time.substr(11, 8)}</td>
                                  <td>{donation.ngo_name}</td>
                                  <td>{donation.quantity} Kg</td>
                                  <td>{donation.city_name}</td>
                                  <td>{donation.area_name}</td>
                                </tr>
                              );
                            })}
                          </CDBTableBody>
                        </CDBTable> */}
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

export default PastDrives;
