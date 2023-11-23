import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { db, storage } from "../firebaseConfig";
import { User } from "../App";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function Create() {
  const user = useContext(User);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const [blogData, setBlogData] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  async function handleSumbit(event) {
    setShowLoader(true);
    event.preventDefault();

    try {
      const storageRef = ref(storage, "Blog Image/" + blogData.picture.name);
      const uploadTask = uploadBytesResumable(storageRef, blogData.picture);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      const coll = collection(db, "blog");

      const data = {
        title: blogData.title,
        content: blogData.content,
        photoURL: downloadURL,
        customId: user.uid,
      };

      await addDoc(coll, data);
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      alert(
        "Error while publishing the blog, make sure that you write title, content and upload blog image. If the error persists try to add different image",
        error.message
      );
      setShowLoader(false);
    }
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setBlogData(function (prev) {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleImage(event) {
    const file = event.target.files[0];
    setBlogData(function (prev) {
      return {
        ...prev,
        picture: file,
      };
    });
  }

  return (
    <div className="create">
      {showLoader && <Spinner />}
      <div className="create-nav">
        <div className="create-nav-left">
          <img src="https://static-assets.pixelied.com/logos-v2/px-logo-purple.svg" />
          <h3>Weekly</h3>
        </div>
        <div className="create-nav-right">
          <p
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              color: "#6d5bff",
              marginRight: "1rem",
              fontSize: "18px",
            }}
          >
            Home
          </p>
          <button onClick={handleSumbit}>Publish</button>
          <img src={user?.photoURL}></img>
        </div>
      </div>

      <form>
        <input
          onChange={handleChange}
          name="title"
          type="text"
          placeholder="Write title"
        />
        <textarea
          onChange={handleChange}
          name="content"
          cols="30"
          rows="10"
          placeholder="Start writing"
        ></textarea>
        <input
          onChange={handleImage}
          name="images"
          style={{ display: "none" }}
          type="file"
          id="file"
        ></input>
        <label htmlFor="file">
          <img src="https://cdn-icons-png.flaticon.com/512/5053/5053024.png"></img>
          Upload a image
        </label>
      </form>
    </div>
  );
}

export default Create;
