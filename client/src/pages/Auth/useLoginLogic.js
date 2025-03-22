import { request } from "../../utils/remote/axios";
import { requestMethods } from "../../utils/enums/request.methods";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useLoginLogic = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
      });
    const [errorMessage, setErrorMessage] = useState("");
    
    const navigate = useNavigate();
    
    
    const handleInputChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handlelogin = async () => {
        if (!form.email || !form.password) {
          setErrorMessage("Email and password are required.");
          return;
        }
      
        const response = await request({
          method: requestMethods.POST,
          route: "/login",
          body: form,
          withCredentials: true, 
        });
    
        if (!response.error) {
          localStorage.setItem("user_id", response.user.id); 
          console.log(response);
          navigate("/");
        } else {
          setErrorMessage(response.message || "Login failed. Please check your credentials.");
        }


        return {
            handleInputChange,
            handlelogin,
            errorMessage
        }

    };
    




};
export default useLoginLogic;
