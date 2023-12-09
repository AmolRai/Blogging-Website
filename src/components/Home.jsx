import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { User } from "../App";
import { NavLink, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Spinner from "./Spinner";

function Home() {
  const user = useContext(User);
  const navigate = useNavigate();
  const [blogArray, setBlogArray] = useState([]);
  const [userText, setUserText] = useState("");
  const [searchArray, setSearchArray] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  async function getBlog() {
    setShowLoader(true);
    const coll = collection(db, "blog");
    const blogDoc = await getDocs(coll);
    setBlogArray(
      blogDoc.docs.map(function (item) {
        return { ...item.data(), id: item.id };
      })
    );
    setSearchArray(
      blogDoc.docs.map(function (item) {
        return { ...item.data(), id: item.id };
      })
    );
    setShowLoader(false);
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        console.log("success signed out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async function handleDelete(id) {
    const docDelete = doc(db, "blog", id);
    try {
      await deleteDoc(docDelete);
      getBlog();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleEdit(id) {
    navigate("/create");
  }

  function strTruncate(str) {
    return str.substr(0, 100) + "...";
  }

  async function handleSearch() {
    const filteredBlog = blogArray.filter((blog) => {
      return blog.title.toLowerCase().includes(userText.toLowerCase());
    });
    setSearchArray(filteredBlog);
  }

  useEffect(() => {
    getBlog();
  }, []);

  function handleKey(event) {
    if (event.code == "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="home">
      {showLoader && <Spinner />}
      <div className="nav">
        <div className="left">
          <img src="https://static-assets.pixelied.com/logos-v2/px-logo-purple.svg" />
          <h3>Weekly</h3>
        </div>
        <div className="right">
          <button onClick={handleSignOut}>Sign out</button>
          <img src={user.photoURL}></img>
        </div>
      </div>

      <div className="middle-container">
        <div className="middle-top">
          <h1>Write Blog</h1>
          <p>
            awesome place to write blogs about technology, life and entertained
            through daily updates
          </p>
          <input
            onKeyDown={handleKey}
            onChange={function (event) {
              if (event.target.value === "") {
                setSearchArray(blogArray);
              }
              setUserText(event.target.value);
            }}
            placeholder="Search"
          ></input>
        </div>

        <div className="middle-bottom">
          {searchArray.length === 0 && !showLoader && <h1>Not Found</h1>}
          {searchArray.map(function (obj) {
            return (
              <div className="blog-card" key={obj.id}>
                <NavLink
                  className="nav-link"
                  to="/detail"
                  state={{ data: obj }}
                >
                  <img src={obj.photoURL} />
                </NavLink>
                <div className="home-elements-style">
                  <div>
                    <h2>{obj.title}</h2>
                    <p>{strTruncate(obj.content)}</p>
                  </div>
                  <div className="button-group">
                    <NavLink
                      className="edit-nav-link"
                      to="create"
                      state={{ data: obj }}
                    >
                      {/* {user.uid === obj.customId && (
                        <button
                          className="btn-1"
                          onClick={() => handleEdit(obj.id)}
                          style={{ marginLeft: "1rem" }}
                        ></button>
                      )} */}
                    </NavLink>
                    {user.uid === obj.customId && (
                      <button
                        className="btn-2"
                        onClick={() => handleDelete(obj.id)}
                      ></button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          navigate("/create");
        }}
        className="add-btn"
      >
        +
      </button>
    </div>
  );
}

export default Home;
