import "./Body.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaCogs } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import React from "react";
import Footer from "./Footer";

const Body = () => {
  return (
    <div>
      <header id="head">
        <div className="container">
          <div className="row">
            <h1 className="lead">Foodonic</h1>
            <p className="tagline">Feed The Hunger</p>
          </div>
        </div>
      </header>
      <div className="container text-center">
        <br /> <br />
        <h2 className="thin">The Best Place To Feed The Hunger</h2>
        <p className="text-muted">Keeping Tummies And Hearts Full With Love.</p>
      </div>
      <div className="jumbotron top-space">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6 highlight">
              <div className="h-caption">
                <h1>
                  <FaHandHoldingHeart />
                </h1>
                <br />
                <h4>Incentives</h4>
              </div>
              <div className="h-body text-center">
                <p>
                  In our daily lives, We may notice that the food is being
                  wasted at our homes, some public events,etc. In many
                  countries, there are lots of people who work so hard the whole
                  day to feed thier families. Many people might sleep at night
                  on an empty stomach. So we thought to feed this hunger as much
                  as we can with the leftover food.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 highlight">
              <div className="h-caption">
                <h1>
                  <FaCogs />
                </h1>
                <br />
                <h4>Well Managed Process</h4>
              </div>
              <div className="h-body text-center">
                <p>
                  We ensure the reliable and convenient process for the donors
                  and collectors. The donors can donate the food by filling up
                  just one form. The collectors can also collect food from
                  available details by just one click.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 highlight">
              <div className="h-caption">
                <h1>
                  <FaBell />
                </h1>
                <br />
                <h4>Realiable Information</h4>
              </div>
              <div className="h-body text-center">
                <p>
                  We personally check the information provided by the donors so
                  that later on the collectors won't face any problems. At the
                  same time, we ensure that the collectors will collect the food
                  which they select once so that the food won't get wasted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Body;
