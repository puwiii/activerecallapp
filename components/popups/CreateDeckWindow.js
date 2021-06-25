import React, { useState, useEffect } from "react";
import Head from "next/head";

//firebase
import { createDeck } from "firebase/client";

//styles
import popupStyles from 'styles/Popup.module.scss'
import styles from "/styles/Global.module.scss";

//components
import RightArrowIcon from "components/icons/RightArrowIcon";
import BackIcon from "components/icons/BackIcon";
import InfoIcon from "components/icons/InfoIcon";

function CreateDeckWindow({ isOpen, closeWindow, id }) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  
  const closeForm = (e) => {
    e.preventDefault();
    //const form = document.getElementById("form");
    form.reset()
    setDeckDescription("");
    setDeckName("");
    closeWindow();
  };

  const crearMazo = (e) => {
    form.reset();
    e.preventDefault();
    createDeck(id, deckName.trim(), deckDescription.trim())
      .then(() => {
        setDeckDescription("");
        setDeckName("");
        closeWindow();
      })
      .catch(alert);
  };

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
          <title>Crear nuevo mazo</title>
        </Head>
      )}
      <div className={popupStyles.window}>
        <h1 className={popupStyles.title}>Crear mazo</h1>
        <form className={popupStyles.form} id="form">
          <label htmlFor="deckName">Nombre del mazo <span className={popupStyles.required}>*</span></label>
          <input
            type="text"
            placeholder="Ingrese un nombre"
            className={styles.inputRounded}
            onChange={(e) => setDeckName(e.target.value)}
            name="deckName"
          />
          <label htmlFor="deckDescription">Descripcion del mazo</label>
          <textarea
            type="text"
            placeholder="Puedes agregar una pequeña descripción"
            rows={5}
            className={styles.inputRounded}
            onChange={(e) => setDeckDescription(e.target.value)}
            name="deckDescription"
          />
          <div className={popupStyles.checkbox}>
            <input type="checkbox" name="isPublic" id="isPublic" />
            <label htmlFor="isPublic">Mazo público</label>
          </div>
        </form>

        <div className={popupStyles.buttons}>
          <button onClick={closeWindow}><BackIcon/>Cancelar</button>
          <button
            className={popupStyles.primaryButton}
            onClick={(e) => crearMazo(e)}
            disabled={!(deckName.trim().length)}
          >
            Crear mazo<RightArrowIcon />
          </button>
        </div>

      </div>
      <style jsx>{`
        .is-open {
          display: grid !important;
        }
      `}</style>
    </div>
  );
}

export default CreateDeckWindow;
