import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AttendancePage.module.css"; // ✅ use CSS Module

const AttendancePage = () => {
  const navigate = useNavigate();
  const employee = { id: 101, name: "John Doe" };

  // Use today's date as key for storage
  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    localStorage.removeItem(`attendance_${todayKey}`);
  }, [todayKey]);

  // Fetch attendance from localStorage (simulate DB)
  const todayData =
    JSON.parse(localStorage.getItem(`attendance_${todayKey}`)) || {};

  const [checkinTime, setCheckinTime] = useState(todayData.checkinTime || "");
  const [checkoutTime, setCheckoutTime] = useState(
    todayData.checkoutTime || ""
  );

  const getButtonLabel = () => {
    if (!checkinTime) return "Checkin";
    if (checkinTime && !checkoutTime) return "Checkout";
    return "Checked Out";
  };

  const [buttonLabel, setButtonLabel] = useState(getButtonLabel());

  const formatTime = (date) => new Date(date).toLocaleString();

  // ✅ Function to calculate total working hours
  const calculateWorkingHours = () => {
    if (!checkinTime || !checkoutTime) return "-";

    const checkin = new Date(checkinTime);
    const checkout = new Date(checkoutTime);

    let diffMs = checkout - checkin;
    if (diffMs <= 0) return "-";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const handleClick = () => {
    const currentTime = new Date().toISOString();

    if (buttonLabel === "Checkin") {
      setCheckinTime(currentTime);
      localStorage.setItem(
        `attendance_${todayKey}`,
        JSON.stringify({ checkinTime: currentTime })
      );
      setButtonLabel("Checkout");
      alert("✅ Check-in successful! Redirecting to login page in 5 seconds...");
      setTimeout(() => navigate("/user-login"), 5000);
    } else if (buttonLabel === "Checkout") {
      const confirmCheckout = window.confirm(
        "Are you sure you want to checkout? Please confirm to complete your attendance."
      );
      if (!confirmCheckout) return;

      setCheckoutTime(currentTime);
      localStorage.setItem(
        `attendance_${todayKey}`,
        JSON.stringify({ checkinTime, checkoutTime: currentTime })
      );
      setButtonLabel("Checked Out");
      alert("✅ Checkout successful! Redirecting to login page in 5 seconds...");
      setTimeout(() => navigate("/user-login"), 5000);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Employee Attendance</h2>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th className={styles.th}>Employee ID</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Check-in Time</th>
              <th className={styles.th}>Checkout Time</th>
              <th className={styles.th}>Total Hours</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.trHover}>
              <td className={styles.td}>{employee.id}</td>
              <td className={styles.td}>{employee.name}</td>
              <td className={styles.td}>
                {checkinTime ? formatTime(checkinTime) : "-"}
              </td>
              <td className={styles.td}>
                {checkoutTime ? formatTime(checkoutTime) : "-"}
              </td>
              <td className={`${styles.td} ${styles.workingHours}`}>
                {calculateWorkingHours()}
              </td>
              <td className={styles.td}>
                {buttonLabel !== "Checked Out" ? (
                  <button
                    className={styles.btnPrimary}
                    onClick={handleClick}
                  >
                    {buttonLabel}
                  </button>
                ) : (
                  <span className={styles.textSuccess}>Checked Out</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;