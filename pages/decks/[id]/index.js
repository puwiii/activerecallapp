import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//firebase
import {
  getAllCardsFromDeck,
  getCardsForStudy,
  getCardsForStudyV2,
  //listenForCardsV2,
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

//svgs
import AddFolderSvg from "components/svgs/AddFolderSvg";
import AddCardSvg from "components/svgs/AddCardSvg";
import StatisticsSvg from "components/svgs/StatisticsSvg";
import ReviewSvg from "components/svgs/ReviewSvg";

//icons
import CardsIcon from "components/icons/CardsIcon";
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
  const [createdCards, setCreatedCards] = useState(0);
  const [studiedCards, setStudiedCards] = useState(0);
  const [learnedCards, setLearnedCards] = useState(0);
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

  useEffect(() => {
    if (cards) {
      let created = 0;
      let studied = 0;
      let learned = 0;

      cards.length > 0 &&
        cards.map((card) => {
          if (card.status === 0) created++;
          if (card.status === 1) studied++;
          if (card.status === 2) learned++;
        });

      setCreatedCards(created);
      setStudiedCards(studied);
      setLearnedCards(learned);
    }
  }, [cards]);

  const handleStudyButton = (e) => {
    e.preventDefault();
    //router.push(`study/${actualDeck.id}`);
    const cardsForStudy = getAllCardsFromDeck(actualDeck.id);
    console.log(cardsForStudy);
  };

  const goBack = () => {
    router.back();
  };

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

    //handleCardsStatus(getCardsForStudy(idDeck));

    if (user && idDeck) {
      //getAllCardsFromDeck(idDeck, setCards);
      getCardsForStudyV2(idDeck).then((cards) => {
        setCards(cards);
      });

      unsubscribeActualDeck = listenForDeckV2(idDeck, setActualDeck);
      unsubscribeDecks = listenForDecksV2(idDeck, setDecks);
      // unsubscribeCards = listenForCardsV2(idDeck, setCards);
    }

    return () => {
      unsubscribeActualDeck && unsubscribeActualDeck();
      unsubscribeDecks && unsubscribeDecks();
      setLoading(true);
      //unsubscribeCards && unsubscribeCards();
    };
  }, [user, idDeck]);

  useEffect(() => {
    mounted = true;

    if (mounted) {
      if (decks) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      setLoading(true);
    };
  }, [decks]);

  //CARD EFFECT
  const makeMagicOnHover = (e) => {
    const main = document.querySelector(`.${styles.main}`);

    let xAxis =
      (e.target.offsetLeft + e.target.offsetWidth / 2 - e.clientX) / -8;
    let yAxis =
      (e.target.offsetTop +
        e.target.offsetHeight / 2 -
        e.clientY -
        main.scrollTop) /
      8;

    // let xAxis = (e.target.offsetLeft + e.target.clientWidth / 2 - e.pageX) / -5;
    // let yAxis = (e.target.offsetTop + e.target.clientHeight / 2 - e.pageY) / 5;

    // let xAxis = e.target.clientWidth / 2 - e.target.offsetWidth;
    // let yAxis = e.target.clientHeight / 2 - e.target.offsetHeight;

    e.target.firstChild.style.transition =
      "transform 0ms ease-in-out, background-position 0.26s ease-in-out";
    e.target.firstChild.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) rotateZ(${
      -xAxis / 8
    }deg)`;
  };

  const removeMagicOnHover = (e) => {
    e.target.firstChild.style.transition =
      "transform 600ms ease-in-out ,background-position 0.36s ease-in-out";
    e.target.firstChild.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <main className={styles.main}>
      <Head>
        <title>
          {actualDeck ? `${actualDeck.name} / Liza` : "Mis mazos / Liza"}
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
                  className={styles.roundedButtonFilled}
                  onClick={openCreateDeck}
                >
                  <NewFolderIcon />
                </button>
                <button
                  title="Crear nueva tarjeta"
                  className={styles.roundedButtonFilled}
                  onClick={openCreateCard}
                >
                  <CreateIcon />
                </button>
              </div>

              {/* header */}
              {actualDeck && (
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
                    <button
                      className={styles.roundedButtonTerciary}
                      onClick={(e) => handleMenuHeaderDeck(e)}
                    >
                      <SettingsIcon />
                      <span>Modificar mazo</span>
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
              )}

              <section className={decksStyles.managmentContainer}>
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

                {/* deck managment */}

                <div className={decksStyles.managment}>
                  <h2 className={decksStyles.title}>Administrar mazo</h2>

                  <div className={decksStyles.card}>
                    <div
                      className={decksStyles.card__wrapper}
                      onClick={openCreateDeck}
                      onMouseMove={(e) => makeMagicOnHover(e)}
                      onMouseLeave={(e) => removeMagicOnHover(e)}
                    >
                      <div className={decksStyles.card__item}>
                        <AddFolderSvg />
                        <span>Crear nuevo mazo</span>
                      </div>
                    </div>
                    <div
                      className={decksStyles.card__wrapper}
                      onClick={openCreateCard}
                      onMouseMove={(e) => makeMagicOnHover(e)}
                      onMouseLeave={(e) => removeMagicOnHover(e)}
                    >
                      <div className={decksStyles.card__item}>
                        <AddCardSvg />
                        <span>Crear nueva tarjeta</span>
                      </div>
                    </div>
                    <div
                      className={decksStyles.card__wrapper}
                      onMouseMove={(e) => makeMagicOnHover(e)}
                      onMouseLeave={(e) => removeMagicOnHover(e)}
                    >
                      <div className={decksStyles.card__item}>
                        <StatisticsSvg />
                        <span>Ver estadísticas</span>
                      </div>
                    </div>
                    <div
                      className={decksStyles.card__wrapper}
                      onMouseMove={(e) => makeMagicOnHover(e)}
                      onMouseLeave={(e) => removeMagicOnHover(e)}
                    >
                      <div className={decksStyles.card__item}>
                        <ReviewSvg />
                        <span>Estudiar mazo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* cards */}
                <div className={decksStyles.cards}>
                  <h2 className={decksStyles.title}>Tarjetas</h2>
                  <div className={decksStyles.cards__groups}>
                    <div>
                      <p>{createdCards}</p>
                      <span>creadas</span>
                    </div>
                    <div>
                      <p>{studiedCards}</p>
                      <span>estudiadas</span>
                    </div>
                    <div>
                      <p>{learnedCards}</p>
                      <span>aprendidas</span>
                    </div>
                  </div>
                  <button className={styles.roundedButtonTerciary}>
                    <CardsIcon /> Ver tarjetas
                  </button>
                </div>
              </section>

              <hr />

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

                {/* <button
                  className={styles.roundedButtonTerciary}
                  onClick={openCreateDeck}
                >
                  Crear un nuevo mazo <NewFolderIcon />
                </button> */}
              </div>

              {/* <div className="cards">
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
                </div> */}
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
