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
import ExploreIcon from "components/icons/ExploreIcon";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

function UpdateDeckWindow({ isOpen, closeWindow, deckId }) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [loading, setLoading] = useState(false)

  const closeForm = () => {
    createDeckForm.reset()
    createDeckErrorMsg.style.display="none"
    setDeckDescription("");
    setDeckName("");
    closeWindow();
  };


  return (

    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {isOpen && (
        <Head>
          <title>Editar mazo</title>
        </Head>
      )}
      <div className={popupStyles.window}>
        {
          loading &&
            <div className={popupStyles.loader}>
              <SpinnerComponentCircle/>
            </div>        
        }
        <h1 className={popupStyles.title}>Editar mazo</h1>
        <form className={popupStyles.form} id="createDeckForm">
          <label>Nombre del mazo <span className={popupStyles.required}>*</span></label>
          <input
            type="text"
            placeholder="Ingrese un nombre"
            aria-label="Ingresa un nombre" 
            className={styles.inputRounded}
            onChange={(e) => setDeckName(e.target.value)}
          />
          <label>Descripción del mazo</label>
          <textarea
            type="text"
            placeholder="Puedes agregar una pequeña descripción"
            aria-label="Puedes agregar una pequeña descripción" 
            rows={5}
            className={styles.inputRounded}
            onChange={(e) => setDeckDescription(e.target.value)}
          />
          <div className={popupStyles.checkbox}>
            <input type="checkbox" id="isPublic" name="isPublic"/>
            <label htmlFor="isPublic">Mazo público<ExploreIcon/></label>
          </div>
          <span id="createDeckErrorMsg" className={popupStyles.ErrorMsg}></span>
          <button
            tabIndex="-1"
            type="submit"
            onClick={(e) => crearMazo(e)}
          />
        </form>
        <div className={popupStyles.buttons}>   
          <button
            type="submit"
            className={popupStyles.primaryButton}
            onClick={(e) => crearMazo(e)}
            disabled={!(deckName.trim().length)}
          >
            Crear mazo<RightArrowIcon />
          </button>
          <button onClick={closeForm}><BackIcon/>Cancelar</button>
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

export default UpdateDeckWindow;
