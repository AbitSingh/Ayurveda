import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getCookie, server_url} from "../utils/script.jsx";

function UserNavbar() {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [formData, setFormData] = useState({
        loginEmail: '',
        loginPassword: '',
        signupName: '',
        signupEmail: '',
        signupPassword: '',
        signupConfirmPassword: ''
    });

    // Check token on component mount and when token changes
    useEffect(() => {
        const token = getCookie('userToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleLogin = async () => {
        const { loginEmail, loginPassword } = formData;
        console.log(loginEmail, loginPassword);
        if (!loginEmail || !loginPassword) {
            toast.warn("⚠️ Please fill in all login fields.");
            return;
        }

        const res = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loginEmail, loginPassword }),
            // credentials: 'include' // 👈 important for cookies
        });

        const data = await res.json();
        let {error,message,token}=data;
        let duration=60*60*24*1;
        document.cookie = `userToken=${token}; path=/; max-age=${duration}`; // Set the cookie with the token
        if (!data.error) {
            toast.success("✅ Login successful!");
            setIsLoggedIn(true);
            const offcanvas = window.bootstrap.Offcanvas.getInstance(document.getElementById('loginOffcanvas'));
            if (offcanvas) offcanvas.hide();
        } else {
            toast.error("❌ " + data.message);
        }
    };
    

    const handleLogout = async () => {
        // Clear the token cookie
        document.cookie = "userToken=; path=/; max-age=0";
        
        const res = await fetch('http://localhost:5000/user/logout');
        const data = await res.json();
        if (!data.error) {
            toast.success("👋 Logged out successfully!");
            setIsLoggedIn(false);
        } else {
            toast.error("❌ " + data.message);
        }
    };

    const handleSignup = async () => {
        const { signupName, signupEmail, signupPassword, signupConfirmPassword } = formData;
        if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
            toast.warn("⚠️ Please fill in all signup fields.");
            return;
        }
        if (signupPassword !== signupConfirmPassword) {
            toast.warn("⚠️ Passwords do not match.");
            return;
        }
        const res = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword, confirmPassword: signupConfirmPassword })
        });
        const data = await res.json();
        if (!data.error) {
            toast.success("✅ Signup successful!");
            setShowLogin(true);
        } else {
            toast.error("❌ " + data.message);
        }
    };

    return (
        <>
<style>
                {`
                /* Global z-index hierarchy */
                .toast-container { z-index: 9999; }
                .offcanvas, .modal { z-index: 1050; }
                .offcanvas-backdrop, .modal-backdrop { z-index: 1040; }
                
                /* Set dropdown higher than navbar but lower than modals */
                .dropdown-menu {
                    z-index: 1030 !important;
                    position: absolute !important;
                }
                
                /* Make sure the header is at a lower z-index than dropdowns */
                .header, .site-header-menu, .prt-stickable-header {
                    position: relative;
                    z-index: 1020 !important;
                }
                
                /* Ensure dropdown button retains the right z-index */
                .dropdown {
                    position: relative;
                    z-index: 1030 !important;
                }
                
                /* Background content should have lower z-index */
                .prt-bg, .hero-section, .prt-slider, .hero-slide, 
                .featured-thumbnail, .featured-imagebox, .slick_slider, 
                .prt-single-image-wrapper, .prt-single-image-overlay, 
                img, .img-fluid {
                    position: relative;
                    z-index: 1 !important;
                }
                
                /* Ensure offcanvas shows correctly */
                .offcanvas.show {
                    transform: translateX(0) !important;
                    visibility: visible !important;
                }
                
                /* Fix for Bootstrap dropdown display */
                .dropdown-menu.show {
                    display: block !important;
                }
                `}
            </style>

            <header className="header prt-header-style-01">
                <div className="top_bar prt-topbar-wrapper clearfix">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="top_bar_contact_item text-center">
                                    <span className="top_bar_icon"><i className="flaticon flaticon-alert"></i></span>
                                    Get flat 15% discount on all products — <a href="/showAllProducts">View more</a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="site-header-menu" className="site-header-menu">
                    <div className="site-header-menu-inner prt-stickable-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="site-navigation d-flex align-items-center">
                                            <div className="site-branding">
                                                <h1>
                                                    <Link className="home-link" to="/">
                                                        <img id="logo-img" height="19" width="143" className="img-fluid auto_size" src="/images/Logo-2.jpg" alt="logo-img" />
                                                    </Link>
                                                </h1>
                                            </div>
                                            <div className="menu-link">
                                                <div className="btn-show-menu-mobile menubar menubar--squeeze">
                                                    <span className="menubar-box">
                                                        <span className="menubar-inner"></span>
                                                    </span>
                                                </div>
                                                <nav className="main-menu menu-mobile" id="menu">
                                                    <ul className="menu">
                                                        <li className="mega-menu-item active"><Link to="/">Home</Link></li>
                                                        <li className="mega-menu-item"><Link to="/showAllProducts">Products</Link></li>
                                                        <li className="mega-menu-item"><a href="/#appointment-section"> Book</a></li>
                                                        <li className="mega-menu-item"><Link to="/user/blogs">Blog</Link></li>
                                                        <li className="mega-menu-item"><Link to="/user/contactus">Contact us</Link></li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <div className="header_extra d-flex align-items-center">
                                                <div className="contact_item-link">
                                                    <span><a href="mailto:contact.vedacare@gmail.com">contact.vedacare@gmail.com</a></span>
                                                </div>
                                                <div className="contact_item with-icon">
                                                    <span><i className="icon-whatsapp"></i> <a href="tel:1234567890">+91 7986346773</a></span>
                                                </div>

                                                {isLoggedIn ? (
                                                    <div className="dropdown mx-3" >
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            My Account
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li><Link className="dropdown-item" to="/user/cart">Cart</Link></li>
                                                            <li><Link className="dropdown-item" to="/user/changePassword">Change Password</Link></li>
                                                            <li><Link className="dropdown-item" to="/showAllProducts">Products</Link></li>
                                                            <li><hr className="dropdown-divider" /></li>
                                                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <button className="btn btn-success mx-3" data-bs-toggle="offcanvas" data-bs-target="#loginOffcanvas">Login</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="loginOffcanvas" aria-labelledby="offcanvasLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasLabel">{showLogin ? "Login" : "Sign Up"}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {showLogin ? (
                        <>
                            <div className="mb-2">
                                <label className="form-label">Email address</label>
                                <input type="email" id="loginEmail" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Password</label>
                                <input type="password" id="loginPassword" className="form-control" onChange={handleChange} />
                            </div>
                            <button className="btn btn-success w-100" onClick={handleLogin}>Login</button>
                            <hr />
                            <div className="text-center">
                                <small>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(false); }}>Sign Up</a></small>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-2">
                                <label className="form-label">Full Name</label>
                                <input type="text" id="signupName" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Email address</label>
                                <input type="email" id="signupEmail" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Password</label>
                                <input type="password" id="signupPassword" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" id="signupConfirmPassword" className="form-control" onChange={handleChange} />
                            </div>
                            <button className="btn btn-success w-100" onClick={handleSignup}>Sign Up</button>
                            <hr />
                            <div className="text-center">
                                <small>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>Login</a></small>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={3000} pauseOnHover />
        </>
    );
}

export default UserNavbar;