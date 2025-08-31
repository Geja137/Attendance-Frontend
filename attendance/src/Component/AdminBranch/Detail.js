/*import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { dummyData } from "./data";
import styles from "./Detail.module.css";

const calculateWorkHours = (timeIn, timeOut) => {
  if (timeIn === "-" || timeOut === "-" || timeIn === "--" || timeOut === "--")
    return "-";

  const [inHour, inMin] = timeIn.split(":").map(Number);
  const [outHour, outMin] = timeOut.split(":").map(Number);

  const inDate = new Date(0, 0, 0, inHour, inMin);
  const outDate = new Date(0, 0, 0, outHour, outMin);

  let diff = (outDate - inDate) / (1000 * 60 * 60);
  if (diff < 0) diff += 24;

  return diff.toFixed(2);
};

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [records, setRecords] = useState(dummyData);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const employee =
    location.state?.employee || records.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return (
      <div className={styles.error}>
        <p>No employee data found. Please go back and try again.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Filter records for the employee
  const allAttendanceRecords = records
    .filter((item) => item.id === employee.id && item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination
  const recordsPerPage = 10;
  const totalPages = Math.ceil(allAttendanceRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = allAttendanceRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // when user picks a date
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateOk = () => {
    if (!selectedDate) return alert("Please choose a date first.");
    const record = allAttendanceRecords.find((r) => r.date === selectedDate);
    if (record) {
      setSelectedRecord({ ...record });
      setShowModal(true);
    } else {
      alert("No record found for this date!");
    }
  };

  // toggle Present/Absent
  const toggleStatus = () => {
    setSelectedRecord((prev) => {
      const newStatus = prev.status === "Present" ? "Absent" : "Present";
      return {
        ...prev,
        status: newStatus,
        timeIn: "--",
        timeOut: "--",
      };
    });
  };

  // update data
  const handleDone = () => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === employee.id && rec.date === selectedRecord.date
          ? {
              ...rec,
              status: selectedRecord.status,
              timeIn: selectedRecord.timeIn,
              timeOut: selectedRecord.timeOut,
            }
          : rec
      )
    );
    setShowModal(false);
    setSelectedDate("");
  };

  // pagination change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftPanel}>
        <h2>Employee Details</h2>
        <p>
          <strong>ID:</strong> {employee.id}
        </p>
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Agency:</strong> {employee.agency || employee.role}
        </p>
        <p>
          <strong>Position:</strong> {employee.position}
        </p>
      </div>

      <div className={styles.rightPanel}>
        
        <div className={styles.filterBox}>
          <label>Filter by Date: </label>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <button onClick={handleDateOk}>OK</button>
        </div>

        <h3>Attendance Records (Month)</h3>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
            {currentRecords.map((record, idx) => (
              <tr
                key={idx}
                className={record.status === "Absent" ? styles.absentRow : ""}
              >
                <td>{record.date}</td>
                <td>{record.status}</td>
                <td>{record.timeIn}</td>
                <td>{record.timeOut}</td>
                <td>{calculateWorkHours(record.timeIn, record.timeOut)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? styles.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        )}
      </div>

      
      {showModal && selectedRecord && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Attendance Details</h3>
            <p>
              <strong>Date:</strong> {selectedRecord.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedRecord.status}
            </p>
            <p>
              <strong>Time In:</strong> {selectedRecord.timeIn}
            </p>
            <p>
              <strong>Time Out:</strong> {selectedRecord.timeOut}
            </p>
            <p>
              <strong>Work Hours:</strong>{" "}
              {calculateWorkHours(
                selectedRecord.timeIn,
                selectedRecord.timeOut
              )}
            </p>

            <button onClick={toggleStatus} className={styles.toggleBtn}>
              Toggle to{" "}
              {selectedRecord.status === "Present" ? "Absent" : "Present"}
            </button>

            <div className={styles.modalActions}>
              <button onClick={handleDone} className={styles.doneBtn}>
                Done
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;


import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { dummyData } from "./data";
import styles from "./Detail.module.css";

// calculate total hours
const calculateWorkHours = (timeIn, timeOut) => {
  if (timeIn === "-" || timeOut === "-" || timeIn === "--" || timeOut === "--")
    return 0;

  const [inHour, inMin] = timeIn.split(":").map(Number);
  const [outHour, outMin] = timeOut.split(":").map(Number);

  const inDate = new Date(0, 0, 0, inHour, inMin);
  const outDate = new Date(0, 0, 0, outHour, outMin);

  let diff = (outDate - inDate) / (1000 * 60 * 60);
  if (diff < 0) diff += 24;

  return diff;
};

// compute FN & AN session status
const getSessionStatus = (status, timeIn, timeOut) => {
  if (status === "Absent") {
    return { fn: "Absent", an: "Absent" };
  }

  // Handle the case where we want "--" for Present but no time data
  if (timeIn === "--" && timeOut === "--" && status === "Present") {
    return { fn: "--", an: "--" };
  }

  const totalHours = calculateWorkHours(timeIn, timeOut);
  if (status === "Present" && totalHours >= 8) {
    return { fn: "Present", an: "Present" };
  }

  if (
    timeIn === "-" ||
    timeOut === "-" ||
    timeIn === "--" ||
    timeOut === "--"
  ) {
    return { fn: "Absent", an: "Absent" };
  }

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const inMin = toMinutes(timeIn);
  const outMin = toMinutes(timeOut);

  const fnStart = 9 * 60;
  const fnEnd = 13 * 60;
  const anStart = 13 * 60;
  const anEnd = 17 * 60;

  const overlap = (start1, end1, start2, end2) =>
    Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));

  const fnMinutes = overlap(inMin, outMin, fnStart, fnEnd);
  const anMinutes = overlap(inMin, outMin, anStart, anEnd);

  let fnStatus = "Absent";
  let anStatus = "Absent";

  if (fnMinutes > 0 || anMinutes > 0) {
    if (fnMinutes >= anMinutes) fnStatus = "Present";
    else anStatus = "Present";
  }

  return { fn: fnStatus, an: anStatus };
};

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [records, setRecords] = useState(dummyData);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const employee =
    location.state?.employee || records.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return (
      <div className={styles.error}>
        <p>No employee data found. Please go back and try again.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  let allAttendanceRecords = records
    .filter((item) => item.id === employee.id && item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (selectedMonth || selectedYear) {
    allAttendanceRecords = allAttendanceRecords.filter((rec) => {
      const [year, month] = rec.date.split("-").map(Number);
      const matchesMonth = selectedMonth
        ? month === parseInt(selectedMonth)
        : true;
      const matchesYear = selectedYear ? year === parseInt(selectedYear) : true;
      return matchesMonth && matchesYear;
    });
  }

  const recordsPerPage = 10;
  const totalPages = Math.ceil(allAttendanceRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = allAttendanceRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleDateOk = () => {
    if (!selectedDate) return alert("Please choose a date first.");
    const record = allAttendanceRecords.find((r) => r.date === selectedDate);
    if (record) {
      setSelectedRecord({ ...record });
      setShowModal(true);
    } else {
      alert("No record found for this date!");
    }
  };

  // ✅ Fixed toggle function
  const toggleStatus = () => {
    setSelectedRecord((prev) => {
      if (prev.status === "Absent") {
        // Set to Present with "--" values
        return {
          ...prev,
          status: "Present",
          timeIn: "--",
          timeOut: "--",
          fn: "--",
          an: "--",
        };
      } else {
        // Set to Absent with "--" values
        return {
          ...prev,
          status: "Absent",
          timeIn: "--",
          timeOut: "--",
          fn: "--",
          an: "--",
        };
      }
    });
  };

  const handleDone = () => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === employee.id && rec.date === selectedRecord.date
          ? {
              ...rec,
              status: selectedRecord.status,
              timeIn: selectedRecord.timeIn,
              timeOut: selectedRecord.timeOut,
              fn: selectedRecord.fn,
              an: selectedRecord.an,
            }
          : rec
      )
    );
    setShowModal(false);
    setSelectedDate("");
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftPanel}>
        <h2>Employee Details</h2>
        <p>
          <strong>ID:</strong> {employee.id}
        </p>
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Agency:</strong> {employee.agency || employee.role}
        </p>
        <p>
          <strong>Position:</strong> {employee.position}
        </p>
      </div>

      <div className={styles.rightPanel}>
        
        <div className={styles.filterBox}>
          <label>Filter by Date: </label>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <button onClick={handleDateOk}>OK</button>
        </div>

        <div className={styles.filterBox}>
          <label>Filter by Month & Year: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}

            onChange={(e) => setSelectedYear(e.target.value)}
          >
            
            <option value="">All Years</option>
            
            {[...new Set(records.map((r) => r.date.split("-")[0]))].map(
              (yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              )
            )}
          </select>

          <button onClick={handleClearFilters}>Clear</button>
        </div>

        
        <h3>Attendance Records</h3>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Work Hours</th>
              <th>FN Session</th>
              <th>AN Session</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
            {currentRecords.map((record, idx) => {
              const hours = calculateWorkHours(record.timeIn, record.timeOut);
              // Use stored fn/an values if available, otherwise calculate
              const session = {
                fn: record.fn !== undefined ? record.fn : getSessionStatus(record.status, record.timeIn, record.timeOut).fn,
                an: record.an !== undefined ? record.an : getSessionStatus(record.status, record.timeIn, record.timeOut).an,
              };

              return (
                <tr
                  key={idx}
                  className={record.status === "Absent" ? styles.absentRow : ""}
                >
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                  <td>{record.timeIn}</td>
                  <td>{record.timeOut}</td>
                  <td>{hours.toFixed(2)}</td>
                  <td>{session.fn}</td>
                  <td>{session.an}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Prev
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? styles.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        )}
      </div>

      
      {showModal && selectedRecord && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Attendance Details</h3>
            <p>
              <strong>Date:</strong> {selectedRecord.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedRecord.status}
            </p>
            <p>
              <strong>Time In:</strong> {selectedRecord.timeIn}
            </p>
            <p>
              <strong>Time Out:</strong> {selectedRecord.timeOut}
            </p>
            <p>
              <strong>Work Hours:</strong>{" "}
              {calculateWorkHours(
                selectedRecord.timeIn,
                selectedRecord.timeOut
              ).toFixed(2)}
            </p>
            <button onClick={toggleStatus} className={styles.toggleBtn}>
              Toggle to{" "}
              {selectedRecord.status === "Present" ? "Absent" : "Present"}
            </button>
            <div className={styles.modalActions}>
              <button onClick={handleDone} className={styles.doneBtn}>
                Done
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
*/
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { dummyData } from "./data";
import styles from "./Detail.module.css";

// calculate total hours
const calculateWorkHours = (timeIn, timeOut) => {
  if (timeIn === "-" || timeOut === "-" || timeIn === "--" || timeOut === "--")
    return 0;

  const [inHour, inMin] = timeIn.split(":").map(Number);
  const [outHour, outMin] = timeOut.split(":").map(Number);

  const inDate = new Date(0, 0, 0, inHour, inMin);
  const outDate = new Date(0, 0, 0, outHour, outMin);

  let diff = (outDate - inDate) / (1000 * 60 * 60);
  if (diff < 0) diff += 24;

  return diff;
};

// compute FN & AN session status
const getSessionStatus = (status, timeIn, timeOut) => {
  if (status === "Absent") {
    return { fn: "Absent", an: "Absent" };
  }

  // Handle the case where we want "--" for Present but no time data
  if (timeIn === "--" && timeOut === "--" && status === "Present") {
    return { fn: "--", an: "--" };
  }

  const totalHours = calculateWorkHours(timeIn, timeOut);
  
  // If person works more than 5 hours, mark both sessions as Present
  if (status === "Present" && totalHours > 5) {
    return { fn: "Present", an: "Present" };
  }

  if (
    timeIn === "-" ||
    timeOut === "-" ||
    timeIn === "--" ||
    timeOut === "--"
  ) {
    return { fn: "Absent", an: "Absent" };
  }

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const inMin = toMinutes(timeIn);
  const outMin = toMinutes(timeOut);

  const fnStart = 9 * 60;    // 9:00 AM
  const fnEnd = 13 * 60;     // 1:00 PM
  const anStart = 13 * 60;   // 1:00 PM
  const anEnd = 17 * 60;     // 5:00 PM

  const overlap = (start1, end1, start2, end2) =>
    Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));

  const fnMinutes = overlap(inMin, outMin, fnStart, fnEnd);
  const anMinutes = overlap(inMin, outMin, anStart, anEnd);

  let fnStatus = "Absent";
  let anStatus = "Absent";

  // If person works exactly 4 hours in morning, mark FN as Present
  if (fnMinutes >= 240) { // 4 hours = 240 minutes
    fnStatus = "Present";
  }
  
  // If person works exactly 4 hours in afternoon, mark AN as Present
  if (anMinutes >= 240) { // 4 hours = 240 minutes
    anStatus = "Present";
  }
  
  // If neither session has exactly 4 hours, check which session has more time
  if (fnStatus === "Absent" && anStatus === "Absent") {
    if (fnMinutes > anMinutes && fnMinutes > 0) {
      fnStatus = "Present";
    } else if (anMinutes > fnMinutes && anMinutes > 0) {
      anStatus = "Present";
    }
  }

  return { fn: fnStatus, an: anStatus };
};

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [records, setRecords] = useState(dummyData);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const employee =
    location.state?.employee || records.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return (
      <div className={styles.error}>
        <p>No employee data found. Please go back and try again.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  let allAttendanceRecords = records
    .filter((item) => item.id === employee.id && item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (selectedMonth || selectedYear) {
    allAttendanceRecords = allAttendanceRecords.filter((rec) => {
      const [year, month] = rec.date.split("-").map(Number);
      const matchesMonth = selectedMonth
        ? month === parseInt(selectedMonth)
        : true;
      const matchesYear = selectedYear ? year === parseInt(selectedYear) : true;
      return matchesMonth && matchesYear;
    });
  }

  const recordsPerPage = 10;
  const totalPages = Math.ceil(allAttendanceRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = allAttendanceRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleDateOk = () => {
    if (!selectedDate) return alert("Please choose a date first.");
    const record = allAttendanceRecords.find((r) => r.date === selectedDate);
    if (record) {
      setSelectedRecord({ ...record });
      setShowModal(true);
    } else {
      alert("No record found for this date!");
    }
  };

  // ✅ Fixed toggle function
  const toggleStatus = () => {
    setSelectedRecord((prev) => {
      if (prev.status === "Absent") {
        // Set to Present with "--" values
        return {
          ...prev,
          status: "Present",
          timeIn: "--",
          timeOut: "--",
          fn: "--",
          an: "--",
        };
      } else {
        // Set to Absent with "--" values
        return {
          ...prev,
          status: "Absent",
          timeIn: "--",
          timeOut: "--",
          fn: "--",
          an: "--",
        };
      }
    });
  };

  const handleDone = () => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === employee.id && rec.date === selectedRecord.date
          ? {
              ...rec,
              status: selectedRecord.status,
              timeIn: selectedRecord.timeIn,
              timeOut: selectedRecord.timeOut,
              fn: selectedRecord.fn,
              an: selectedRecord.an,
            }
          : rec
      )
    );
    setShowModal(false);
    setSelectedDate("");
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftPanel}>
        <h2>Employee Details</h2>
        <p>
          <strong>ID:</strong> {employee.id}
        </p>
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Agency:</strong> {employee.agency || employee.role}
        </p>
        <p>
          <strong>Position:</strong> {employee.position}
        </p>
      </div>

      <div className={styles.rightPanel}>
        {/* Filters */}
        <div className={styles.filterBox}>
          <label>Filter by Date: </label>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <button onClick={handleDateOk}>OK</button>
        </div>

        <div className={styles.filterBox}>
          <label>Filter by Month & Year: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {[...new Set(records.map((r) => r.date.split("-")[0]))].map(
              (yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              )
            )}
          </select>

          <button onClick={handleClearFilters}>Clear</button>
        </div>

        {/* Attendance Table */}
        <h3>Attendance Records</h3>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Work Hours</th>
              <th>FN Session</th>
              <th>AN Session</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
            {currentRecords.map((record, idx) => {
              const hours = calculateWorkHours(record.timeIn, record.timeOut);
              // Use stored fn/an values if available, otherwise calculate
              const session = {
                fn: record.fn !== undefined ? record.fn : getSessionStatus(record.status, record.timeIn, record.timeOut).fn,
                an: record.an !== undefined ? record.an : getSessionStatus(record.status, record.timeIn, record.timeOut).an,
              };

              return (
                <tr
                  key={idx}
                  className={record.status === "Absent" ? styles.absentRow : ""}
                >
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                  <td>{record.timeIn}</td>
                  <td>{record.timeOut}</td>
                  <td>{hours.toFixed(2)}</td>
                  <td>{session.fn}</td>
                  <td>{session.an}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Prev
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? styles.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRecord && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Attendance Details</h3>
            <p>
              <strong>Date:</strong> {selectedRecord.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedRecord.status}
            </p>
            <p>
              <strong>Time In:</strong> {selectedRecord.timeIn}
            </p>
            <p>
              <strong>Time Out:</strong> {selectedRecord.timeOut}
            </p>
            <p>
              <strong>Work Hours:</strong>{" "}
              {calculateWorkHours(
                selectedRecord.timeIn,
                selectedRecord.timeOut
              ).toFixed(2)}
            </p>
            <button onClick={toggleStatus} className={styles.toggleBtn}>
              Toggle to{" "}
              {selectedRecord.status === "Present" ? "Absent" : "Present"}
            </button>
            <div className={styles.modalActions}>
              <button onClick={handleDone} className={styles.doneBtn}>
                Done
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;