/*import React, { useState, useEffect } from "react";
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

export default AttendancePage;*/
import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import styles from "./AttendancePage.module.css"; // CSS module

const AttendancePage = () => {
  //const navigate = useNavigate();
  const employee = { id: 101, name: "John Doe" };

  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `attendance_${todayKey}`;

  const [logs, setLogs] = useState([]);
  const [currentCheckin, setCurrentCheckin] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(true); // true => allow checkin

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.logs) {
      setLogs(saved.logs);
      const lastLog = saved.logs[saved.logs.length - 1];
      if (lastLog && !lastLog.checkout) {
        setCurrentCheckin(lastLog.checkin);
        setIsCheckingIn(false); // waiting for checkout
      }
    }
  }, [storageKey]);

  const saveLogs = (updatedLogs) => {
    setLogs(updatedLogs);
    localStorage.setItem(storageKey, JSON.stringify({ logs: updatedLogs }));
  };

  const formatTime = (dateStr) => new Date(dateStr).toLocaleString();
  // Format only date as DD-MM-YYYY
const formatDateOnly = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB"); // e.g., 05/09/2025
};

// Format only time as HH:MM AM/PM
const formatTimeOnly = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const calculateDuration = (checkin, checkout) => {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffMs = end - start;
    if (diffMs <= 0) return "-";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCheckin = () => {
    const now = new Date().toISOString();
    const newLogs = [...logs, { checkin: now }];
    saveLogs(newLogs);
    setCurrentCheckin(now);
    setIsCheckingIn(false);
  };

  const handleCheckout = () => {
    const now = new Date().toISOString();
    const newLogs = logs.map((log, index) => {
      if (index === logs.length - 1 && !log.checkout) {
        return { ...log, checkout: now };
      }
      return log;
    });
    saveLogs(newLogs);
    setCurrentCheckin("");
    setIsCheckingIn(true);
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
              <th className={styles.th}>Current Check-in</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.trHover}>
              <td className={styles.td}>{employee.id}</td>
              <td className={styles.td}>{employee.name}</td>
              <td className={styles.td}>
                {currentCheckin ? formatTime(currentCheckin) : "-"}
              </td>
              <td className={styles.td}>
                <button
                  className={styles.btnPrimary}
                  onClick={handleCheckin}
                  disabled={!isCheckingIn}
                >
                  Checkin
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleCheckout}
                  disabled={isCheckingIn}
                  style={{ marginLeft: "10px" }}
                >
                  Checkout
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {logs.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3 className={styles.heading}>Attendance History for Today</h3>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.theadRow}>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Check-in</th>
                  <th className={styles.th}>Checkout</th>
                  <th className={styles.th}>Duration</th>
                  
                </tr>
              </thead>
              <tbody>
  {logs.map((log, index) => (
    <tr className={styles.trHover} key={index}>
      <td className={styles.td}>{index + 1}</td>
      <td className={styles.td}>
        {log.checkin ? formatDateOnly(log.checkin) : "-"}
      </td>
      <td className={styles.td}>
        {log.checkin ? formatTimeOnly(log.checkin) : "-"}
      </td>
      <td className={styles.td}>
        {log.checkout ? formatTimeOnly(log.checkout) : "-"}
      </td>
      <td className={styles.td}>
        {log.checkout ? calculateDuration(log.checkin, log.checkout) : "-"}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
