import React, { useState, useEffect } from "react";
import Head from "next/head";

//firebase
import { createCardV2 } from "firebase/client";

//styles
import popupStyles from "styles/Popup.module.scss";
import styles from "/styles/Global.module.scss";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import DownArrowIcon from "icons/DownArrowIcon";
import ExpandIcon from "icons/ExpandIcon";
import CloseIcon from "icons/CloseIcon";
import CardsIcon from "icons/CardsIcon";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import TextEditor from "components/TextEditor";
import TextEditorV2 from "components/TextEditorV2";

function CreateCardWindow({ isOpen, closeWindow, deckId, cards, setCards }) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const closeForm = () => {
    createCardErrorMsg.style.display = "none";
    setFront("");
    setBack("");
    closeWindow();
  };

  const validateForm = () => {
    if (!front || !back) return false;
    else return true;
  };

  const addCard = (e) => {
    e.preventDefault();
    setLoading(true);
    if (validateForm()) {
      try {
        createCardV2(deckId, front, back).then((card) => {
          setCards([...cards, card]);
          createCardForm.reset();
          setFront("");
          setBack("");
          setLoading(false);
          closeWindow();
        });
      } catch (error) {
        setLoading(false);
        createCardErrorMsg.innerText =
          "(*) Hay un error con el contenido de la tarjeta";
        createCardErrorMsg.style.display = "block";
      }
    } else {
      setLoading(false);
      createCardErrorMsg.innerText =
        "(*) Completa todos los campos de la tarjeta";
      createCardErrorMsg.style.display = "block";
      return;
    }
  };

  const handleFields = (e) => {
    const toggleFields = document.querySelectorAll(
      `.${popupStyles.toggleField}`
    );

    toggleFields.forEach((item) => {
      item.classList.contains(popupStyles.open) &&
        item.classList.remove(popupStyles.open);
    });

    e.target.parentNode.classList.add(popupStyles.open);
  };

  // useEffect(()=>{
  //   createCardInput.focus()
  // },[])

  // useEffect(() => {
  //   // if(!deckName){
  //   //     submitButton.setAttribute('disabled', true)
  //   // }
  //   // else{
  //   //     submitButton.setAttribute('disabled', false)
  //   // }
  // }, [deckName]);

  const toggleMaximized = () => {
    maximized ? setMaximized(false) : setMaximized(true);
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {isOpen && (
        <Head>
          <title>Crear nueva tarjeta</title>
        </Head>
      )}
      <div className={`${popupStyles.window}`}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}

        <button
          className={`${popupStyles.closeBtn} maximizeButton`}
          onClick={(e) => toggleMaximized()}
          title={`${maximized ? "Minimizar" : "Maximizar"}`}
        >
          <ExpandIcon />
        </button>

        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>

        <h1 className={popupStyles.title}>
          <CardsIcon width={32} height={32} /> Crear tarjeta
        </h1>

        <form className={popupStyles.form} id="createCardForm">
          <div className={`${popupStyles.field}`}>
            <label className={popupStyles.form__label}>
              Frente de la tarjeta{" "}
              <span className={popupStyles.required}>*</span>
            </label>
            <TextEditor
              wrapperClassName={styles.inputRounded}
              callback={setFront}
            />
            {/* <TextEditorV2 /> */}
          </div>
          <div className={`${popupStyles.field}`}>
            <label className={popupStyles.form__label}>
              Reverso de la tarjeta{" "}
              <span className={popupStyles.required}>*</span>
            </label>
            <TextEditor
              wrapperClassName={styles.inputRounded}
              callback={setBack}
            />
            {/* <TextEditorV2 /> */}
          </div>
          <span id="createCardErrorMsg" className={popupStyles.ErrorMsg}></span>
        </form>

        <div className={popupStyles.buttons}>
          <button
            type="submit"
            className={popupStyles.primaryButton}
            onClick={(e) => addCard(e)}
            disabled={!front || !back}
          >
            Crear tarjeta
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
        }

        .is-open > div {
          max-width: 800px;
          ${maximized &&
          `
          max-width: none;
          

          `}
        }

        .${popupStyles.form} {
          height: 560px;
          overflow-y: auto;
        }

        .maximizeButton {
          right: 45px;
        }

        .is-open > div > form {
          ${maximized && "flex-direction: row;"}
        }

        // .${popupStyles.toggleField} {
        //   max-height: none;
        // }
      `}</style>
    </div>
  );
}

export default CreateCardWindow;
