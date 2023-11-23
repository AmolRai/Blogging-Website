import React, { createContext, useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Create from "./components/Create";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Detail from "./components/Detail";

export const User = createContext();

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, function (currentUser) {
      setUser(currentUser);
    });
  });

  return (
    <User.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </User.Provider>
  );
}

export default App;
