import axios from 'axios';
import React from 'react'
import {toast} from "react-toastify";


function EnterNewPassword() {

    const SavePassword = async (e) => {
        e.preventDefault();
        var newPassword = document.getElementById("newPassword").value;
        var confirmPassword = document.getElementById("confirmPassword").value;
        if( newPassword === "" || confirmPassword === "") {
            toast.warn("Please fill in all fields.");
            return;
        }else if (newPassword !== confirmPassword) {
            toast.warn("New Password and Confirm Password do not match.");
            return;
        }else{
            var data = await axios.post(`${server_url}/user/savePassword`, {newPassword, confirmPassword});
            
        }
    }

  return (
    <div>
      <h4 className="text-center"> Reset Password </h4>
      <div className="container mt-5">
        <div className="">
            <form>
                <div className="mb-3">
                    <label htmlFor = "newPassword" className="form-label"> New Password</label>
                    <input type = "password" className="form-control" id="newPassword"/> 
                </div>

                <div className="mb-3">
                    <label htmlFor ="confirmPassword" className="form-label"> Confirm New Password</label>
                    <input type="password" className="form-control" id="confirmPassword"/> 
                </div>

                <input type="submit" className="btn btn-success my-3" onClick={SavePassword} value="Submit"/>
            </form>
        </div>
      </div>
    </div>
  )
}

export default EnterNewPassword
