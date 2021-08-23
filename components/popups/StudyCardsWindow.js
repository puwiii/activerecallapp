import React, { useState, useEffect } from "react";

//firebase
import {
  UpdateIntervalDataCard,
  firebaseTimeStampFromDate,
} from "firebase/client";

//styles
import popupStyles from "styles/Popup.module.scss";
import decksStyles from "styles/Decks.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

//icons
import CloseIcon from "icons/CloseIcon";
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import MinusIcon from "icons/minusIcon";
import PlusIcon from "icons/PlusIcon";
import SwipeIcon from "icons/SwipeIcon";
import InfoIcon from "icons/InfoIcon";

//svgs
import StudyingSvg from "svgs/StudyingSvg";

//components
import ScreenLoadingComponent from "components/ScreenLoadingComponent";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import CardContainer from "components/CardContainer";
import SpinnerComponent from "components/SpinnerComponentCircle";

//functions
import { sortCardsByNextInterval } from "helpers/sortFunctions";

function StudyCardsWindow({ isOpen, closeWindow, cards, paramSetCards }) {
  const [stage, setStage] = useState(0);

  const [newCards, setNewCards] = useState(null);
  const [learningCards, setLearningCards] = useState(null);
  const [reviewingCards, setReviewingCards] = useState(null);

  //session config values
  const [limitCards, setLimitCards] = useState(false);
  const [prioritizeCards, setPrioritizeCards] = useState(false);
  const [limitCardsNumber, setLimitCardsNumber] = useState(1);
  const [prioritizeCardsOption, setPrioritizeCardsOption] = useState(0);

  //misc
  const [cardsForStudying, setCardsForStudying] = useState(null);
  const [cardsForSession, setCardsForSession] = useState(null);
  const [cardIndex, setCardIndex] = useState(null);
  const [flipCard, setFlipCard] = useState(false);
  const [cardInScreen, setCardInScreen] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

  let mounted;

  const handleCalcIntervalForCard = (score, card) => {
    let { EF, I, n, nextTimestamp } = card.intervalData;

    let status = card.status;

    const initialInterval = 60000 * 5; //60000(ms) ==> 1min

    try {
      if (card.status === 0) status = 1; //setting card to studied/studying status if its new

      if (score >= 2) {
        //correct response
        switch (n) {
          case 0:
            I = initialInterval;
            break;

          case 1:
            I = initialInterval * 6;
            break;

          default:
            //setting card to learned/reviewing status
            status = 2;
            I = I * EF;
            break;
        }
        EF = EF + (0.1 - (4 - score) * (0.08 + (4 - score) * 0.02));
        if (EF < 1.3) EF = 1.3;
        n++;
      } else {
        //incorrect response
        //setting card to studied/studying status
        status = 1;
        n = 0;
        I = initialInterval;
      }

      const nextIntervalDate = new Date(Date.now() + I);

      //console.log(EF, I, n);
      return UpdateIntervalDataCard(
        card.id,
        n,
        EF,
        I,
        nextIntervalDate,
        status
      ).then(() => {
        let updatedCard = card;
        updatedCard.intervalData = {
          n: n,
          EF: EF,
          I: I,
          nextTimestamp: firebaseTimeStampFromDate(nextIntervalDate),
        };
        updatedCard.status = status;
        let cardsUpdated = cards.filter((itemCard) => itemCard.id !== card.id);
        cardsUpdated.push(updatedCard);
        paramSetCards(cardsUpdated);
        return true;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleNextCard = (score) => {
    formStageTwo.focus();
    setCardLoading(true);
    handleCalcIntervalForCard(score, cardInScreen)
      .then(() => {
        if (cardsForSession[cardIndex + 1]) {
          setCardIndex(cardIndex + 1);
          setCardInScreen(cardsForSession[cardIndex + 1]);

          setFlipCard(false);
          //setCardLoading(false);
        } else {
          setStage(3);
          setCardInScreen(cardsForSession[0]);
          setCardIndex(0);
        }
        setCardLoading(false);
      })
      .catch((error) => {
        setCardLoading(false);
        alert(error);
      });
  };

  useEffect(() => {
    if (cardInScreen) {
      setCardLoading(false);
    }
  }, [cardInScreen]);
  // useEffect(() => {
  //   if (cardsForSession) {
  //     setCardInScreen(cardsForSession[cardIndex]);
  //   }
  // }, [cardIndex]);

  const handleStartSession = () => {
    if (cardsForStudying.length === 0) return;
    setStage(1);

    if (limitCards) {
      let newCards = [];

      if (prioritizeCards) {
        try {
          let prioritizeCards = [];
          let otherCards = [];

          switch (prioritizeCardsOption) {
            case 0:
              cardsForStudying.forEach((card) => {
                if (card.status === 0) prioritizeCards.push(card);
                else otherCards.push(card);
              });
              break;

            case 1:
              cardsForStudying.forEach((card) => {
                if (card.status === 1) prioritizeCards.push(card);
                else otherCards.push(card);
              });
              break;

            case 2:
              cardsForStudying.forEach((card) => {
                if (card.status === 2) prioritizeCards.push(card);
                else otherCards.push(card);
              });
              break;
          }

          newCards = sortCardsByNextInterval(prioritizeCards);

          if (limitCardsNumber > prioritizeCards.length) {
            newCards.push(...sortCardsByNextInterval(otherCards));
          }
        } catch (error) {
          alert(error);
          setStage(0);
        }
      } else {
        newCards = sortCardsByNextInterval(cardsForStudying);
      }

      setCardsForSession(newCards.slice(0, limitCardsNumber));

      setStage(2);
    } else {
      setCardsForSession(cardsForStudying);

      setStage(2);
    }
  };

  useEffect(() => {
    if (cardsForSession) setCardInScreen(cardsForSession[0]);
  }, [cardsForSession]);

  useEffect(() => {
    mounted = true;

    if (mounted) {
      if (cards) {
        let cardsForStudy = [];
        let created = 0;
        let studied = 0;
        let learned = 0;

        const now = new Date();

        cards.map((card) => {
          if (card.intervalData.nextTimestamp.toDate() > now) return;
          else {
            cardsForStudy.push(card);
            if (card.status === 0) created++;
            if (card.status === 1) studied++;
            if (card.status === 2) learned++;
          }
        });

        setCardsForStudying(cardsForStudy);
        setCardIndex(0);
        setNewCards(created);
        setLearningCards(studied);
        setReviewingCards(learned);
      }
    }

    return () => {
      setCardsForStudying(null);
      setCardIndex(null);
      setNewCards(null);
      setLearningCards(null);
      setReviewingCards(null);
      mounted = false;
    };
  }, []);

  const closeForm = () => {
    closeWindow();
  };

  const handleLimitNumber = () => {
    if (limitCardsNumber < 1) setLimitCardsNumber(1);
    if (limitCardsNumber > cardsForStudying.length)
      setLimitCardsNumber(cardsForStudying.length);
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>¡A estudiar!</h1>

        {stage === 0 && (
          <div className={`${popupStyles.form}`}>
            <div>
              <h1>Tarjetas a estudiar</h1>
              <div className={decksStyles.cards__groups}>
                <div>
                  {newCards === null ? (
                    <SpinnerComponentCircle />
                  ) : (
                    <span>{newCards}</span>
                  )}
                  <p>Nuevas</p>
                </div>

                <div>
                  {learningCards === null ? (
                    <SpinnerComponentCircle />
                  ) : (
                    <span>{learningCards}</span>
                  )}
                  <p>Aprendiendo</p>
                </div>

                <div>
                  {reviewingCards === null ? (
                    <SpinnerComponentCircle />
                  ) : (
                    <span>{reviewingCards}</span>
                  )}
                  <p>Repasando</p>
                </div>
              </div>
            </div>
            <div className="sessionConfig">
              <h1>Configurar sesión</h1>
              <div className="sessionConfig__box">
                <div className={popupStyles.checkbox}>
                  <label
                    className={componentsStyles.switch}
                    htmlFor="limitCards"
                  >
                    <input
                      type="checkbox"
                      name="limitCards"
                      id="limitCards"
                      defaultChecked={limitCards}
                      onChange={(e) => {
                        if (limitCards) setPrioritizeCards(false);
                        setLimitCards(!limitCards);
                      }}
                      // onClick={(e) => setUseMagicOnHover(!useMagicOnHover)}
                    />
                    <span className={componentsStyles.switch__slider}></span>
                  </label>
                  {/* 
                  <input
                    type="checkbox"
                    id="limitCards"
                    name="limitCards"
                    checked={limitCards}
                    onChange={(e) => {
                      setLimitCards(!limitCards);
                    }}
                  /> */}
                  <label htmlFor="limitCards">
                    Limitar numeros de tarjetas
                  </label>
                </div>
                <div className="subLevel">
                  <div className={popupStyles.field}>
                    <label htmlFor="limitNumber">
                      Numero maximo de tarjetas para esta sesión
                    </label>
                    <div className={componentsStyles.inputNumber}>
                      <button
                        onClick={(e) => {
                          if (limitCardsNumber > 1) {
                            setLimitCardsNumber(limitCardsNumber - 1);
                          }
                        }}
                        disabled={!limitCards}
                      >
                        <MinusIcon />
                      </button>
                      <input
                        type="number"
                        name="limitNumber"
                        id="limitNumber"
                        min={1}
                        max={cardsForStudying?.length}
                        onBlur={handleLimitNumber}
                        disabled={!limitCards}
                        value={limitCardsNumber}
                        onChange={(e) => {
                          setLimitCardsNumber(parseInt(e.target.value));
                        }}
                      />
                      <button
                        onClick={(e) => {
                          if (limitCardsNumber < cardsForStudying.length)
                            setLimitCardsNumber(limitCardsNumber + 1);
                        }}
                        disabled={!limitCards}
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                  <div className={popupStyles.field}>
                    <div className={popupStyles.checkbox}>
                      <label
                        className={componentsStyles.switch}
                        htmlFor="priorizeCards"
                      >
                        <input
                          type="checkbox"
                          name="priorizeCards"
                          id="priorizeCards"
                          defaultChecked={prioritizeCards}
                          onChange={(e) => setPrioritizeCards(!prioritizeCards)}
                          // onClick={(e) => setUseMagicOnHover(!useMagicOnHover)}
                          disabled={!limitCards}
                        />
                        <span
                          className={componentsStyles.switch__slider}
                        ></span>
                      </label>
                      {/* <input
                        type="checkbox"
                        id="priorizeCards"
                        name="priorizeCards"
                        checked={prioritizeCards}
                        onChange={(e) => {
                          setPrioritizeCards(!prioritizeCards);
                        }}
                        disabled={!limitCards}
                      /> */}
                      <label htmlFor="priorizeCards">
                        Priorizar las tarjetas por su estado
                      </label>
                    </div>
                  </div>
                  <div className="subLevel">
                    <div>
                      <div className={popupStyles.field}>
                        <input
                          type="radio"
                          id="newCardsRadio"
                          name="priorizeCardsRadio"
                          value="newCardsRadio"
                          disabled={!prioritizeCards}
                          defaultChecked
                          onChange={(e) => {
                            if (e.target.checked) setPrioritizeCardsOption(0);
                          }}
                        />
                        <label htmlFor="newCardsRadio">Nuevas</label>
                      </div>

                      <div className={popupStyles.field}>
                        <input
                          type="radio"
                          id="learningCardsRadio"
                          name="priorizeCardsRadio"
                          value="learningCardsRadio"
                          disabled={!prioritizeCards}
                          onChange={(e) => {
                            if (e.target.checked) setPrioritizeCardsOption(1);
                          }}
                        />
                        <label htmlFor="learningCardsRadio">Aprendiendo</label>
                      </div>

                      <div className={popupStyles.field}>
                        <input
                          type="radio"
                          id="reviewingCardsRadio"
                          name="priorizeCardsRadio"
                          value="reviewingCardsRadio"
                          disabled={!prioritizeCards}
                          onChange={(e) => {
                            if (e.target.checked) setPrioritizeCardsOption(2);
                          }}
                        />
                        <label htmlFor="reviewingCardsRadio">Respasando</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className={`${popupStyles.form} ${popupStyles.stageStep}`}>
            <div className={popupStyles.noResults}>
              <StudyingSvg />
              <h2>
                Preparando sesíon 🏂
                <br />
                <br />
                <SpinnerComponentCircle />
              </h2>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div
            className={`${popupStyles.form} ${popupStyles.stageStep}`}
            id="formStageTwo"
            onKeyPress={(e) => {
              if (e.code === "Space") setFlipCard(!flipCard);
              console.log(e.code);
            }}
            tabIndex="0"
          >
            {cardInScreen === null ? (
              <ScreenLoadingComponent />
            ) : (
              <div className="card">
                {cardLoading ? (
                  <div className="backCard">
                    <SpinnerComponent propsCss={"height: 100%; width: 100%;"} />
                  </div>
                ) : (
                  <>
                    <div className="frontCard">
                      <CardContainer
                        cardId={cardInScreen.id}
                        data={cardInScreen.front}
                        type="Frente"
                        state={cardInScreen.status}
                      />
                    </div>
                    <div className="backCard">
                      <CardContainer
                        cardId={cardInScreen.id}
                        data={cardInScreen.back}
                        type="Reverso"
                        state={cardInScreen.status}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="panel">
              <div>
                <button
                  className={popupStyles.primaryButton + " swipeButton"}
                  onClick={(e) => {
                    setFlipCard(!flipCard);
                    e.target.blur();
                  }}
                >
                  <SwipeIcon /> {flipCard ? "Ver frente" : "Ver reverso"}
                </button>
                <span className={`${popupStyles.flex_ai_c} ${popupStyles.p_1}`}>
                  <InfoIcon />
                  Puedes pulsar "Espacio" para voltear la tarjeta.
                </span>
              </div>
              <div className="score">
                <div className="score__buttons">
                  <button
                    className={popupStyles.scoreBtn0}
                    onClick={(e) => {
                      handleNextCard(0);
                      e.target.blur();
                    }}
                    disabled={!flipCard}
                  >
                    Muy mal<span>😐</span>
                  </button>
                  <div className={componentsStyles.infoBox}>
                    <InfoIcon />
                    <span>
                      Bloqueo total, no pudiste recordar ni patata 🥔.
                    </span>
                  </div>
                </div>

                <div className="score__buttons">
                  <button
                    className={popupStyles.scoreBtn1}
                    onClick={(e) => {
                      handleNextCard(1);
                      e.target.blur();
                    }}
                    disabled={!flipCard}
                  >
                    Mal<span>🤔</span>
                  </button>
                  <div className={componentsStyles.infoBox}>
                    <InfoIcon />
                    <span>
                      Respuesta incorrecta pero al leer la respuesta se siente
                      familiar 🤔.
                    </span>
                  </div>
                </div>

                <div className="score__buttons">
                  <button
                    className={popupStyles.scoreBtn2}
                    onClick={(e) => {
                      handleNextCard(2);
                      e.target.blur();
                    }}
                    disabled={!flipCard}
                  >
                    Regular <span>🙂</span>
                  </button>
                  <div className={componentsStyles.infoBox}>
                    <InfoIcon />
                    <span>
                      Respuesta correcta pero con dificultad de recordar 😵.
                    </span>
                  </div>
                </div>

                <div className="score__buttons">
                  <button
                    className={popupStyles.scoreBtn3}
                    onClick={(e) => {
                      handleNextCard(3);
                      e.target.blur();
                    }}
                    disabled={!flipCard}
                  >
                    Bien<span>😎</span>
                  </button>
                  <div className={componentsStyles.infoBox}>
                    <InfoIcon />
                    <span>
                      Respuesta correcta despues de un poco de tiempo pensando
                      😅.
                    </span>
                  </div>
                </div>

                <div className="score__buttons">
                  <button
                    className={popupStyles.scoreBtn4}
                    onClick={(e) => {
                      handleNextCard(4);
                      e.target.blur();
                    }}
                    disabled={!flipCard}
                  >
                    Muy bien<span>🤩</span>
                  </button>
                  <div className={componentsStyles.infoBox}>
                    <InfoIcon />
                    <span>Respuesta correcta a la perfección 🤓.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={popupStyles.buttons}>
          {stage === 0 ? (
            <button
              className={popupStyles.primaryButton}
              onClick={(e) => {
                handleStartSession();
                e.target.blur();
              }}
              disabled={cardsForStudying?.length === 0}
            >
              Comenzar sesión
              <RightArrowIcon />
            </button>
          ) : (
            <button disabled={true}>
              Comenzar sesión
              <RightArrowIcon />
            </button>
          )}

          <button onClick={closeForm} className={popupStyles.cancelBtn}>
            <BackIcon />
            Cancelar
          </button>
        </div>
      </div>

      <style jsx>{`
        .is-open {
          display: grid !important;
          backdrop-filter: blur(3px);
        }

        .${popupStyles.window} {
          max-width: 1000px;
        }

        .${popupStyles.window} h1 {
          white-space: nowrap;
        }

        .${decksStyles.cards__groups} {
          margin-top: 35px;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          background-color: transparent;
        }

        .${decksStyles.cards__groups} > div {
          flex-direction: row;
        }

        .${decksStyles.cards__groups} > div > span {
          padding: 0;
          // padding-rigth: 0.5em;
        }

        .${decksStyles.cards__groups} > div > p {
          white-space: nowrap;
          font-size: 1.6rem;
        }

        .${popupStyles.form} {
          flex-direction: row;
          gap: 3em;
          flex-wrap: wrap;
          height: 560px;
          max-height: 80%;
          overflow-y: auto;
        }

        .${popupStyles.form} > div:first-child {
          flex: 1;
        }

        .sessionConfig {
          margin-left: auto;
          margin-right: auto;
        }

        .subLevel {
          margin-left: 2.5em;
          margin-top: 2em;
        }

        .sessionConfig__box {
          position: relative;
          margin-top: 20px;
        }

        // .sessionConfig__box::before {
        //   content: "";
        //   position: absolute;
        //   display: block;
        //   z-index: -1;
        //   height: 90%;
        //   width: 1px;
        //   left: 7px;
        //   top: 25px;
        //   background: rgba(0, 0, 0, 0.1);
        // }

        // #formStageOne {
        //   ${stage === 0 ? "display: flex" : "display:none"}
        // }

        // #formStageTwo {
        //   ${stage === 1 ? "display: flex" : "display:none"}
        // }

        #formStageTwo {
          padding-top: 2em;
        }

        #formStageTwo:focus-visible {
          outline: none;
          position: relative;
        }

        #formStageTwo::before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 2.5em;
          width: calc(
            ${cardsForSession
                ? (100 / (cardsForSession.length - 1)) * cardIndex
                : 0}% - 5em
          );
          height: 4px;
          background: #21a047;
          box-shadow: 5px 5px 6px rgba(0, 0, 0, 0.1);
          opacity: 0.3;
          border-radius: 50px;
          transition: width 1s ease-in-out;
        }

        .card {
          max-width: 600px;
          display: flex;
          width: 100%;
          position: relative;
          height: 100%;
          margin: auto;
          flex: unset !important;
        }

        .frontCard,
        .backCard {
          width: 100%;
          height: 100%;
          overflow-y: auto;
        }

        .frontCard {
          display: ${flipCard ? "none" : "block"};
        }

        .backCard {
          display: ${flipCard ? "block" : "none"};
        }

        .panel {
          display: flex;
          flex-direction: column;
          gap: 2em;
          flex: 1;
        }

        .score {
          margin-top: auto;
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 1em;
          align-items: stretch;
        }

        .score > button {
          white-space: nowrap;
          width: 100%;
        }

        .score__buttons {
          display: flex;
          gap: 1em;
          justify-content: space-between;
          align-items: center;
        }

        .score__buttons > button {
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

export default StudyCardsWindow;
