import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import React, { useEffect, useState, useReducer } from "react";
import * as formik from "formik";
import * as yup from "yup";
import Navbar from "../Home/Navbar";
import Sidebar from "./Sidebar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useHistory } from "react-router";
import { CDBSpinner } from "cdbreact";

const { Formik } = formik;

const schema = yup.object().shape({
  food_name: yup.string().required(),
  quantity: yup.number().required(),
  area: yup.string().required(),
  img: yup.mixed(),
});

const reducer = (state, action) => {
  return { ...state, ...action.data };
};

const AddRequest = () => {
  const [location, setLocation] = useState({
    name: "Locate",
  });

  const [areas, setAreas] = useState([]);

  const [data, dispatch] = useReducer(reducer, {});

  const [file, setFile] = useState(null);

  const history = useHistory();

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setShowSpinner(true);
    navigator.geolocation.getCurrentPosition(
      function(position) {
        setLocation((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
        console.log(position);
      },
      function(error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );

    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/user/details/",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
      },
    })
      .then((response) => {
        dispatch({
          data: {
            ...response.data,
          },
        });
        console.log(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        alert(error);
      });

    if (data.city) {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8000/get-areas/${data.city}/`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accesstoken"),
        },
      })
        .then((response) => {
          setAreas(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [location.latitude, data.city]);

  const mapStyles = {
    height: "80vh",
    width: "100%",
  };

  const onMarkerDragEnd = (e) => {
    setLocation((prev) => ({
      ...prev,
      location: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    }));
  };

  const mapClickHandler = (e) => {
    setLocation((prev) => ({
      ...prev,
      location: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    }));
  };

  const submitHandler = (values, event) => {
    console.log(values);
    let form_data = new FormData();
    form_data.append("img", file);
    form_data.append("food_name", values.food_name);
    form_data.append("city", data.city);
    form_data.append("quantity", values.quantity);
    form_data.append("area", values.area);
    form_data.append("latitude", location.location.lat);
    form_data.append("longitude", location.location.lng);
    form_data.append("donor", data.id);

    const formdata = {
      ...values,
      city: data.city,
      latitude: location.location.lat,
      longitude: location.location.lng,
      donor: data.id,
      img: file,
    };
    console.log(values);
    setShowSpinner(true);
    axios({
      method: "POST",
      url: `http://127.0.0.1:8000/add-food-request/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accesstoken"),
        "Content-Type": "multipart/form-data",
        // "Accept-Encoding":"gzip, deflate, br",
      },
      data: formdata,
    })
      .then((response) => {
        console.log(response);
        alert("Request added successfully.");
        setShowSpinner(false);

        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        alert("Can't Process Your Request ");
        setShowSpinner(false);
      });
  };

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
                // height: "100vh",
                // overflowY: "hidden",
              }}
            >
              <div style={{ height: "100%" }}>
                <div
                  style={{
                    padding: "20px 5%",
                    height: "calc(100% - 64px)",
                    // overflowY: "scroll",
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
                      <h1 className="text-primary">
                        <b>Food Donation Request</b>
                      </h1>
                      <Formik
                        validationSchema={schema}
                        onSubmit={submitHandler}
                        initialValues={{
                          food_name: "",
                          quantity: "",
                          area: "",
                          img: null,
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          touched,
                          isValid,
                          errors,
                        }) => (
                          <Form
                            noValidate
                            onSubmit={handleSubmit}
                            className="fs-3 p-2"
                          >
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId="validationFormik101"
                              className="position-relative"
                            >
                              <Form.Label>Food name</Form.Label>
                              <Form.Control
                                type="text"
                                name="food_name"
                                value={values.food_name}
                                onChange={handleChange}
                                isValid={touched.food_name && !errors.food_name}
                                isInvalid={!!errors.food_name}
                                className="form-control form-control-lg"
                              />
                              <Form.Control.Feedback type="invalid" tooltip>
                                {errors.food_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId="validationFormik102"
                              className="position-relative"
                            >
                              <Form.Label>Quantity (in Kg)</Form.Label>
                              <Form.Control
                                type="number"
                                name="quantity"
                                value={values.quantity}
                                onChange={handleChange}
                                isValid={touched.quantity && !errors.quantity}
                                isInvalid={!!errors.quantity}
                                className="form-control form-control-lg"
                              />
                              <Form.Control.Feedback type="invalid" tooltip>
                                {errors.quantity}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId="validationFormikUsername2"
                            ></Form.Group>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationFormik103"
                                className="position-relative"
                              >
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={data.city_name}
                                  name="city"
                                  value={values.city}
                                  onChange={handleChange}
                                  isInvalid={!!errors.city}
                                  className="form-control form-control-lg"
                                  disabled
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="3"
                                controlId="validationFormik104"
                                className="position-relative"
                              >
                                <Form.Label>Area</Form.Label>
                                <Form.Control
                                  type="text"
                                  as="select"
                                  placeholder="Area"
                                  name="area"
                                  value={values.area}
                                  onChange={handleChange}
                                  isInvalid={!!errors.area}
                                  className="form-control form-control-lg"
                                  default="select"
                                >
                                  <option>Select</option>
                                  {areas.map((area) => {
                                    return (
                                      <option key={area.id} value={area.id}>
                                        {area.name}
                                      </option>
                                    );
                                  })}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid" tooltip>
                                  {errors.area}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Form.Group className="position-relative mb-3">
                              <Form.Label>Food Image (Optional)</Form.Label>
                              <Form.Control
                                type="file"
                                name="img"
                                onChange={(e) => {
                                  console.log(e.currentTarget.files[0]);
                                  setFile(e.currentTarget.files[0]);
                                  console.log(file);
                                }}
                                isInvalid={!!errors.img}
                                accept="image/*"
                                className="form-control form-control-lg"
                              />
                              <Form.Control.Feedback type="invalid" tooltip>
                                {errors.img}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                              type="submit"
                              className="btn btn-lg btn-success fs-2"
                            >
                              Add
                            </Button>
                          </Form>
                        )}
                      </Formik>
                      <h3>Your Location:</h3>
                      <LoadScript googleMapsApiKey="AIzaSyDSHC4at3ku5mbdHfwNO-9N4yTMI0aWitc">
                        <GoogleMap
                          mapContainerStyle={mapStyles}
                          zoom={13}
                          center={location.location}
                          onClick={(e) => mapClickHandler(e)}
                        >
                          {/* {locations.map((item) => {
                            return (
                              <Marker
                                key={item.name}
                                position={item.location}
                              />
                            );
                          })} */}
                          <Marker
                            key={location.name}
                            position={location.location}
                            draggable={true}
                            onDragEnd={(e) => onMarkerDragEnd(e)}
                          />
                        </GoogleMap>
                      </LoadScript>
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

export default AddRequest;
