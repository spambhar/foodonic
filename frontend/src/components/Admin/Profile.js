import React, { useEffect, useState, useReducer } from "react";
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

const AdminProfile = () => {
  const [show, setShow] = useState(false);

  const [data, dispatch] = useReducer(reducer, {});
  const [showSpinner, setShowSpinner] = useState(true);

  const delAcc = () => {
    setShowSpinner(true);
    axios({
      method: "DELETE",
      url: "http://127.0.0.1:8000/delete-account/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        alert(response.data);
        setShowSpinner(false);
      })
      .catch((error) => {
        alert(error);
        setShowSpinner(false);
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
          },
        });
        setShow(true);
        setShowSpinner(false);
        console.log(data);
      })
      .catch((error) => {
        alert(error);
      });
  }, [data.name]);

  const formik = useFormik({
    initialValues: {
      name: data["name"],
      mobile: data["mobile"],
      email: data["email"],
    },
    // validationSchema: Yup.object({
    //   name: Yup.string()
    //     .max(255)
    //     .required("Name is required"),
    //   mobile: Yup.string()
    //     .max(10)
    //     .min(10)
    //     .required("Mobile number is required"),
    //   email: Yup.string()
    //     .max(255)
    //     .required("Email is required"),
    //   // registration_number: Yup.string().max(255).required("Registration number is required"),
    //   // volunteer_name: Yup.string().max(255).required("Volunteer name is required"),
    // }),

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
        data: { ...values, verification_status: "details_filled" },
      })
        .then((response) => {
          alert("Data updated successfully");

          setShowSpinner(false);
        })
        .catch((error) => {
          if (error.response) {
            this.errors(error.response.message);
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
      {localStorage.getItem("type") === "Admin" && show && (
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
export default AdminProfile;
