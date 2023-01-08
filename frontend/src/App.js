import React from "react";
// import Navbar from "./components/Home/Navbar";
// import Body from "./components/Home/Body";
import Home1 from "./components/Home/Home1";
import Home11 from "./components/Home/Home11";
import Login from "./components/Login/login";
import Signup from "./components/Login/Signup";
import Register from "./components/Login/Register";
import Logout from "./components/Login/logout";
import VerifiedNgo from "./components/Admin/VerifiedNgo";
import AdminProfile from "./components/Admin/Profile";
import PendingVerification from "./components/Admin/PendingVerification";
import { Switch, Route, Redirect } from "react-router-dom";
import Donors from "./components/Admin/Donors";
import DonorProfile from "./components/Donor/Profile";
import PastDonations from "./components/Donor/PastDonations";
import ForgotPassword from "./components/Login/ForgotPassword";
import AddRequest from "./components/Donor/AddRequest";
import ForgotPasswordInp from "./components/Login/ForgotPasswordInp";
import NgoProfile from "./components/NGO/Profile";
import PastDrives from "./components/NGO/PastDrives";
import AcceptedRequest from "./components/NGO/AcceptedRequest";
import EmailVerification from "./components/Login/EmailVerification";
import Feedback from "./components/Home/Feedback";

const regex = `(\?token=[]*)\w+`;
const Home = () => {
  return (
    <>{localStorage.getItem("isLogin") === "true" ? <Home11 /> : <Home1 />}</>
  );
};
const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/home" />
      </Route>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route path={`/password-reset/:token`}>
        <ForgotPassword />
      </Route>
      <Route path="/feedback">
        <Feedback/>
      </Route>


      <Route path={`/activate/:tk`}>
        <EmailVerification />
      </Route>
      <Route path={`/forgot-password-input`}>
        <ForgotPasswordInp />
      </Route>

      {/* Admin */}
      <Route path="/admin/verified-ngo">
        <VerifiedNgo />
      </Route>
      <Route path="/admin/pending-verification">
        <PendingVerification />
      </Route>
      <Route path="/admin/donors">
        <Donors />
      </Route>
      <Route path="/admin/profile">
        <AdminProfile />
      </Route>

      {/* Donor */}
      <Route path="/donor/profile">
        <DonorProfile />
      </Route>
      <Route path="/donor/past-donations">
        <PastDonations />
      </Route>
      <Route path="/donor/add-request">
        <AddRequest />
      </Route>

      {/* Ngo */}
      <Route path="/ngo/profile">
        <NgoProfile />
      </Route>
      <Route path="/ngo/past-drives">
        <PastDrives />
      </Route>
      
      <Route path="/ngo/accepted-request">
        <AcceptedRequest />
      </Route>
      
    </Switch>
  );
};

export default App;
