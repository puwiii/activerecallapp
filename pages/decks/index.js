import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//firebase
import { listenForDecksV2 } from "firebase/client";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//icons
import NewFolderIcon from "icons/NewFolderIcon";

//components
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import DeckContainer from "components/DeckContainer";
import ScreenLoadingComponent from "components/ScreenLoadingComponent";

//hooks
import { useModal } from "hooks/useModal";
import useUser, { USER_STATES } from "hooks/useUser";
import EmptySvg from "svgs/EmptySvg";

function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState();

  let user = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }

    if (user) {
      if (!user.emailVerified) {
        router.replace("/signin/emailverification");
      } else {
        listenForDecksV2(null, setDecks);
      }
    }
  }, [user]);

  useEffect(() => {
    if (decks) {
      if (decks === "Quota exceeded.") {
        alert("Se ha alcanzado el uso diario, intente mas tarde");
        setDecks([]);
      }
      setLoading(false);
    }
  }, [decks]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Mis Mazos - Liza</title>
      </Head>

      {/* <h1 className={styles.title}>Mis Mazos</h1> */}

      <section>
        {isOpenCreateDeck === true && (
          <CreateDeckWindow
            isOpen={isOpenCreateDeck}
            closeWindow={closeCreateDeck}
          />
        )}

        <div className={`decks`}>
          <h2>Mazos</h2>
          {loading ? (
            <ScreenLoadingComponent />
          ) : (
            <>
              {decks.length > 0 ? (
                <div className={decksStyles.decks}>
                  {decks.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      deckId={deck.id}
                      name={deck.name}
                      description={deck.description}
                      isPoster={false}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {decks === "Quota exceeded." ? (
                    "Intente nuevamente mas tarde."
                  ) : (
                    <div className={decksStyles.emptyData}>
                      <h3>
                        <span>Aun no tienes mazos creados.</span>
                        Comienza creando uno presionando en el boton "Crear un
                        nuevo mazo"
                      </h3>
                      <EmptySvg />
                    </div>
                  )}
                </>
              )}
              <button
                className={`${styles.roundedButtonTerciary}`}
                onClick={openCreateDeck}
              >
                <NewFolderIcon /> Crear un nuevo mazo
              </button>
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        h2 {
          padding: 10px;
          font-weight: 600;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          user-select: none;
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }

        .decks > button {
          margin-top: 20px;
        }

        .${styles.roundedButtonTerciary} {
          gap: 10px;
        }
      `}</style>
    </main>
  );
}

export default index;
