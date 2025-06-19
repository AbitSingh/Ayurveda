import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import PublicNavbar from "../components/PublicNavbar.jsx";
import Footer from "../components/Footer.jsx";

function PublicLayout() {
    return (
        <>
            <PublicNavbar/>
            <Outlet/>
            <Footer/>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    )
}

export default PublicLayout;