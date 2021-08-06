import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//firebase
import {
  getCardsForStudyV2,
  listenForDecksV2,
  listenForDeckV2,
} from "firebase/client";

//hooks
import { useModal } from "hooks/useModal";
import useUser, { USER_STATES } from "hooks/useUser";

//components
import DeckContainer from "components/DeckContainer";
import ScreenLoadingComponent from "components/ScreenLoadingComponent";
import CustomSelect from "components/CustomSelect";

//svgs
import AddFolderSvg from "svgs/AddFolderSvg";
import AddCardSvg from "svgs/AddCardSvg";
import StatisticsSvg from "svgs/StatisticsSvg";
import ReviewSvg from "svgs/ReviewSvg";
import EmptySvg from "svgs/EmptySvg";
import NoResultsSvg from "svgs/NoResultsSvg";

//icons
import CardsIcon from "icons/CardsIcon";
import NewFolderIcon from "icons/NewFolderIcon";
import CreateIcon from "icons/CreateIcon";
import TrashIcon from "icons/TrashIcon";
import SettingsIcon from "icons/SettingsIcon";
import ChevronRightIcon from "icons/ChevronRightIcon";
import SearchIcon from "icons/SearchIcon";
import SortAscAlphIcon from "icons/SortAscAlphIcon";
import SortAscCalIcon from "icons/SortAscCalIcon";
import SortDescCalIcon from "icons/SortDescCalIcon";
import SortDescAlphIcon from "icons/SortDescAlphIcon";
import BackIcon from "icons/BackIcon";

//popups
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";
import CreateCardWindow from "components/popups/CreateCardWindow";
import MenuHeaderDeck from "components/menus/MenuHeaderDeck";
import CardsWindow from "components/popups/CardsWindow";
import ExploreIcon from "icons/ExploreIcon";

import SpinnerComponent from "components/SpinnerComponentCircle";
import StudyCardsWindow from "components/popups/StudyCardsWindow";

function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);
  const [isOpenCreateCard, openCreateCard, closeCreateCard] = useModal(false);
  const [isOpenMenuHeaderDeck, openMenuHeaderDeck, closeMenuHeaderDeck] =
    useModal(false);
  const [isOpenStudyCards, openStudyCards, closeStudyCards] = useModal(false);
  const [isOpenCards, openCards, closeCards] = useModal(false);
  const [loading, setLoading] = useState(true);
  const [idDeck, setIdDeck] = useState(null);
  const [actualDeck, setActualDeck] = useState(null);
  const [decks, setDecks] = useState(null);
  const [decksForShow, setDeckForShow] = useState(null);
  const [cards, setCards] = useState(null);
  const [createdCards, setCreatedCards] = useState(null);
  const [studiedCards, setStudiedCards] = useState(null);
  const [learnedCards, setLearnedCards] = useState(null);
  const [xCoord, setXCoord] = useState(null);
  const [yCoord, setYCoord] = useState(null);
  const [emptyCards, setEmptyCards] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [decksLoading, setDecksLoading] = useState(true);

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
    mounted = true;

    if (mounted) {
      if (cards) {
        if (cards.length > 0) {
          setEmptyCards(false);
        }

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
    }

    return () => {
      setEmptyCards(true);
      setCreatedCards(0);
      setStudiedCards(0);
      setLearnedCards(0);
      mounted = false;
    };
  }, [cards]);

  const handleStudyButton = (e) => {};

  const goBack = () => {
    if (actualDeck.parentDeckId) {
      router.push(actualDeck.parentDeckId);
    } else {
      router.push("/decks");
    }
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
      setCards(null);
      setLoading(true);
      //unsubscribeCards && unsubscribeCards();
    };
  }, [user, idDeck]);

  useEffect(() => {
    mounted = true;

    if (mounted) {
      if (decks) {
        setDeckForShow(decks);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      setDeckForShow(null);
      setLoading(true);
    };
  }, [decks]);

  //CARD EFFECT
  const makeMagicOnHover = (e) => {
    const main = document.querySelector(`.${styles.main}`);

    let xAxis =
      (e.target.offsetLeft + e.target.offsetWidth / 2 - e.clientX) / -7;
    let yAxis =
      (e.target.offsetTop +
        e.target.offsetHeight / 2 -
        e.clientY -
        main.scrollTop) /
      7;

    e.target.firstChild.style.transition =
      "transform 0ms ease-in-out, background-position 0.26s ease-in-out";
    e.target.firstChild.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) rotateZ(${
      -xAxis / 7
    }deg)`;
  };

  const removeMagicOnHover = (e) => {
    e.target.firstChild.style.transition =
      "transform 300ms linear ,background-position 0.26s ease-in-out";
    e.target.firstChild.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      setDeckForShow(decks);
    } else {
      setSearchValue(value.trim());
      const checkForInclude = (object) => {
        return object.name.toLowerCase().includes(value.trim().toLowerCase());
      };

      const newDecks = decks.filter(checkForInclude);

      setDeckForShow(newDecks);
    }
  };

  const sortDecksByNameAsc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      if (a.name === b.name) return 0;
    });
    setDeckForShow(newDecks);
  };

  const sortDecksByNameDesc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      if (a.name === b.name) return 0;
    });

    setDeckForShow(newDecks);
  };

  const sortDecksByCreatedAsc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.createdAt.seconds < b.createdAt.seconds) return -1;
      if (a.createdAt.seconds > b.createdAt.seconds) return 1;
      if (a.createdAt.seconds === b.createdAt.seconds) return 0;
    });

    setDeckForShow(newDecks);
  };

  const sortDecksByCreatedDesc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.createdAt.seconds < b.createdAt.seconds) return 1;
      if (a.createdAt.seconds > b.createdAt.seconds) return -1;
      if (a.createdAt.seconds === b.createdAt.seconds) return 0;
    });

    setDeckForShow(newDecks);
  };

  const sortOptions = [
    {
      value: "nameAsc",
      action: sortDecksByNameAsc,
      component: (
        <>
          <SortAscAlphIcon />
          <span>Nombre ascendete</span>
        </>
      ),
    },
    {
      value: "nameDesc",
      action: sortDecksByNameDesc,
      component: (
        <>
          <SortDescAlphIcon />
          <span>Nombre descendiente</span>
        </>
      ),
    },
    {
      value: "createdAsc",
      action: sortDecksByCreatedAsc,
      component: (
        <>
          <SortAscCalIcon />
          <span>Fecha de creación (asc)</span>
        </>
      ),
    },
    {
      value: "createdDesc",
      action: sortDecksByCreatedDesc,
      component: (
        <>
          <SortDescCalIcon />
          <span>Fecha de creación (decs)</span>
        </>
      ),
    },
  ];

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
            <div className={styles.noResults}>
              <h2>
                <strong>404</strong> <br />
                No hemos encontrado el mazo que buscas
              </h2>
              <div className={styles.noResults__buttons}>
                <button
                  className={styles.roundedButtonTerciary}
                  onClick={(e) => router.back()}
                >
                  <BackIcon /> Volver atras
                </button>
                <button
                  className={styles.roundedButtonFilled}
                  onClick={(e) => router.replace("/decks")}
                >
                  Ir a "Mis Mazos"
                </button>
              </div>
              <NoResultsSvg />
            </div>
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
                  <h1 className={styles.title} title={actualDeck?.name}>
                    {actualDeck?.name}

                    {actualDeck?.isPublic && (
                      <>
                        <span> · Mazo público</span>
                        <ExploreIcon title="Mazo público" />
                      </>
                    )}
                  </h1>
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
                  cards={cards}
                  setCards={setCards}
                />
              )}

              {isOpenRemoveDeck && (
                <RemoveDeckWindow
                  isOpen={isOpenRemoveDeck}
                  closeWindow={closeRemoveDeck}
                  deckId={idDeck}
                  name={actualDeck?.name}
                  paramSetLoading={setLoading}
                />
              )}

              {isOpenCards && (
                <CardsWindow
                  isOpen={isOpenCards}
                  closeWindow={closeCards}
                  cards={cards}
                />
              )}

              {isOpenStudyCards && (
                <StudyCardsWindow
                  isOpen={isOpenStudyCards}
                  closeWindow={closeStudyCards}
                  cards={cards}
                />
              )}

              <section className={decksStyles.managmentContainer}>
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
                      className={`${decksStyles.card__wrapper} ${
                        emptyCards && decksStyles.card__wrapper_disabled
                      }`}
                      onClick={(e) => {
                        !emptyCards && openStudyCards();
                      }}
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

                <div className={decksStyles.cards}>
                  <h2 className={decksStyles.title}>Tarjetas</h2>
                  <div className={decksStyles.cards__groups}>
                    <div>
                      {createdCards === null ? (
                        <SpinnerComponent />
                      ) : (
                        <span>{createdCards}</span>
                      )}
                      <p>creadas</p>
                    </div>

                    <div>
                      {studiedCards === null ? (
                        <SpinnerComponent />
                      ) : (
                        <span>{studiedCards}</span>
                      )}
                      <p>estudiadas</p>
                    </div>

                    <div>
                      {learnedCards === null ? (
                        <SpinnerComponent />
                      ) : (
                        <span>{learnedCards}</span>
                      )}
                      <p>aprendidas</p>
                    </div>
                  </div>
                  <button
                    className={styles.roundedButtonTerciary}
                    disabled={cards?.length === 0}
                    onClick={openCards}
                  >
                    <CardsIcon /> Ver tarjetas
                  </button>
                </div>
              </section>

              <div className="decks">
                <h3>Sub mazos</h3>

                {decks.length > 0 && (
                  <div className={decksStyles.toolbar}>
                    <div className={styles.searchInput}>
                      <SearchIcon />
                      <input
                        type="text"
                        name="searchInput"
                        id="searchInput"
                        autoComplete="off"
                        placeholder="Buscar mazo 🛰️..."
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    <CustomSelect
                      options={sortOptions}
                      setActualState={setDecksLoading}
                      defaultAction={sortDecksByNameAsc}
                    />
                  </div>
                )}

                {decks?.length > 0 ? (
                  <>
                    {decksForShow.length > 0 ? (
                      <div className={decksStyles.decks}>
                        {decksForShow.map((deck) => (
                          <DeckContainer
                            key={deck.id}
                            deckId={deck.id}
                            name={deck.name}
                            description={deck.description}
                            isPublic={deck.isPublic}
                            parentDeckId={idDeck}
                            paramCards={cards}
                            paramSetCards={setCards}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className={decksStyles.noResults}>
                        <h2>
                          No hay resultados para esta busqueda... <br />
                          <strong>{searchValue}</strong>
                        </h2>
                        <NoResultsSvg />
                      </div>
                    )}
                  </>
                ) : (
                  <div className={decksStyles.emptyData}>
                    <EmptySvg />
                    <div>
                      <h2>Aun no tienes submazos creados.</h2>
                      <p>
                        Comienza creando uno presionando en el boton "Crear un
                        nuevo mazo"
                      </p>
                      <button
                        className={`${styles.roundedButtonTerciary}`}
                        onClick={openCreateDeck}
                      >
                        <NewFolderIcon /> Crear un nuevo mazo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      <style jsx>{`
        h3 {
          padding: 1em 0;
          font-weight: 600;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.8);
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
