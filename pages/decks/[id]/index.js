import React, { useEffect, useState } from "react";
import styles from "styles/Home.module.scss";
import CreateDeckWindow from "components/CreateDeckWindow";
import { auth, onAuthStateChanged } from "firebase/client";
import { useRouter } from "next/router";
import { useModal } from "components/hooks/useModal";

function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [decks, setDecks] = useState([]);

  const router = useRouter();

  return <div className={styles.main}></div>;
}

export default index;
