import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


// Public
import PublicLayout from "./layouts/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";

// Admin
import AdminLayout from "./layouts/AdminLayout.jsx";
import DashboardAdmin from "./pages/admin/Dashboard.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminManagePage from "./pages/admin/AdminManagePage.jsx";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage.jsx";
import AdminProductPage from "./pages/admin/AdminProductPage.jsx";
import AdminSubCategoryPage from "./pages/admin/AdminSubCategoryPage.jsx";
import AdminPendingOrders from "./pages/admin/AdminPendingOrders.jsx";
import AdminShippedOrders from "./pages/admin/AdminShippedOrders.jsx";
import AdminDeliverOrders from "./pages/admin/AdminDeliverOrders.jsx";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage.jsx";
import AdminBlogManagement from "./pages/admin/AdminBlogManagement.jsx";
import AdminBlogUpdate from "./pages/admin/AdminBlogUpdate";

// User
import UserLayout from "./layouts/UserLayout.jsx";
import Dashboard from "./pages/users/Dashboard.jsx";
import Profile from "./pages/users/Profile.jsx";
import ChangePassword from "./pages/users/ChangePassword.jsx";
import ShowAllProducts from "./pages/users/showAllProducts.jsx";
import OpenCartPage from "./pages/users/OpenCartPage.jsx";
import MyOrders from "./pages/users/MyOrders.jsx";
import ThankYouPage from "./pages/users/ThankYouPage.jsx";
import ContactUsPage from "./pages/users/ContactUsPage.jsx";
import ShowProductsBySubcategory from "./pages/users/ShowProductsBySubcategory.jsx";
import ProductCard from "./pages/users/ProductDescription.jsx";
import UserForgotPassword from "./pages/users/UserForgotPassword.jsx";
import EnterNewPassword from "./pages/users/EnterNewPassword.jsx";
import UserBlogList from "./pages/users/UserBlogList";
import UserBlogDetail from "./pages/users/UserBlogDetail";

// Global CSS
import './assets/css/all.min.css';
import './assets/css/animate.css';
import './assets/css/aos.css';
import './assets/css/bootstrap.min.css';
import './assets/css/flaticon.css';
import './assets/css/font-awesome.css';
import './assets/css/fontello.css';
import './assets/css/main.css';
import './assets/css/megamenu.css';
import './assets/css/prettyPhoto.css';
import './assets/css/responsive.css';
import './assets/css/samarkannormal.css';
import './assets/css/shortcodes.css';
import './assets/css/slick.css';
import './assets/css/themify-icons.css';


export const NameContext = createContext();

function App() {
    const [name, setName] = useState("Pratham");
    const [user, setUser] = useState({
        name: 'Aryan',
        age: 24,
        gender: 'Male',
    });

    return (
        <BrowserRouter>
            <NameContext.Provider value={{ name, setName, user, setUser }}>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="user-Signup" element={<UserSignup />} />
                        <Route path="user-login" element={<UserLogin />} />
                        <Route path="admin-login" element={<AdminLogin />} />
                        <Route path="showAllProducts" element={<ShowAllProducts />} />   
                    </Route>

                    <Route path="/admin" element={ <AdminLoginPage/>}  />
                    
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="AdminManagePage" element={<AdminManagePage />} />
                        <Route path="manageCategory" element={<AdminCategoryPage />} />
                        <Route path="manageSubCategories" element={<AdminSubCategoryPage />} />
                        <Route path="manageProducts" element={<AdminProductPage />} />
                        <Route path="pendingOrders" element={<AdminPendingOrders />} />
                        <Route path="shippedOrders" element={<AdminShippedOrders />} />
                        <Route path="deliveredOrders" element={<AdminDeliverOrders />} />
                        <Route path="seeAppointments" element={<AdminAppointmentsPage />} />
                        <Route path="home" element={<DashboardAdmin />} />
                        <Route path="blogManagement" element={<AdminBlogManagement />} />
                        <Route path="blogManagement/update/:id" element={<AdminBlogUpdate />} />
                    </Route>

                    <Route path="/user" element={<UserLayout />}>
                        <Route path="home" element={<Dashboard />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="changePassword" element={<ChangePassword />} />
                        <Route path="cart" element={<OpenCartPage />} />
                        <Route path="thankYou" element={<ThankYouPage />} />
                        <Route path="myOrders" element={<MyOrders />} />    
                        <Route path="contactus" element={<ContactUsPage />} />
                        <Route path="showProductsBySubcategory/:subcategory" element={<ShowProductsBySubcategory />} />
                        <Route path="products/:productId" element={<ProductCard />} />
                        <Route path="forgotPassword" element={<UserForgotPassword />} />
                        <Route path="enterNewPassword" element={<EnterNewPassword />} />
                        <Route path="blogs" element={<UserBlogList />} />
                        <Route path="blogs/:id" element={<UserBlogDetail />} />
                    </Route>
                </Routes>
            </NameContext.Provider>
        </BrowserRouter>
    );
}

export default App;
