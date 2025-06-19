import axios from "axios";
import {useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import AdminNavbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";

import {getCookie, server_url} from "../utils/script.jsx";

function AdminLayout() {
    const [renderComponent, setRenderComponent] = useState(false);

    const navigate = useNavigate();

    async function verifyToken(token) {
        const url = `${server_url}/admin/verify-token`;
        console.log(url);
        
        let response = await axios(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        // console.log("Respone data: ", response.data);
        let {error} = response

        if(error) {
            setRenderComponent(false);
            navigate('/signin');
        } else {
            setRenderComponent(true);
        }
    }

    useEffect(() => {
        const token = getCookie('userToken'); // undefined

        if (!token) {
            navigate('/admin');
        } else {
            verifyToken(token)
        }
    }, [navigate]);

    return (
        <>
            {renderComponent &&
                <>
                    <AdminNavbar/>
                    <Outlet/>
                    <Footer/>
                </>
            }

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

export default AdminLayout;