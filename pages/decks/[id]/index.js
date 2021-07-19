import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//firebase
import {
  getCardsForStudy,
  listenForCardsV2,
  listenForDecksV2,
  listenForDeckV2,
} from "firebase/client";

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, { USER_STATES } from "components/hooks/useUser";

//components
import CardContainer from "components/CardContainer";
import DeckContainer from "components/DeckContainer";
import SpinnerComponent from "components/SpinnerComponent";
import ScreenLoadingComponent from "components/ScreenLoadingComponent";

//icons
import LightningIcon from "components/icons/LightningIcon";
import NewFolderIcon from "components/icons/NewFolderIcon";
import CreateIcon from "components/icons/CreateIcon";
import TrashIcon from "components/icons/TrashIcon";
import SettingsIcon from "components/icons/SettingsIcon";

//popups
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";
import CreateCardWindow from "components/popups/CreateCardWindow";
import MenuHeaderDeck from "components/menus/MenuHeaderDeck";
import ChevronRightIcon from "components/icons/ChevronRightIcon";

function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);
  const [isOpenCreateCard, openCreateCard, closeCreateCard] = useModal(false);
  const [isOpenMenuHeaderDeck, openMenuHeaderDeck, closeMenuHeaderDeck] =
    useModal(false);
  const [loading, setLoading] = useState(true);
  const [idDeck, setIdDeck] = useState(null);
  const [actualDeck, setActualDeck] = useState(null);
  const [decks, setDecks] = useState(null);
  const [cards, setCards] = useState(null);

  const [xCoord, setXCoord] = useState(null);
  const [yCoord, setYCoord] = useState(null);

  let user = useUser();

  let mounted = false;

  const router = useRouter();

  const handleMenuHeaderDeck = (e) => {
    e.preventDefault();

    let newXCoord = e.target.offsetLeft + e.target.offsetWidth;
    let newYCoord = e.target.offsetTop + e.target.offsetHeight;

    setXCoord(newXCoord);
    setYCoord(newYCoord);

    if (isOpenMenuHeaderDeck) {
      closeMenuHeaderDeck();
    } else {
      openMenuHeaderDeck();
    }
  };

  const handleStudyButton = (e) => {
    e.preventDefault();
    //router.push(`study/${actualDeck.id}`);
    const cardsForStudy = getCardsForStudy(actualDeck.id);
    console.log(cardsForStudy);
  };

  const goBack = () => {
    router.back();
  };
  //check for user
  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }
  }, [user]);

  useEffect(() => {
    mounted = true;
    setIdDeck(router.query.id);

    return () => {
      mounted = false;
      setIdDeck(null);
    };
  }, [router.query.id]);

  useEffect(() => {
    let unsubscribeActualDeck;
    let unsubscribeDecks;
    let unsubscribeCards;

    if (user && idDeck) {
      unsubscribeActualDeck = listenForDeckV2(idDeck, setActualDeck);
      unsubscribeDecks = listenForDecksV2(idDeck, setDecks);
      unsubscribeCards = listenForCardsV2(idDeck, setCards);
    }

    return () => {
      unsubscribeActualDeck && unsubscribeActualDeck();
      unsubscribeDecks && unsubscribeDecks();
      unsubscribeCards && unsubscribeCards();
    };
  }, [user, idDeck]);

  useEffect(() => {
    mounted = true;
    if (mounted) {
      if (decks && cards) {
        setLoading(false);
      }
    }
    console.log(actualDeck);
    return () => {
      mounted = false;
      //setLoading(true);
    };
  }, [decks, cards]);

  return (
    <main className={styles.main}>
      <Head>
        <title>
          Mis mazos
          {actualDeck && ` / ${actualDeck.name}`}
        </title>
      </Head>
      {loading ? (
        <ScreenLoadingComponent />
      ) : (
        <>
          {actualDeck === null ? (
            "No encontramos este mazo"
          ) : (
            <>
              <div className={decksStyles.floatButtons}>
                <button
                  title="Crear nuevo mazo"
                  className={styles.roundedButtonTerciary}
                  onClick={openCreateDeck}
                >
                  <NewFolderIcon />
                </button>
                <button
                  title="Crear nueva tarjeta"
                  className={styles.roundedButtonTerciary}
                  onClick={openCreateCard}
                >
                  <CreateIcon />
                </button>
              </div>

              {/* <h1 className={styles.title}>Mis Mazos</h1> */}

              {actualDeck ? (
                <div className={decksStyles.header}>
                  <span title="Volver atras" onClick={goBack}>
                    <ChevronRightIcon />
                  </span>
                  <h1 className={styles.subtitle}>{actualDeck?.name}</h1>
                  <div>
                    <button onClick={openRemoveDeck}>
                      <TrashIcon />
                      <span>Eliminar mazo</span>
                    </button>
                    <button onClick={(e) => handleMenuHeaderDeck(e)}>
                      <SettingsIcon />
                      <span>Modificar mazo</span>
                    </button>
                    <button
                      className={styles.roundedButtonSecondary}
                      onClick={(e) => handleStudyButton(e)}
                    >
                      <LightningIcon />
                      <span>Estudiar mazo</span>
                    </button>
                    {isOpenMenuHeaderDeck && (
                      <MenuHeaderDeck
                        xCoord={xCoord}
                        yCoord={yCoord}
                        deckId={idDeck}
                        isOpen={isOpenMenuHeaderDeck}
                        closeWindow={closeMenuHeaderDeck}
                        deckName={actualDeck.name}
                        deckDescription={actualDeck.description}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {/* <hr /> */}

              <section>
                {/* popups */}

                {isOpenCreateDeck && (
                  <CreateDeckWindow
                    isOpen={isOpenCreateDeck}
                    closeWindow={closeCreateDeck}
                    deckId={idDeck}
                  />
                )}

                {isOpenCreateCard && (
                  <CreateCardWindow
                    isOpen={isOpenCreateCard}
                    closeWindow={closeCreateCard}
                    deckId={idDeck}
                  />
                )}

                {isOpenRemoveDeck && (
                  <RemoveDeckWindow
                    isOpen={isOpenRemoveDeck}
                    closeWindow={closeRemoveDeck}
                    deckId={idDeck}
                    name={actualDeck?.name}
                  />
                )}

                <div className="decks">
                  <h3>Mazos</h3>

                  {decks?.length > 0 ? (
                    <div className={decksStyles.decks}>
                      {decks.map((deck) => (
                        <DeckContainer
                          key={deck.id}
                          deckId={deck.id}
                          name={deck.name}
                          description={deck.description}
                          parentDeckId={idDeck}
                        />
                      ))}
                    </div>
                  ) : (
                    <h3>No hay mazos que mostrar</h3>
                  )}

                  <button
                    className={styles.roundedButtonTerciary}
                    onClick={openCreateDeck}
                  >
                    Crear un nuevo mazo <NewFolderIcon />
                  </button>
                </div>

                <div className="cards">
                  <h3>Tarjetas</h3>
                  {cards?.length > 0 ? (
                    // <div className={cardsStyles.cards}>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        // 350: 1,
                        // 1464: 2,
                        // 2071: 3,
                        // 2675: 4,
                        // 3267: 5,
                        350: 1,
                        1200: 2,
                        1800: 3,
                        2400: 4,
                        3000: 5,
                      }}
                    >
                      <Masonry gutter="10px">
                        {cards.map((card) => (
                          <CardContainer
                            key={card.id}
                            cardId={card.id}
                            front={card.front}
                            back={card.back}
                            createdAt={card.createdAt}
                          />
                        ))}
                      </Masonry>
                    </ResponsiveMasonry>
                  ) : (
                    <h3>Aún no tienes tarjetas en este mazo</h3>
                  )}

                  <button
                    className={styles.roundedButtonTerciary}
                    onClick={openCreateCard}
                  >
                    Crear una nueva tarjeta <CreateIcon />
                  </button>
                </div>
              </section>
            </>
          )}
        </>
      )}

      <style jsx>{`
        h3 {
          padding: 20px 10px;
          font-weight: 600;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          user-select: none;
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }

        .decks > button,
        .cards > button {
          margin-top: 20px;
        }

        hr {
          margin-top: 4px;
          border: 1px solid rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </main>
  );
}

export default index;
