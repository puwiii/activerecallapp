import React from "react";
import Head from "next/head";
import styles from "styles/Home.module.scss";

function index() {
  return (
    <div className={styles.main}>
      <Head>
        <title>Inicio / Liza</title>
      </Head>
      <a
        href="http://twitch.tv/hmarto0"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/images/casa_isometrica.png" alt="" srcset="" />
      </a>

      <style jsx>{`
        .${styles.main}>a {
          display: block;
          max-width: 500px;
          width: 90%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 50px 5px rgba(0, 0, 0, 0.1));
        }

        .${styles.main}>a>img {
          width: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}

export default index;
