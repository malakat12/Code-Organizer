import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { requestMethods } from "../../utils/enums/request.methods";
import { request } from "../../utils/remote/axios";
import { colors } from "../../utils/enums/colors.enum";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Signup = () => {
  const [form, setForm] = useState({
    full_name:"",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const signup = async () => {
    if (!form.full_name || !form.email || !form.password) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    const response = await request({
      method: requestMethods.POST,
      route: "/guest/signup",
      body: form,
    });

    if (!response.error) {
      console.log(response);
      navigate("/");
    } else {
      setErrorMessage("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <h2 className="auth-title">Sign Up</h2>

       <input
        type="text"
        name="full_name"
        placeholder="John Doe"
        onChange={handleInputChange}
      /><br></br>
      <input
        type="text"
        name="email"
        placeholder="johnDoe@mail.com"
        onChange={handleInputChange}
      /><br></br>
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={handleInputChange}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <Button text="Signup" onClick={signup} textColor={colors.BLACK} color="" />
      <p>Have an account? <a href="/">Login</a></p>
    </div>
    </div>
  );
};

export default Signup;
