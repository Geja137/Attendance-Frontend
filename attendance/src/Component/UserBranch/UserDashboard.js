

import React from "react";
import styles from "./UserDashboard.module.css";
import { FaUserCircle } from "react-icons/fa"; // Employee Icon

const UserDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Employee Dashboard</h1>
      </header>

      {/* Employee Info Card */}
      <div className={styles.userCard}>
        <FaUserCircle className={styles.userIcon} />
        <h2>John Doe</h2>
        <p><strong>Employee ID:</strong> U12345</p>
        <p><strong>Agency:</strong> Catering Agency</p>
        <p><strong>Role:</strong> Supervisor</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
      </div>
    </div>
  );
};

export default UserDashboard;