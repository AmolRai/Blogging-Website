import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../App";

function Detail() {
  const user = useContext(User);
  const location = useLocation();
  const data = location.state?.data;
  const navigate = useNavigate();

  return (
    <div className="detail">
      <div className="detail-nav">
        <div className="detail-nav-left ">
          <img src="https://static-assets.pixelied.com/logos-v2/px-logo-purple.svg" />
          <h3>Weekly</h3>
        </div>
        <div className="detail-nav-right">
          <p
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              color: "#6d5bff",
              marginRight: "1rem",
            }}
          >
            Home
          </p>
          <p>{user?.displayName}</p>
          <img
            style={{ borderRadius: "50%" }}
            src={user?.photoURL}
            alt="profile-image"
          />
        </div>
      </div>
      <h4>{user?.metadata?.creationTime}</h4>
      <h1>{data?.title}</h1>
      <img src={data?.photoURL} />
      <p>{data?.content}</p>
    </div>
  );
}

export default Detail;
