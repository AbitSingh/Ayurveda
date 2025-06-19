import axios from "axios";
import { useForm } from "react-hook-form";
import { server_url, getCookie } from "../../utils/script.jsx";
import { toast } from "react-toastify";

function ChangePassword() {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    async function onSubmit(data) {
        const { currentPassword, newPassword, confirmPassword } = data;

        // Check for empty fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warn("Please fill in all fields.");
            return;
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            toast.warn("New Password and Confirm Password do not match.");
            return;
        }

        const token = getCookie('userToken');
        const url = `${server_url}/user/changePassword`;

        try {
            const response = await axios.put(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { error, message } = response.data;

            if (error) {
                toast.error(message);
            } else {
                reset();
                toast.success(message);
            }

        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1>Change Password</h1>
                    <hr />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label>Current Password</label>
                            <input type="password" {...register('currentPassword')} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label>New Password</label>
                            <input type="password" {...register('newPassword')} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input type="password" {...register('confirmPassword')} className="form-control" />
                        </div>

                        <button className="btn btn-success" type="submit">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
