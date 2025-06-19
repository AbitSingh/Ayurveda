import React from 'react';
import {toast} from "react-toastify";
import {useState} from "react";
import axios from "axios";
const Footer = () => {

const [newsletterEmail, setNewsletterEmail] = useState("");

const handleNewsletterSubmit = () => {
  if (!newsletterEmail.trim()) {
    toast.warn("Please enter your email.");
    return;
  }

  // Optionally: you can add simple email format validation here
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(newsletterEmail)) {
  //   toast.warn("Please enter a valid email address.");
  //   return;
  // }

  toast.success("You have been subscribed to our newsletter!");
  setNewsletterEmail(""); // Reset field after success
};

  return (
    <footer className="footer widget-footer bg-base-dark text-base-white overflow-hidden clearfix">
      <div className="second-footer">
        <div className="container">
          <div className="row">
            {/* Left Section */}
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget-box prt-pr">
                <h3 className="widget-title-h3">Quick link</h3>
                <div className="footer-menu-links">
                  <ul className="footer-menu-list">
                    {[
                      "About us",
                      "Experiences",
                      "Our patients",
                      "Home care",
                      "Services",
                      "Success story",
                      "Doctors",
                    ].map((text, index) => (
                      <li className="footer-menu-item" key={index}>
                        <a href="#" className="footer-menu-item-link">{text}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                {/* Newsletter */}
<div className="newsletter-form-main clearfix">
  <h3 className="widget-title-h3">Our newsletter</h3>
  <div className="widget-form">
    <form
      id="subscribe-form"
      className="newsletter-form"
      method="post"
      action="#"
      data-mailchimp="true"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mailchimp-inputbox clearfix" id="subscribe-content">
        <p>
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="form-control"
          />
        </p>
        <button
          className="btn btn-success"
          type="button"
          onClick={handleNewsletterSubmit}
        >
          Go
        </button>
      </div>
      <p className="cookies">
        <input type="checkbox" name="cookies-consent" id="cookies-consent1" />
        <label htmlFor="cookies-consent1"></label>
        I agree to all terms and conditions
      </p>
    </form>
  </div>
</div>

              </div>
            </div>

            {/* Center Image */}
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget-box">
                <div className="footer-img">
                  <a href="#">
                    <img
                      width="441"
                      height="385"
                      className="img-fluid w-100 border-rad_10"
                      src="/images/footer-img.jpg"
                      alt="image"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="footer-widget-box prt-pl">
                <h3 className="widget-title-h3">Contact</h3>
                <ul className="prt-list footer-cta-list">
                  <li className="list-items">UA: <a href="tel:1234567890">+3 8096 272 2100</a></li>
                  <li className="list-items">59 Street, 1200 Techpark</li>
                  <li className="list-items"><a href="mailto:mail@veda-lab.com">mail@veda-lab.com</a></li>
                </ul>

                {/* Social Media */}
                <div className="social-icons">
                  <h3 className="widget-title-h3">Follow on social media</h3>
                  <ul className="footer-social-icons">
                    {["Facebook", "Dribbble", "Behance", "Pinterest", "Instagram"].map((platform, idx) => (
                      <li className="footer-social-icons-item" key={idx}>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="footer-social-icons-link">
                          {platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copyright */}
                <div className="copyright">
                  <div className="copyright-text">
                    <ul className="footer-nav-menu">
                      <li><a href="#">Privacy policy</a></li>
                      <li><a href="#">Terms and conditions</a></li>
                      <li><a href="#">Help</a></li>
                    </ul>
                    <div className="cpy-text">
                      <p>2025 Vedacare © All rights reserved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* row end */}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="marquee-block overflow-hidden">
                <div className="marquee">
                  <div className="marquee-content">
                    {/* Add any dynamic content if needed */}
                  </div>
                </div>
              </div>
            </div>
          </div> {/* row end */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
