// src/Component/UserBranch/UserLayout.js
import React from "react";
import { Outlet } from "react-router-dom";  // Import Outlet from react-router-dom
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  return (
    <div>
      <UserNavbar />
      <div style={{ padding: "20px" }}>
        <Outlet /> {/* ✅ This will render the nested routes like Dashboard, Claim Request, etc. */}
      </div>
    </div>
  );
};

export default UserLayout;
