import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiFillTwitterCircle,
  AiFillGithub,
  AiFillInstagram,
  AiFillFacebook,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer id="footer" class="top-space">
      <div class="footer1">
        <div class="container">
          <div class="row">
            <div class="col-md-3 widget">
              <h3 class="widget-title">Contact</h3>
              <div class="widget-body">
                <p>
                  <a href="mailto:#">foodonic07@gmail.com</a>
                  <br />
                  <br />
                  Gujarat, India.
                </p>
              </div>

              <div class="widget-body">
                <p>
                  <a href="/feedback">Provide Your Valuable Feedback</a>
                  <br />
                  <br />
                </p>
              </div>
            </div>
            <div class="col-md-3 widget">
              <h3 class="widget-title">Follow Us</h3>
              <div class="widget-body">
                <p class="follow-me-icons">
                  <NavLink to="/home">
                    <AiFillTwitterCircle />
                  </NavLink>
                  &nbsp;
                  <NavLink to="/home">
                    <AiFillGithub />
                  </NavLink>
                  &nbsp;
                  <NavLink to="/home">
                    <AiFillFacebook />
                  </NavLink>
                  &nbsp;
                  <NavLink to="/home">
                    <AiFillInstagram />
                  </NavLink>
                  &nbsp;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer2">
        <div class="container">
          <div class="row">
            <div class="col-md-6 widget">
              <div class="widget-body">
                <p class="text-right">
                  Copyright © 2022 Foodonic Inc. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
