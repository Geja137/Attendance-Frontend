/*import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import styles from "./Card.module.css"; // ✅ Import CSS module styles

const AdminCardView = () => {
  const navigate = useNavigate();

  const handleCardClick = (role) => {
    navigate(`/admin-login/display/${role}`);
  };

  return (
    <div className={styles.cardContainer}> 
      <Card title="Employee" onClick={handleCardClick} />
      <Card title="Canteen Employee" onClick={handleCardClick} />
      <Card title="Sanitary Employee" onClick={handleCardClick} />
      <Card isAddCard /> 
    </div>
  );
};

export default AdminCardView;



import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";  // Bell icon
import Card from "./Card";
import styles from "./Card.module.css";

const AdminCardView = () => {
  const navigate = useNavigate();

  const handleCardClick = (role) => {
    navigate(`/admin-login/display/${role}`);
  };

  return (
    <div className={styles.cardWrapper}>
      
      <div
        className={styles.bellWrapper}
        onClick={() => navigate("/admin-login/card/claim-requests")}
      >
        <FaBell className={styles.bellIcon} />
      </div>

      
      <div className={styles.cardContainer}>
        <Card title="Software Engineer" onClick={() => handleCardClick("Software Engineer")} />
        <Card title="Manager" onClick={() => handleCardClick("Manager")} />
        <Card title="Designer" onClick={() => handleCardClick("Designer")} />

        <Card isAddCard />
      </div>
    </div>
  );
};

export default AdminCardView;
*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTrashAlt } from "react-icons/fa";
import Card from "./Card";
import styles from "./Card.module.css";

const AdminCardView = () => {
  const navigate = useNavigate();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [agenciesToDelete, setAgenciesToDelete] = useState([]);
  const [agencies, setAgencies] = useState([
    "Software Engineer",
    "Manager",
    "Designer",
  ]);

  const handleCardClick = (role) => {
    if (isDeleteMode) {
      setAgenciesToDelete(prev =>
        prev.includes(role) ? prev.filter(item => item !== role) : [...prev, role]
      );
    } else {
      navigate(`/admin-login/display/${role}`);
    }
  };

  const handleDeleteIconClick = () => {
    setIsDeleteMode(!isDeleteMode);
    if (isDeleteMode) {
      setAgenciesToDelete([]);
    }
  };

  const handleActualDeletion = () => {
    // This is the line that prints the names of the deleted agencies to the console.
    console.log("Agencies to be deleted:", agenciesToDelete);
    
    // Filter out the selected agencies from the main agencies list
    const updatedAgencies = agencies.filter(
      (agency) => !agenciesToDelete.includes(agency)
    );
    
    // Update the state to reflect the deletion
    setAgencies(updatedAgencies);
    setAgenciesToDelete([]);
    setIsDeleteMode(false);
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.iconsContainer}>
        <div
          className={styles.bellWrapper}
          onClick={() =>  navigate("/admin-login/card/claim-requests")}
          title="View Claim Requests"
        >
          <FaBell className={styles.bellIcon} />
        </div>
        <div
          className={styles.deleteWrapper}
          onClick={handleDeleteIconClick}
          title="Delete Agency"
        >
          <FaTrashAlt className={`${styles.deleteIcon} ${isDeleteMode ? styles.deleteIconActive : ''}`} />
        </div>
      </div>

      <div className={styles.cardContainer}>
        {agencies.map((agency, index) => (
          <Card
            key={index}
            title={agency}
            onClick={() => handleCardClick(agency)}
            isDeleteMode={isDeleteMode}
            isSelected={agenciesToDelete.includes(agency)}
          />
        ))}

        {!isDeleteMode && <Card isAddCard />}

        {isDeleteMode && (
          <button
            className={styles.confirmDeleteButton}
            onClick={handleActualDeletion}
            disabled={agenciesToDelete.length === 0}
          >
            Confirm Deletion ({agenciesToDelete.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminCardView;
