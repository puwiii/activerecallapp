import React, { useState, useEffect } from "react";
import Head from "next/head";

//firebase
import { createCard, createCardV2 } from "firebase/client";

//styles
import popupStyles from "styles/Popup.module.scss";
import styles from "/styles/Global.module.scss";

//components
import RightArrowIcon from "components/icons/RightArrowIcon";
import BackIcon from "components/icons/BackIcon";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import TextEditor from "components/TextEditor";
import DownArrowIcon from "components/icons/DownArrowIcon";

function CreateCardWindow({ isOpen, closeWindow, deckId }) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);

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
      createCardV2(deckId, front, back)
        .then(() => {
          createCardForm.reset();
          setFront("");
          setBack("");
          setLoading(false);
          closeWindow();
        })
        .catch(alert);
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

    console.log(e);

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

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {isOpen && (
        <Head>
          <title>Crear nueva tarjeta</title>
        </Head>
      )}
      <div className={popupStyles.window}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}
        <h1 className={popupStyles.title}>Crear tarjeta</h1>
        {/* <form className={popupStyles.form} id="createCardForm">
          <label>Frente de la tarjeta <span className={popupStyles.required}>*</span></label>
          <textarea
            type="text"
            placeholder="Contenido del frente"
            aria-label="Ingrese un contenido para el frente de la tarjeta" 
            rows={5}
            className={styles.inputRounded}
            onChange={(e) => setFront((e.target.value).trim())}

            id="createCardInput"
          />
          <label>Reverso de la tarjeta <span className={popupStyles.required}>*</span></label>
          <textarea
            type="text"
            placeholder="Contenido del reverso"
            aria-label="Ingrese un contenido para el reverso de la tarjeta" 
            rows={5}
            className={styles.inputRounded}
            onChange={(e) => setBack((e.target.value).trim())}
          />
          <span id="createCardErrorMsg" className={popupStyles.ErrorMsg}></span>
          <button
            tabIndex="-1"
            type="submit"
            onClick={(e) => addCard(e)}
          />
        </form> */}
        <form className={popupStyles.form} id="createCardForm">
          <div className={`${popupStyles.toggleField} ${popupStyles.open}`}>
            <label onClick={handleFields}>
              Frente de la tarjeta{" "}
              <span className={popupStyles.required}>*</span>
              <DownArrowIcon />
            </label>
            <TextEditor
              wrapperClassName={styles.inputRounded}
              callback={setFront}
            />
          </div>
          <div className={popupStyles.toggleField}>
            <label onClick={handleFields}>
              Reverso de la tarjeta{" "}
              <span className={popupStyles.required}>*</span>
              <DownArrowIcon />
            </label>
            <TextEditor
              wrapperClassName={styles.inputRounded}
              callback={setBack}
            />
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
          <button onClick={closeForm}>
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
        }
      `}</style>
    </div>
  );
}

export default CreateCardWindow;
