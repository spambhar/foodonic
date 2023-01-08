import React, { useState } from "react";

import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className="main-nav">
        <div className="logo">
          <h2>
            <span>F</span>ooD
            <span>O</span>nic
          </h2>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink activeClassName="selected"  to="/home">Home</NavLink>
            </li>
            
            {( !localStorage.getItem('isLogin') || localStorage.getItem('isLogin')==='false') && <li><NavLink activeClassName="selected"  to="/login">Login</NavLink></li>}
            
            {(!localStorage.getItem('isLogin') || localStorage.getItem('isLogin')==='false') && <li><NavLink activeClassName="selected"  to="/signup">Signup</NavLink></li> }
           
            {(localStorage.getItem('isLogin')==='true') && <li><NavLink activeClassName="selected" to="/logout">Logout</NavLink></li>}
           
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
              <NavLink to="/home">
                <FaFacebookSquare className="facebook" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/home">
                <FaInstagramSquare className="instagram" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/home">
                <FaYoutubeSquare className="youtube" />
              </NavLink>
            </li>
          </ul>

          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <NavLink to="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu />
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
