import React, { useEffect, useState } from "react";
import Header from "components/Header";
import Head from "next/head";
import Nav from "components/Nav";
import styles from "styles/Home.module.scss";
import CreateDeckWindow from "components/CreateDeckWindow";
import { auth, onAuthStateChanged, listenForUserDecks } from "firebase/client";
import { useRouter } from "next/router";
import { useModal } from "components/hooks/useModal";
import { useStateValue } from "components/contexts/StateProvider";
import useUser, { USER_STATES } from "components/hooks/useUser";
import Decks from "components/Decks";

function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [decks, setDecks] = useState([]);

  let user = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }

    if (user) {
      listenForUserDecks(setDecks);
    }
  }, [user]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Mis mazos - Liza</title>
      </Head>

      {/* {user === USER_STATES.NOT_KNOWN && //debiera ir spinner
                
                
                } */}
      <section>
        <CreateDeckWindow
          isOpen={isOpenCreateDeck}
          closeWindow={closeCreateDeck}
        />

        <div className="decks">
          <h2>Mazos</h2>
          {decks.map((deck) => (
            <h1>{deck.name}</h1>
          ))}
          <button
            className={styles.roundedButtonSecondary}
            onClick={openCreateDeck}
          >
            Crear un nuevo mazo
          </button>
        </div>

        <div className="cards">
          <h2>Tarjetas</h2>
        </div>
      </section>

      <style jsx>{`
        h2 {
          padding: 20px;
          opacity: 0.5;
          font-weight: 600;
          font-size: 14px;
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }
      `}</style>
    </main>
  );
}

export default index;
