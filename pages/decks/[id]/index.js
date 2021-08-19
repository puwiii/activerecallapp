import React, { useEffect, useState, Suspense } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

//firebase
import {
  getCardsForStudyV2,
  listenForDecksV2,
  listenForDeckV2,
} from "firebase/client";

//hooks
import { useModal } from "hooks/useModal";
import useUser, { USER_STATES } from "hooks/useUser";
import { useLocalStorage } from "hooks/useLocalStorage";

//components
import DeckContainer from "components/DeckContainer";
import ScreenLoadingComponent from "components/ScreenLoadingComponent";
import CustomSelect from "components/CustomSelect";

//svgs
import AddFolderSvg from "svgs/AddFolderSvg";
import AddCardSvg from "svgs/AddCardSvg";
import StatisticsSvg from "svgs/StatisticsSvg";
import ReviewSvg from "svgs/ReviewSvg";
import NoResultsSvg from "svgs/NoResultsSvg";
import SpinnerComponent from "components/SpinnerComponentCircle";
import StudyCardsWindow from "components/popups/StudyCardsWindow";

const DecksList = React.lazy(() => import("components/DecksList"));

//icons
import CardsIcon from "icons/CardsIcon";
import NewFolderIcon from "icons/NewFolderIcon";
import CreateIcon from "icons/CreateIcon";
import TrashIcon from "icons/TrashIcon";
import SettingsIcon from "icons/SettingsIcon";
import ChevronRightIcon from "icons/ChevronRightIcon";
import BackIcon from "icons/BackIcon";
import ExploreIcon from "icons/ExploreIcon";

//popups
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";
import CreateCardWindow from "components/popups/CreateCardWindow";
import MenuHeaderDeck from "components/menus/MenuHeaderDeck";
import CardsWindow from "components/popups/CardsWindow";

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
  const [actualDeck, setActualDeck] = useState(undefined);
  const [cards, setCards] = useState(null);
  const [createdCards, setCreatedCards] = useState(null);
  const [studiedCards, setStudiedCards] = useState(null);
  const [learnedCards, setLearnedCards] = useState(null);
  const [xCoord, setXCoord] = useState(null);
  const [yCoord, setYCoord] = useState(null);
  const [emptyCards, setEmptyCards] = useState(true);
  const [useMagicOnHover, setUseMagicOnHover] = useLocalStorage(
    "magicOnHoverCards",
    false
  );

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

    if (user && idDeck) {
      getCardsForStudyV2(idDeck).then((cards) => {
        setCards(cards);
      });

      unsubscribeActualDeck = listenForDeckV2(idDeck, setActualDeck);
    }

    return () => {
      unsubscribeActualDeck && unsubscribeActualDeck();
      setCards(null);
      setLoading(true);
    };
  }, [user, idDeck]);

  useEffect(() => {
    if (actualDeck === null || actualDeck) setLoading(false);
  }, [actualDeck]);

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
      "transform 0ms ease-in-out, background-position 400ms ease-in-out";
    e.target.firstChild.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) rotateZ(${
      -xAxis / 7
    }deg)`;
  };

  const removeMagicOnHover = (e) => {
    e.target.firstChild.style.transition =
      "transform 300ms linear ,background-position 0.26s ease-in-out";
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
              <div className={decksStyles.header__container}>
                {actualDeck && (
                  <div
                    className={`${decksStyles.header} ${decksStyles.container}`}
                  >
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
                        //className={styles.roundedButtonTerciary}
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
              </div>

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
                  paramSetCards={setCards}
                />
              )}

              <section
                className={`${decksStyles.managmentContainer} ${decksStyles.container}`}
              >
                <div className={decksStyles.managment}>
                  <div
                    className={`${styles.flex_ai_c} ${styles.flex_jc_sb} ${styles.pb_2}`}
                  >
                    <h2 className={decksStyles.title}>Administrar mazo</h2>
                    <div className={`${styles.flex_ai_c} ${styles.gap_1}`}>
                      <span className={componentsStyles.switch__icon}>🔮</span>
                      <label
                        className={componentsStyles.switch}
                        htmlFor="toggleMagic"
                      >
                        <input
                          type="checkbox"
                          name="toggleMagic"
                          id="toggleMagic"
                          defaultChecked={useMagicOnHover}
                          onChange={(e) => setUseMagicOnHover(!useMagicOnHover)}
                          // onClick={(e) => setUseMagicOnHover(!useMagicOnHover)}
                        />
                        <span
                          className={componentsStyles.switch__slider}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className={decksStyles.card}>
                    <div
                      className={decksStyles.card__wrapper}
                      onClick={openCreateDeck}
                      onMouseMove={(e) =>
                        useMagicOnHover && makeMagicOnHover(e)
                      }
                      onMouseLeave={(e) =>
                        useMagicOnHover && removeMagicOnHover(e)
                      }
                    >
                      <div className={decksStyles.card__item}>
                        <AddFolderSvg />
                        <span>Crear nuevo mazo</span>
                      </div>
                    </div>
                    <div
                      className={decksStyles.card__wrapper}
                      onClick={openCreateCard}
                      onMouseMove={(e) =>
                        useMagicOnHover && makeMagicOnHover(e)
                      }
                      onMouseLeave={(e) =>
                        useMagicOnHover && removeMagicOnHover(e)
                      }
                    >
                      <div className={decksStyles.card__item}>
                        <AddCardSvg />
                        <span>Crear nueva tarjeta</span>
                      </div>
                    </div>
                    <div
                      className={decksStyles.card__wrapper}
                      onMouseMove={(e) =>
                        useMagicOnHover && makeMagicOnHover(e)
                      }
                      onMouseLeave={(e) =>
                        useMagicOnHover && removeMagicOnHover(e)
                      }
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
                      onMouseMove={(e) =>
                        useMagicOnHover && makeMagicOnHover(e)
                      }
                      onMouseLeave={(e) =>
                        useMagicOnHover && removeMagicOnHover(e)
                      }
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
                        <SpinnerComponent withoutText={true} />
                      ) : (
                        <span>{createdCards}</span>
                      )}
                      <p>creadas</p>
                    </div>

                    <div>
                      {studiedCards === null ? (
                        <SpinnerComponent withoutText={true} />
                      ) : (
                        <span>{studiedCards}</span>
                      )}
                      <p>estudiadas</p>
                    </div>

                    <div>
                      {learnedCards === null ? (
                        <SpinnerComponent withoutText={true} />
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

              <Suspense
                fallback={
                  <div className={decksStyles.container}>
                    <h3 className={decksStyles.decks__subtitle}>Sub mazos</h3>
                    <div className={`${decksStyles.decks}`}>
                      <DeckContainer loadingContainer={true} />
                    </div>
                  </div>
                }
              >
                <DecksList
                  parentDeckId={actualDeck?.id}
                  openCreateDeck={openCreateDeck}
                  parentCards={cards}
                  parentSetCards={setCards}
                />
              </Suspense>
            </>
          )}
        </>
      )}

      <style jsx>{`
        h3 {
          padding: 1em 0;
          font-weight: 700;
          font-size: 1.28rem;
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
