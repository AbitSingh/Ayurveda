import axios from "axios";
import {useEffect, useState} from "react";
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";


function Profile() {
    const [profile, setProfile] = useState(null);

    async function getProfileInfo() {
        const token = getCookie('userToken');

        const url = `${server_url}/profile`;
        let response = await axios(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const {error, message, record} = response.data;

        if (error) {
            toast.error(message);
        } else {
            // console.log(record[0])
            setProfile(record[0]) // {...}
        }
    }

    useEffect(() => {
        getProfileInfo();
    }, []);

    const [showForm, setShowForm] = useState(false);

    const {
        register,
        handleSubmit,
        setValue
    } = useForm();

    function showDataInForm() {
        setShowForm(true);
        setValue('id', profile.id);
        setValue('full_name', profile.full_name);
        setValue('email', profile.email);
    }

    async function onSubmit(data) {
        const token = getCookie('userToken');

        const url = `${server_url}/profile`;
        let response = await axios.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const {error, message,} = response.data;

        if (error) {
            toast.error(message);
        } else {
            getProfileInfo();
            setShowForm(false);
            toast.success(message);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <h1>My Profile</h1>
                    <hr/>

                    {profile &&
                        <div className="row">
                            {showForm ?
                                <div className="col-12">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label>Full Name</label>
                                            <input type="text" {...register('full_name')}
                                                   className="form-control"/>
                                        </div>

                                        <div className="mb-3">
                                            <label>Email</label>
                                            <input type="email" {...register('email')}
                                                   className="form-control"/>
                                        </div>

                                        <button className="btn btn-primary">Update</button>
                                        <button type="button" onClick={() => setShowForm(false)}
                                                className="btn btn-dark ms-3">Cancel
                                        </button>
                                    </form>
                                </div> : <>
                                    <div className="col-md-8">
                                        <p>Name: {profile.full_name}</p>
                                        <p>Email: {profile.email}</p>
                                    </div>

                                    <div className="col-md-4">
                                        <button type="button" onClick={showDataInForm}
                                                className="btn btn-success btn-sm">
                                            Edit Profile
                                        </button>
                                    </div>
                                </>}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;