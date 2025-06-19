import {useForm} from "react-hook-form";
import axios from "axios";
import {server_url} from "../utils/script.jsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

function UserLogin() {

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm();

    const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            const url = `${server_url}/user-login`;
            let response = await axios.post(url, data);
            // console.log(response.data)

            const {error, message, token} = response.data;

            if (error) {
                toast.error(message);
            } else {
                reset();
                toast.success(message);

                let duration = 86400; // 86400 seconds = 1 day
                document.cookie = `userToken=${token}; path=/; max-age=${duration}`;

                setTimeout(() => {
                    navigate('/user/home')
                }, 2000);
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="container">
            <h2>User Sign-in</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="">Email</label>
                    <input type="email" {...register('email', {required: 'This field is required.'})}
                           className="form-control"/>
                    {errors?.email && <span className="text-danger">{errors?.email?.message}</span>}
                </div>

                <div className="mb-3">
                    <label htmlFor="">Password</label>
                    <input type="password" {...register('password', {required: 'This field is required.'})}
                           className="form-control"/>
                    {errors?.password && <span className="text-danger">{errors?.password?.message}</span>}
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default UserLogin;