import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Navbar from "../Home/Navbar";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  // Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React from "react";
import Logout from "./logout";
import { CDBSpinner } from "cdbreact";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Register = () => {
  const [listcity, setlistcity] = useState([]);

  const [showSpinner, setShowSpinner] = useState(true);
  // const [cityname, setcityname] = useState("");
  useEffect(() => {
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

  // handleChange = e => {

  // }
  let history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      city: "",
      role: "",
      registration_number: "",
      volunteer_name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(255)
        .required("Name is required"),
      mobile: Yup.string()
        .max(10)
        .min(10)
        .required("Mobile number is required"),
      city: Yup.string()
        .max(255)
        .required("City is required"),
      // registration_number: Yup.string().max(255).required("Registration number is required"),
      // volunteer_name: Yup.string().max(255).required("Volunteer name is required"),
    }),

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
          setShowSpinner(false);
          localStorage.setItem("type", values.role);
          alert("Data updated successfully.");
          if (values.role == "Ngo") {
            Logout();
          }
          history.push("/home");
        })
        .catch((error) => {
          setShowSpinner(false);
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
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Update Dashboard
            </Typography>
            {showSpinner && (
              <CDBSpinner multicolor size="small" className="mx-auto" />
            )}
            <br />
            <Typography color="error" gutterBottom variant="body2">
              *You need to fill it for the further step.
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="role"
                onChange={formik.handleChange}
                required
              >
                <FormControlLabel value="Ngo" control={<Radio />} label="Ngo" />
                <FormControlLabel
                  value="Donor"
                  control={<Radio />}
                  label="Donor"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.mobile && formik.errors.mobile)}
              fullWidth
              helperText={formik.touched.mobile && formik.errors.mobile}
              label="Mobile number"
              margin="normal"
              name="mobile"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.mobile}
              variant="outlined"
            />
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={formik.values.city}
                label="City"
                name="city"
                // onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              >
                {listcity.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
            </FormControl>

            {/* <TextField
              error={Boolean(formik.touched.city && formik.errors.city)}
              fullWidth
              helperText={formik.touched.city && formik.errors.city}
              label="City"
              margin="normal"
              name="city"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.city}
              variant="outlined"
              required
            /> */}

            {formik.values.role === "Ngo" && (
              <TextField
                error={Boolean(
                  formik.touched.registration_number &&
                    formik.errors.registration_number
                )}
                fullWidth
                helperText={
                  formik.touched.registration_number &&
                  formik.errors.registration_number
                }
                label="Registration number"
                margin="normal"
                name="registration_number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.registration_number}
                variant="outlined"
                required
              />
            )}
            {formik.values.role === "Ngo" && (
              <TextField
                error={Boolean(
                  formik.touched.volunteer_name && formik.errors.volunteer_name
                )}
                fullWidth
                helperText={
                  formik.touched.volunteer_name && formik.errors.volunteer_name
                }
                label="Volunteer name"
                margin="normal"
                name="volunteer_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.volunteer_name}
                variant="outlined"
                required
              />
            )}

            {/* <input
              id="file"
              name="file"
              type="file"
            /> */}

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
