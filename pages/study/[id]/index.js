import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";

function index({ propCards = null, propDeck = null }) {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState(null);

  useEffect(() => {
    if (propDeck === null) {
      console.log("tengo que buscar deck");
    }
  }, [deck]);

  useEffect(() => {
    if (propCards === null) {
      console.log("tengo que buscar cards");
    }
  }, [cards]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Estudiando mazo / Liza</title>
      </Head>
      HOLA :D
    </main>
  );
}

export default index;
