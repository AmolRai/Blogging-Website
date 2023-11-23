import React, { useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, NavLink } from "react-router-dom";
import Spinner from "./Spinner";
import "../css/index.css";

function Register() {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  async function signUp(event) {
    setShowLoader(true);
    event.preventDefault();

    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const file = event.target[3].files[0];

    try {
      const register = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, "Profile Image/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      const usersColl = doc(db, "users", register.user.uid);

      const obj = {
        displayName: name,
        email: email,
        photoURL: downloadURL,
      };
      await setDoc(usersColl, obj);
      await updateProfile(register.user, obj);
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      alert(error.message);
      setShowLoader(false);
    }
  }

  return (
    <div className="register">
      {showLoader && <Spinner />}
      <div className="container">
        <div className="logo">
          <h3>Write Blog</h3>
          <p>Register</p>
        </div>
        <form className="form" onSubmit={signUp}>
          <input type="text" placeholder="name"></input>
          <input type="email" placeholder="email"></input>
          <input type="password" placeholder="password"></input>
          <input style={{ display: "none" }} type="file" id="file"></input>
          <label htmlFor="file">
            <img src="https://cdn-icons-png.flaticon.com/512/5053/5053024.png"></img>
            Add an avatar
          </label>
          <button type="submit">Sign up</button>
          <p className="account">
            You do have an account?
            <NavLink to="/login">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
