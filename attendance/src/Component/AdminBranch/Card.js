/*import React from "react";
import styles from "./Card.module.css";

const Card = ({ title, isAddCard = false, onClick }) => {
  const cardClass = `${styles.card} ${isAddCard ? styles.addCard : ""}`;

  return (
    <div
      className={cardClass}
      onClick={() => {
        if (isAddCard) {
          window.location.href = "/admin-login/card/add-agency";
        } else {
          onClick(title);
        }
      }}
    >
      {isAddCard ? (
        <div className={styles.addIcon}>+</div>
      ) : (
        <h3 className={styles.cardTitle}>{title}</h3>
      )}
    </div>
  );
};

export default Card;
*/
import React from "react";
import styles from "./Card.module.css";
import { FaCheckCircle } from "react-icons/fa";

const Card = ({ title, isAddCard = false, onClick, isDeleteMode, isSelected }) => {
  const cardClass = `${styles.card} ${isAddCard ? styles.addCard : ""} ${isSelected ? styles.cardSelected : ""}`;

  return (
    <div
      className={cardClass}
      onClick={() => {
        if (isAddCard) {
          window.location.href = "/admin-login/card/add-agency";
        } else {
          onClick(title);
        }
      }}
    >
      {isDeleteMode ? (
        <div className={styles.deleteSelectContainer}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {isSelected && <FaCheckCircle className={styles.checkIcon} />}
        </div>
      ) : isAddCard ? (
        <div className={styles.addIcon}>+</div>
      ) : (
        <h3 className={styles.cardTitle}>{title}</h3>
      )}
    </div>
  );
};

export default Card;