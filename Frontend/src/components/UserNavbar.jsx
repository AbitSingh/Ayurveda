import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';

function UserNavbar() {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // NEW state

    const [formData, setFormData] = useState({
        loginEmail: '',
        loginPassword: '',
        signupName: '',
        signupEmail: '',
        signupPassword: '',
        signupConfirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleLogin = async () => {
        const res = await fetch('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginEmail: formData.loginEmail,
                loginPassword: formData.loginPassword
            })
        });
        const data = await res.json();
        if (!data.error) {
            toast.success("✅ Login successful!");
            setIsLoggedIn(true); // set login state
            window.bootstrap.Offcanvas.getInstance(document.getElementById('loginOffcanvas'))?.hide();
        } else {
            toast.error("❌ " + data.message);
        }
    };

    const handleLogout = async () => {
        const res = await fetch('/user/logout');
        const data = await res.json();
        if (!data.error) {
            toast.success("👋 Logged out successfully!");
            setIsLoggedIn(false); // reset login state
        } else {
            toast.error("❌ " + data.message);
        }
    };

    const handleSignup = async () => {
        const { signupName, signupEmail, signupPassword, signupConfirmPassword } = formData;
        const res = await fetch('/user/register', {
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
        <header className="header prt-header-style-01">
            {/* Top bar */}
            <div className="top_bar prt-topbar-wrapper clearfix">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="top_bar_contact_item text-center">
                                <span className="top_bar_icon"><i className="flaticon flaticon-alert"></i></span>
                                Using its extensive fish farming experience and knowledge, Fleuren & Nooijen is now a market <a href="#">View more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main menu */}
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
                                                    <img id="logo-img" height="19" width="130" className="img-fluid auto_size" src="/images/Logo-2.jpg" alt="logo-img" />
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
                                                    <li className="mega-menu-item"><Link to="/#appointment-section">Book</Link></li>
                                                    <li className="mega-menu-item"><Link to="/#blog-section">Blog</Link></li>
                                                    <li className="mega-menu-item"><Link to="/user/contactus">Contact us</Link></li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>

                                    {/* Right side buttons */}
                                    <div className="d-flex align-items-center">
                                        <div className="header_extra d-flex align-items-center">
                                            <div className="contact_item-link">
                                                <span><a href="mailto:contact.vedacare@gmail.com">contact.vedacare@gmail.com</a></span>
                                            </div>
                                            <div className="contact_item with-icon">
                                                <span><i className="icon-whatsapp"></i> <a href="tel:1234567890">+91 7986346773</a></span>
                                            </div>

                                            {/* Conditional Dropdown */}
                                            {isLoggedIn ? (
                                                <div className="dropdown mx-3">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        My Account
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><Link className="dropdown-item" to="/cart">Cart</Link></li>
                                                        <li><Link className="dropdown-item" to="/user/changePassword">Change Password</Link></li>
                                                        <li><Link className="dropdown-item" to="/user/showAllProducts">Products</Link></li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <button className="btn btn-success mx-3" data-bs-toggle="offcanvas" data-bs-target="#loginOffcanvas">Login</button>
                                            )}

                                            {/* Login Offcanvas */}
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
                                                                <small>Don't have an account? <a href="#" onClick={() => setShowLogin(false)}>Sign Up</a></small>
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
                                                                <small>Already have an account? <a href="#" onClick={() => setShowLogin(true)}>Login</a></small>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div> {/* Right side end */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default UserNavbar;
