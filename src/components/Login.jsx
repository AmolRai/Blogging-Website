import React, { useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, NavLink } from "react-router-dom";
import "../css/index.css";
import Spinner from "./Spinner";

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);

  async function handleSubmit(event, val) {
    setShowLoader(true);
    event.preventDefault();

    let email, password;
    if (!val) {
      email = emailRef.current.value;
      password = passwordRef.current.value;
    } else {
      email = "test@gmail.com";
      password = "123456789";
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      setShowLoader(false);
      alert(error.message);
    }
  }

  return (
    <div className="login">
      {showLoader && <Spinner />}
      <div className="login-container">
        <div className="logo">
          <h3>Write Blog</h3>
          <p>Login</p>
        </div>
        <form className="login-form">
          <input ref={emailRef} placeholder="email" type="email"></input>
          <input
            ref={passwordRef}
            placeholder="password"
            type="password"
          ></input>
          <button onClick={(e) => handleSubmit(e, 0)}>Sign in</button>
          <button onClick={(e) => handleSubmit(e, 1)}>Test Sign in</button>
          <p className="account">
            Don't have an account?
            <NavLink to="/register">Register</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
