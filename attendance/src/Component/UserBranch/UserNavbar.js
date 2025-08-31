// src/Component/UserBranch/UserNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaUserCheck, FaPlusCircle, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; 
import styles from "./UserNavbar.module.css";

const UserNavbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left side links */}
      <div className={styles.navbarLeft}>
        <Link to="/user/dashboard" className={styles.navbarLink}>
          <FaHome className={styles.icon} /> Home
        </Link>
        <Link to="/user/claim-request" className={styles.navbarLink}>
          <FaClipboardList className={styles.icon} /> Claim Request
        </Link>
        <Link to="/user/view-attendance" className={styles.navbarLink}>
          <FaUserCheck className={styles.icon} /> View Attendance
        </Link>
        <Link to="/user/post-attendance" className={styles.navbarLink}>
          <FaPlusCircle className={styles.icon} /> Post Attendance
        </Link>
        
      </div>

      <div className={styles.navbarRight}>
        <Link to="/user-login" className={styles.navbarLink}>
          <FaSignOutAlt className={styles.icon} /> Logout
        </Link>
        <span className={styles.profileName}>John Doe</span>
        
        <FaUserCircle className={styles.profileIcon} />

        
      </div>
    </nav>
  );
};

export default UserNavbar;
