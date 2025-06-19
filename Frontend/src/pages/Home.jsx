import { style } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import UserNavbar from '../components/UserNavbar';
// import Footer from '../components/Footer';
import {server_url, getCookie} from "../utils/script.jsx";
import {toast} from "react-toastify";
import ChatBot from '../components/ChatBot';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    phone: '',
    message: '',
    subject: 'select-subject',
    date: ''
  });


  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin/getCategory', { method: 'GET' });
        const data = await res.json();
        if (data.record) {
          setCategories(data.record);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    const loadProducts = async () => {
      try {
        var res = await fetch('http://localhost:5000/admin/getProducts');
        
        var data = await res.json();
        var {records} = data;
        console.log(records);
        if (data.error === false) {
            setProducts(data.records);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    loadCategories();
    loadProducts();

    // Set min date for appointment
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('date')?.setAttribute('min', minDate);
  }, []);

  // Load subcategories when dropdown is clicked
  const loadSubcategories = async (categoryId, categoryName) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/getSubcategoriesDropdown?categoryId=${encodeURIComponent(categoryId)}`, {
        method: 'GET'
      });
      var data = await res.json();
      console.log(data);
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: data.subcategories || data.records || [] // Handle both response formats
      }));
    } catch (err) {
      console.error(`Error loading subcategories for ${categoryName}:`, err);
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: []
      }));
    }
  };
  
  const handleCategoryClick = async (categoryId, categoryName) => {
    // Only load if we haven't loaded them before
    if (!subcategories[categoryId]) {
      await loadSubcategories(categoryId, categoryName);
    }
  };

  const showAllProducts = (event) => {
    event.preventDefault();
    navigate('/showAllProducts');
    //http://localhost:3000/user/showAllProducts
  };


  
  const addToCart = async (productId, price, discountedPrice, discount) => {
    var token = getCookie("userToken");
    try {
      const res = await fetch(`${server_url}/user/addToCart/${productId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          oldPrice: price,
          newPrice: discountedPrice,
          discount: discount
        })
      });
      
      const data = await res.json();
      if (!data.error) {
        toast.success(data.message);
      } else {
        toast.warn(data.message);
        navigate(data.redirect || '/login');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const makeAppointment = async () => {
    var token = getCookie("userToken");
    const { name, phone, message, subject, date } = appointmentData;
    
    if (!name || !phone || !message || subject === 'select-subject' || !date) {
      toast.warn("All Fields are required");
      return;
    }

    try {
      const res = await fetch(`${server_url}/user/bookAppointment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await res.json();
      if (!data.error) {
        toast.success(data.message);
        setAppointmentData({
          name: '',
          phone: '',
          message: '',
          subject: 'select-subject',
          date: ''
        });
      } else {
        toast.warn(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="page">
      {/* <UserNavbar /> */}
      <ChatBot />
      
      <div id="dynamicNavbar" className="container-fluid bg-light py-2 d-flex justify-content-between">
  {categories.map(category => (
    <div className="dropdown mx-2" key={category.id}>
      <button
        className="btn btn-outline-success dropdown-toggle"
        type="button"
        id={`dropdown-${category.id}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={(e) => {
          //e.preventDefault();
          handleCategoryClick(category.id, category.name);
        }}
      >
        {category.name}
        
      </button>
      <ul className="dropdown-menu" aria-labelledby={`dropdown-${category.id}`}>
        {subcategories[category.id] ? (
          subcategories[category.id].length > 0 ? (
            subcategories[category.id].map(subcategory => (
              <li key={`${category.id}-${subcategory.id}`}>
                <a 
                  className="dropdown-item" 
                  href="#"
                  onClick={(e) => {
                    // e.preventDefault();
                    console.log('Subcategory clicked:', {subcategory});
                    navigate(`/user/showProductsBySubcategory/${subcategory}`);
                  }}
                >
                  {subcategory}
                </a>
              </li>
            ))
          ) : (
            <li><span className="dropdown-item text-muted">No subcategories</span></li>
          )
        ) : (
          <li><span className="dropdown-item text-muted">Loading...</span></li>
        )}
      </ul>
    </div>
  ))}
</div>



      {/* Hero Section */}
      <div className="hero-section prt-bg">
        <div className="hero-slider-wrapper">
          <div className="hero-slider prt-slider">
            <div className="hero-slide slide-1">
              <div className="container">
                <div className="row">
                  <div className="col-xl-10 col-lg-12 position-relative m-auto">
                    <div className="hero-content-block">
                      <div className="hero-content">
                        <div className="pretitle">
                          <h3>Harmony with </h3>
                        </div>
                        <div className="">
                          <h2 className="title"><span>Ayurveda</span> Care</h2>
                        </div>
                        <div className="hero-slider_btn mt-10 res-991-mt-30">
                          <a className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-fill prt-btn-color-skincolor mr-15 mb-10" href="contact-us.html">Make an appointment</a>
                          <a className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-border prt-btn-color-whitecolor mb-10" href="/user/contactus">Contact us</a>
                        </div>
                      </div>
                    </div>
                    <div className="hero-overlay-box">
                      <div className="prt-icon prt-icon_element-onlytxt prt-icon_element-size-lg prt-icon_element-color-darkcolor">
                        <i className="flaticon flaticon-verification"></i>
                      </div>
                      <div><h3>Vaterian hospital services manufacture In 1996</h3></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-slide slide-2">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 position-relative">
                    <div className="hero-content-block">
                      <div className="hero-content">
                        <div className="pretitle">
                          <h3>Welcome to the</h3>
                        </div>
                        <div className="">
                          <h2 className="title">Ayurveda</h2>
                        </div>
                        <div className="d-flex align-items-center mt-50 res-991-mt-30">
                          <div className="hero-slider_btn">
                            <a className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-fill prt-btn-color-skincolor mr-25 mb-10" href="contact-us.html">Make an appointment</a>
                          </div>
                          <div className="prt-hero-link">
                            <div className="prt-call"><i className="icon-whatsapp"></i> <a href="tel:1234567890">+123 456 7890</a></div>
                            <div className="prt-email"><a href="mailto:info@example.com">contact.vedacare@gmail.com</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hero-overlay-box">
                      <div className="prt-icon prt-icon_element-onlytxt prt-icon_element-size-lg prt-icon_element-color-darkcolor">
                        <i className="flaticon flaticon-verification"></i>
                      </div>
                      <div><h3>Vaterian hospital services manufacture In 1996</h3></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="site-main">
        <section className="prt-row about-section animation clearfix">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="pr-20 res-1199-pr-0">
                  <div className="section-title">
                    <div className="title-header">
                      <h2 className="title">Short story about dr. veda of nature and science.</h2>
                    </div>
                    <div className="title-desc">
                      <p className="prt-about-desc">A passionate advocate for the nature and the science and united these realms, defying their separation.</p>
                    </div>
                  </div>
                  <div className="prt_single_image-wrapper mt-30 res-991-mt-0 fadeleft-anim">
                    <img width="615" height="500" className="img-fluid border-rad_20" src="/images/single-img-01.jpg" alt="image" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="pl-20 res-1199-pl-0 res-991-mt-30">
                  <div className="prt_single_image-wrapper mb-40 faderight-anim">
                    <img width="615" height="500" className="img-fluid border-rad_20" src="/images/single-img-02.jpg" alt="image" />
                  </div>
                  <div className="section-title">
                    <div className="title-desc">
                      <p>In her tranquil cottage on the edge of a pristine forest, she conducted groundbreaking research that brought together the wisdom of the natural world and the precision of scientific inquiry.</p>
                    </div>
                  </div>
                  <div className="row g-0">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <ul className="prt-list prt-list-style-icon-01 pr-10 res-575-pr-0">
                        <li className="prt-list-li-content">Professional doctors</li>
                        <li className="prt-list-li-content">Digital laboratory</li>
                        <li className="prt-list-li-content">Online schedule</li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <ul className="prt-list prt-list-style-icon-01">
                        <li className="prt-list-li-content">24/7 Online support</li>
                        <li className="prt-list-li-content">High packages</li>
                        <li className="prt-list-li-btn"><a href="#">View more</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="prt-row prt-bg bg-base-grey prt-bgimage-yes bg-img1 cta-section position-relative animation clearfix">
          <div className="prt-row-wrapper-bg-layer prt-bg-layer bg-base-grey"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="prt-single-image-overlay">
                  <img width="480" height="491" className="img-fluid" src="/images/single-overlay.png" alt="img" />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="section-title title-style-center_text">
                  <div className="title-header">
                    <h2 className="cta-title">Need a help</h2>
                    <h3 className="cta-titlepre">Get a free medical checkup</h3>
                  </div>
                  <div className="cta-bnt mt-40 fadeup-amin">
                    <a className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-fill prt-btn-color-skincolor" href="contact-us.html">+3 (092) 508-38-01</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section className="prt-row product-section animation clearfix">
          <div className="container">
            <div className="row row-equal-height">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="featured-icon-box icon-align-before-content style1 bg-base-dark">
                  <div className="featured-icon">
                    <div className="prt-icon prt-icon_element-onlytxt prt-icon_element-size-lg prt-icon_element-color-darkcolor">
                      <i className="flaticon flaticon-organic-product"></i>
                    </div>
                  </div>
                  <div className="featured-content">
                    <div className="featured-title">
                      <h3>100% Organic</h3>
                    </div>
                    <div className="featured-desc">
                      <p>Certified 100% organic products</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="featured-icon-box icon-align-before-content style1 bg-base-skin">
                  <div className="featured-icon">
                    <div className="prt-icon prt-icon_element-onlytxt prt-icon_element-size-lg prt-icon_element-color-darkcolor">
                      <i className="flaticon flaticon-quality"></i>
                    </div>
                  </div>
                  <div className="featured-content">
                    <div className="featured-title">
                      <h3>Certified medicine</h3>
                    </div>
                    <div className="featured-desc">
                      <p>Reliable medical treatments</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="featured-icon-box icon-align-before-content style1 bg-base-dark">
                  <div className="featured-icon">
                    <div className="prt-icon prt-icon_element-onlytxt prt-icon_element-size-lg prt-icon_element-color-darkcolor">
                      <i className="flaticon flaticon-hourglass"></i>
                    </div>
                  </div>
                  <div className="featured-content">
                    <div className="featured-title">
                      <h3>Various awards received</h3>
                    </div>
                    <div className="featured-desc">
                      <p>Recipient of multiple awards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Display */}
            <div id="product-container" className="row row-equal-height slick_slider fadeup-amin"
              data-slick='{"slidesToShow": 4, "slidesToScroll": 1, "arrows":false, "dots":false, "autoplay":true, "infinite":true, "responsive": [{"breakpoint":1290,"settings":{"slidesToShow": 3}}, {"breakpoint":992,"settings":{"slidesToShow": 2,"arrows":false}},{"breakpoint":576,"settings":{"slidesToShow": 1}},{"breakpoint":375,"settings":{"slidesToShow": 1}}]}'>
              {products.map(product => {
                const discountPrice = product.price - (product.price * product.discount / 100);

                return (
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={product.id}>
                    <div className="featured-imagebox featured-imagebox-product style1">
                    <div className="featured-thumbnail" style={{
                      width: '100%',
                      height: '250px', // Set consistent height
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px'
                    }}>
                      <img
                        src={`${server_url}${product.photo}`}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        className="img-fluid"
                      />
                    </div>
                      <div className="featured-content">
                        <div className="featured-title">
                          <h3><a href="#">{product.name}</a></h3>
                        </div>
                        <div className="featured-desc">
                          <p><span><a href="#" style={{color: "red"}}>₹{product.price}</a></span> <a href="#">₹{Math.round(discountPrice)}</a></p>
                        </div>
                        <span>
                          <div className="prt-product-btn">
                            <a 
                              className="prt-btn prt-btn-size-sm prt-btn-shape-round prt-btn-style-border prt-btn-color-darkcolor" 
                              onClick={() => addToCart(product._id, product.price, discountPrice, product.discount)}
                            >
                              Add to cart
                            </a>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


            
            
            <div className="row">
              <div className="col-xl-7 col-lg-10 col-md-12 m-auto">
                <div className="prt-product-text">
                  <p>Explore a wide selection of products in our inventory <a className="prt-btn btn-inline prt-btn-color-whitecolor btn-underline" onClick={showAllProducts}>View all products</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appointment Section */}
        <section id="appointment-section" className="prt-row prt-bg bg-base-darkblack prt-bgimage-yes bg-img2 appointment-section position-relative clearfix">
          <div className="prt-row-wrapper-bg-layer prt-bg-layer bg-base-darkblack"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title title-style-center_text">
                  <div className="title-header">
                    <h2 className="title text-white">Explain your health problem</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-25">
              <div className="col-lg-12">
                <div className="prt-appointment-block">
                  <form id="resetForm" className="query_form wrap-form clearfix">
                    <div className="row">
                      <div className="col-lg-8 col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <span className="text-input">
                              <input 
                                id="name" 
                                name="name" 
                                type="text" 
                                value={appointmentData.name}
                                onChange={handleAppointmentChange}
                                placeholder="Name*" 
                                required 
                              />
                            </span>
                          </div>
                          <div className="col-md-6">
                            <span className="text-input">
                              <input 
                                id="phone" 
                                name="phone" 
                                type="text" 
                                value={appointmentData.phone}
                                onChange={handleAppointmentChange}
                                placeholder="Phone*" 
                                required 
                              />
                            </span>
                          </div>
                          <div className="col-md-6">
                            <span className="text-input select-option">
                              <select 
                                id="subject" 
                                name="subject"
                                value={appointmentData.subject}
                                onChange={handleAppointmentChange}
                                required
                              >
                                <option value="select-subject">Subject*</option>
                                <option value="Digestive Issues">Digestive Issues</option>
                                <option value="Child Health">Child Health</option>
                                <option value="Joint Pain">Joint & Muscle Pain</option>
                                <option value="stress_anxiety">Stress & Anxiety</option>
                                <option value="weight_management">Weight Management</option>
                                <option value="respiratory_issues">Respiratory Issues (Cough, Asthma, Cold)</option>
                              </select>
                            </span>
                          </div>
                          <div className="col-md-6">
                            <span className="text-input">
                              <input 
                                id="date" 
                                name="date" 
                                type="date" 
                                value={appointmentData.date}
                                onChange={handleAppointmentChange}
                                required 
                              />
                            </span> 
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12">
                        <span className="text-input">
                          <textarea 
                            id="message" 
                            name="message" 
                            rows="4" 
                            value={appointmentData.message}
                            onChange={handleAppointmentChange}
                            placeholder="Message*" 
                            required
                          ></textarea>
                        </span>
                      </div>
                      <div className="col-md-12 text-center">
                        <button 
                          type="button" 
                          onClick={makeAppointment}
                          className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-fill prt-btn-color-darkcolor"
                        >
                          Make an appointment
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog-section" className="prt-row blog-section animation clearfix">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-12 col-sm-12 ">
                <div className="">
                  <div className="section-title mb-45 res-991-mb-30">
                    <div className="title-header">
                      <h2 className="blog-title">Our latest stories</h2>
                    </div>
                    <div className="title-desc">
                      <p>Stay informed and inspired with our freshest content, delivering insights and stories that matter.</p>
                      <a className="prt-btn btn-inline prt-btn-color-darkcolor btn-underline" href="/user/blogs">View all stories</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row fadeup-amin">
              <div className="col-lg-3 col-md-4 col-sm-12 ">
                <div className="featured-imagebox featured-imagebox-post style1">
                  <div className="featured-thumbnail">
                    <img width="303" height="300" className="img-fluid" src="/images/blog/blog-01.jpg" alt="" />
                  </div>
                  <div className="featured-content">
                    <div className="featured-content-inner">
                      <div className="post-header">
                        <div className="post-meta">
                          <span className="prt-meta-line category">Thearpy</span>
                          <span className="prt-meta-line time">8 min ago</span>
                          <span className="prt-meta-line comment">10 Comment</span>
                        </div>
                        <div className="post-title featured-title">
                          <h3><a href="blog-single.html">Here's the top promising ayurvedic content of - 2025</a></h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-4 col-sm-12 prt-post-mt ">
                <div className="pl-30 pr-30 res-1199-pl-0 res-1199-pr-0">
                  <div className="featured-imagebox featured-imagebox-post style1">
                    <div className="featured-thumbnail prt-blog-img">
                      <img width="574" height="530" className="img-fluid" src="/images/blog/blog-02.jpg" alt="" />
                    </div>
                    <div className="featured-content">
                      <div className="featured-content-inner">
                        <div className="post-header">
                          <div className="post-meta">
                            <span className="prt-meta-line category">Thearpy</span>
                            <span className="prt-meta-line time">8 min ago</span>
                            <span className="prt-meta-line comment">10 Comment</span>
                          </div>
                          <div className="post-title featured-title">
                            <h3><a href="blog-single.html">Best lawyer services HTML template listed as multilingual WPML compatible</a></h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-12 prt-post-mt ">
                <div className="featured-imagebox featured-imagebox-post style1">
                  <div className="featured-thumbnail">
                    <img width="303" height="300" className="img-fluid" src="/images/blog/blog-03.jpg" alt="" />
                  </div>
                  <div className="featured-content">
                    <div className="featured-content-inner">
                      <div className="post-header">
                        <div className="post-meta">
                          <span className="prt-meta-line category">Thearpy</span>
                          <span className="prt-meta-line time">5 min ago</span>
                          <span className="prt-meta-line comment">05 Comment</span>
                        </div>
                        <div className="post-title featured-title">
                          <h3><a href="blog-single.html">Get the best opencart template for the medical</a></h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact-section" className="prt-row prt-bg bg-base-grey padding_zero-section cta-section01 clearfix">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <div className="prt-cta-mainblock ">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="prt-cta-call">
                      <p>Looking for consultation? <a href="tel:1234567890">+1 3333 000 444</a></p>
                    </div>
                    <div className="prt-cta-title"><h3>We are <span>certified</span> ayurved company</h3></div>
                  </div>
                  <div className="prt-cta-btn res-1199-mt-30">
                    <a className="prt-btn prt-btn-size-md prt-btn-shape-round prt-btn-style-border prt-btn-color-darkcolor ml-20" href="/user/contactus">Contact us</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;