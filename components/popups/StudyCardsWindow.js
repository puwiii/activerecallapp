import React, { useState, useEffect } from "react";

//styles
import popupStyles from "styles/Popup.module.scss";
import decksStyles from "styles/Decks.module.scss";

//icons
import CloseIcon from "icons/CloseIcon";
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import MinusIcon from "icons/minusIcon";
import PlusIcon from "icons/PlusIcon";

//components
import ScreenLoadingComponent from "components/ScreenLoadingComponent";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

function StudyCardsWindow({ isOpen, closeWindow, cards }) {
  const [stage, setStage] = useState(0);
  const [newCards, setNewCards] = useState(null);
  const [learningCards, setLearningCards] = useState(null);
  const [reviewingCards, setReviewingCards] = useState(null);
  const [limitCards, setLimitCards] = useState(false);
  const [prioritizeCards, setPrioritizeCards] = useState(false);

  const [cardsForSession, setCardsForSession] = useState(null);

  let mounted;

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

        setCardsForSession(cardsForStudy);
        setNewCards(created);
        setLearningCards(studied);
        setReviewingCards(learned);
      }
    }

    return () => {
      setNewCards(0);
      setLearningCards(0);
      setReviewingCards(0);
      mounted = false;
    };
  }, []);

  const closeForm = () => {
    closeWindow();
  };

  const handleLimitNumber = () => {
    if (limitNumber.value < 1) limitNumber.value = 1;
    if (limitNumber.value > cardsForSession.length)
      limitNumber.value = cardsForSession.length;
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>¡A estudiar!</h1>
        <div className={popupStyles.form}>
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
                <input
                  type="checkbox"
                  id="limitCards"
                  name="limitCards"
                  checked={limitCards}
                  onChange={(e) => {
                    setLimitCards(!limitCards);
                  }}
                />
                <label htmlFor="limitCards">Limitar numeros de tarjetas</label>
              </div>
              <div className="subLevel">
                <div className={popupStyles.field}>
                  <label htmlFor="limitNumber">
                    Numero maximo de tarjetas para esta sesión
                  </label>
                  <div className={popupStyles.inputNumber}>
                    <button
                      onClick={(e) => {
                        limitNumber.value--;
                        handleLimitNumber();
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
                      max={cardsForSession?.length}
                      defaultValue={cardsForSession?.length}
                      onBlur={handleLimitNumber}
                      disabled={!limitCards}
                    />
                    <button
                      onClick={(e) => {
                        limitNumber.value++;
                        handleLimitNumber();
                      }}
                      disabled={!limitCards}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className={popupStyles.field}>
                  <div className={popupStyles.checkbox}>
                    <input
                      type="checkbox"
                      id="priorizeCards"
                      name="priorizeCards"
                      checked={prioritizeCards}
                      onChange={(e) => {
                        setPrioritizeCards(!prioritizeCards);
                      }}
                      disabled={!limitCards}
                    />
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
                      />
                      <label htmlFor="reviewingCardsRadio">Respasando</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={popupStyles.buttons}>
          <button className={popupStyles.primaryButton}>
            Comenzar sesión
            <RightArrowIcon />
          </button>
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
          // flex: 1;
        }

        .${decksStyles.cards__groups} > div {
          flex-direction: row;
          // flex: 1;
        }

        .${decksStyles.cards__groups} > div > span {
          padding: 0;
          // padding-rigth: 0.5em;
        }

        .${decksStyles.cards__groups} > div > p {
          white-space: nowrap;
        }

        .${popupStyles.form} {
          // display: flex;
          flex-direction: row;
          gap: 2em;
          padding-top: 4em;
          flex-wrap: wrap;
          height: 560px;
          max-height: 80%;
          overflow-y: auto;
          // flex: 1;
        }

        .${popupStyles.form} > div:first-child {
          flex: 1;
        }

        .sessionConfig {
          //margin-left: auto;
        }

        .subLevel {
          margin-left: 2.5em;
          margin-top: 2em;
        }

        .sessionConfig__box {
          position: relative;
          margin-top: 20px;
        }

        .sessionConfig__box::before {
          content: "";
          position: absolute;
          display: block;
          height: 90%;
          width: 1px;
          left: 7px;
          top: 27px;
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default StudyCardsWindow;
