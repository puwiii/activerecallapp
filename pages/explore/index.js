import React from "react";
import styles from "styles/Home.module.scss";

function index() {
  return (
    <div className={styles.main}>
      <img src="/images/casa_isometrica.png" alt="" srcset="" />

      <style jsx>{`
        .${styles.main} > img {
          object-fit: contain;
          width: 50%;
          height: 50%;
          padding: 2em;

      `}</style>
    </div>
  );
}

export default index;
