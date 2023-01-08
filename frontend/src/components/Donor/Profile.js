import React, { useEffect, useState, useReducer } from "react";
import { useHistory } from "react-router-dom";
import {
  CDBInput,
  CDBCard,
  CDBCardBody,
  CDBIcon,
  CDBBtn,
  CDBLink,
  CDBContainer,
  CDBSpinner,
} from "cdbreact";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../Home/Navbar";
import Sidebar from "./Sidebar";
import Logout from "../Login/logout";

const reducer = (state, action) => {
  return { ...state, ...action.data };
};

const DonorProfile = () => {
  const [show, setShow] = useState(false);

  const [data, dispatch] = useReducer(reducer, {});

  const [listcity, setlistcity] = useState([]);

  let history = useHistory();

  const [showSpinner, setShowSpinner] = useState(true);

  const option = listcity.map((city) => {
    return {
      text: city.name,
      value: toString(city.id),
    };
  });

  const delAcc = () => {
    axios({
      method: "DELETE",
      url: "http://127.0.0.1:8000/delete-account/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        alert(response.data.message);
        history.push("/logout");
        window.location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/user/details/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch({
          data: {
            name: response.data["name"],
            email: response.data["email"],
            mobile: response.data["mobile"],
            city: response.data["city_name"],
          },
        });
        setShow(true);
      })
      .catch((error) => {
        alert(error);
      });

    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/city/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        setlistcity(response.data);
        console.log(response.data);
        setShowSpinner(false);
      })
      .catch((error) => {
        alert(error);
        setShowSpinner(false);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: data["name"],
      mobile: data["mobile"],
      email: data["email"],
      city: data["city"],
    },

    onSubmit: (values) => {
      console.log(values);
      setShowSpinner(true);
      axios({
        method: "POST",
        url: "http://127.0.0.1:8000/user/update/",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accesstoken"),
          "Content-Type": "multipart/form-data",
        },
        data: { ...values },
      })
        .then((response) => {
          setShowSpinner(false);
          alert("Data updated successfully");
        })
        .catch((error) => {
          setShowSpinner(false);
          if (error.response) {
            console.log(error.response.message);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error);
          }
          console.log("rejected");
        });
    },
  });

  return (
    <>
      {localStorage.getItem("type") === "Donor" && show && (
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
                    <form onSubmit={formik.handleSubmit}>
                      <CDBContainer className="fs-4">
                        <CDBCard style={{ width: "80rem" }}>
                          <CDBCardBody className="mx-4">
                            <div className="text-center mt-4 mb-2">
                              <p className="h4"> Profile </p>
                            </div>
                            <div className="form-row mb-n4">
                              Name
                              <CDBInput
                                material
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={data["name"]}
                                hint="First name"
                                type="text"
                              />
                            </div>

                            <div className="form-row mb-n4">
                              Email
                              <CDBInput
                                material
                                name="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={data["email"]}
                                hint="E-mail"
                                type="email"
                                style={{
                                  "pointer-events": "none",
                                  background: "lightgrey",
                                }}
                              />
                            </div>
                            <div className="form-row mb-n4">
                              Mobile
                              <CDBInput
                                material
                                name="mobile"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={data["mobile"]}
                                hint="Phone number"
                                type="text"
                              />
                            </div>
                            <div className="form-row mb-n4">
                              City<br></br>
                              <select
                                name="city"
                                color="white"
                                // options={option}
                                // selected={data["city"]}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                values={option}
                              >
                                {listcity.map((city) => {
                                  return (
                                    <option
                                      value={city.id}
                                      selected={
                                        city.name == data["city"] ? true : false
                                      }
                                    >
                                      {city.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <CDBBtn
                              color="dark"
                              className="btn-block my-3 mx-0 fs-5"
                              type="submit"
                            >
                              Update
                            </CDBBtn>

                            <CDBBtn
                              color="danger"
                              className="btn-block my-3 mx-0 fs-5"
                              type="submit"
                              onClick={() => {
                                delAcc();
                              }}
                            >
                              Delete Account
                            </CDBBtn>
                            <hr />
                          </CDBCardBody>
                        </CDBCard>
                      </CDBContainer>
                    </form>
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
export default DonorProfile;
