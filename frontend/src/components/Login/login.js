import Head from "next/head";
// import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useHistory } from "react-router-dom";
import Navbar from "../Home/Navbar";
import GoogleLogin from "react-google-login";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  // Grid,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import React from "react";
import { CDBSpinner } from "cdbreact";

const Login = () => {
  let history = useHistory();
  const [showSpinner, setShowSpinner] = useState(false);

  const handleGoogleLogin = (response) => {
    setShowSpinner(true);
    axios
      .post("http://127.0.0.1:8000/api-auth/convert-token/", {
        token: response.accessToken,
        backend: "google-oauth2",
        grant_type: "convert_token",
        client_id: "K4fJ8Qy5enPBVQVmTDiCwtC2Wz2yuS4vMIIsL9WR",
        client_secret:
          "aKo87PCMmBQN5DGzYxPPz11tnPKliJG4qbuAZ0gfgMOFInPCjhyfM20cLUHXZxUm2yrWqb3YzJlSqfdPtjY0bOt4YExG9nh7J7EqJimUGZP3lZp82FC34CSI9NCk1BKj",
      })
      .then((res) => {
        
        const { access_token, refresh_token } = res.data;
        console.log({ access_token, refresh_token });
        localStorage.setItem("accesstoken", access_token);
        localStorage.setItem("refreshtoken", refresh_token);
        localStorage.setItem("isLogin", true);
        axios({
          method: "GET",
          url: "http://127.0.0.1:8000/user/details/",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accesstoken"),
          },
        })
          .then((response) => {
            setShowSpinner(false);
            alert("Login successfully");
            localStorage.setItem("username", response.data.name);
            localStorage.setItem("type", response.data.role);
            if (
              response.data.verification_status === "none" ||
              response.data.verification_status === "email_verified"
            ) {
              history.push("/register");
            } else {
              history.push("/home");
            }
          })
          .catch((error) => {
            setShowSpinner(false);
            alert(error);
            console.log(error);
          });
      })
      .catch((err) => {
        setShowSpinner(false);
        alert(err);
        history.push("/signup");
      });
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "255443709570-gl8t8cvpj47fp5tns08l3indi9455d2f.apps.googleusercontent.com",
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string()
        .max(255)
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      setShowSpinner(true);
      axios({
        method: "POST",
        url: "http://127.0.0.1:8000/api-auth/token/",
        data: {
          username: values.email,
          password: values.password,
          client_id: "K4fJ8Qy5enPBVQVmTDiCwtC2Wz2yuS4vMIIsL9WR",
          client_secret:
            "aKo87PCMmBQN5DGzYxPPz11tnPKliJG4qbuAZ0gfgMOFInPCjhyfM20cLUHXZxUm2yrWqb3YzJlSqfdPtjY0bOt4YExG9nh7J7EqJimUGZP3lZp82FC34CSI9NCk1BKj",
          grant_type: "password",
        },
      })
        .then((response) => {
          localStorage.setItem("isLogin", true);
          localStorage.setItem("accesstoken", response.data.access_token);
          localStorage.setItem("refreshtoken", response.data.refresh_token);
          axios({
            method: "GET",
            url: "http://127.0.0.1:8000/user/details/",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accesstoken"),
            },
          }).then((response) => {
            setShowSpinner(false);
            alert("Login successfully");

            if (
              response.data.verification_status === "none" ||
              response.data.verification_status === "email_verified"
            ) {
              history.push("/register");
            } else {
              // alert(response.data.role);
              localStorage.setItem("type", response.data.role);
              history.push("/home");
            }
          });
        })
        .catch((error) => {
          setShowSpinner(false);
          alert(error.response.data.error_description);
          console.log(error.response.data.error_description);
        });
    },
  });

  return (
    <>
      <Navbar />
      <Head>
        <title>Login</title>
      </Head>
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
          <NavLink to="/home">
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Dashboard
            </Button>
          </NavLink>

          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Log in
            </Typography>
            
            <Typography color="textSecondary" gutterBottom variant="body2">
              Log in on the internal platform
            </Typography>
            {showSpinner && (
              <CDBSpinner multicolor size="small" className="mx-auto" />
            )}
          </Box>

          <GoogleLogin
            clientId="255443709570-gl8t8cvpj47fp5tns08l3indi9455d2f.apps.googleusercontent.com"
            onSuccess={(response) => handleGoogleLogin(response)}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                type="button"
                variant="contained"
                color="error"
                fullWidth
              >
                Continue with Google
              </Button>
            )}
            onFailure={(err) => console.log("Google Login failed", err)}
          />
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                or login with email address
              </Typography>
            </Box>

            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>

            <Typography color="textSecondary" variant="body2">
              Don&apos;t have an account?{" "}
              <NavLink
                to="/signup"
                variant="subtitle2"
                underline="hover"
                sx={{
                  cursor: "pointer",
                }}
              >
                Sign Up
              </NavLink>
            </Typography>
            <Typography color="textSecondary" variant="body2">
              <NavLink
                to="/forgot-password-input"
                variant="subtitle2"
                underline="hover"
                sx={{
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </NavLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
