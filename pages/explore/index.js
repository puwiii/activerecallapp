import React from "react";
import Head from "next/head";
import styles from "styles/Home.module.scss";

function index() {
  return (
    <div className={styles.main}>
      <Head>
        <title>Explorar / Liza</title>
      </Head>
    </div>
  );
}

export default index;
