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

function CreateDeckWindow({ isOpen, closeWindow, id }) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [loading, setLoading] = useState(false)

  const closeForm = () => {
    
    form.reset()
    ErrorMsg.style.display="none"
    setDeckDescription("");
    setDeckName("");
    closeWindow();
  };

  const crearMazo = (e) => {  
    e.preventDefault();

    
    if(!deckName || deckName?.length === 0){
      ErrorMsg.innerText= "(*) El mazo debe tener un nombre"
      ErrorMsg.style.display="block"
      return
    }else{
      setLoading(true)
      form.reset();
      createDeck(id, deckName.trim(), deckDescription.trim())
      .then(() => {
        setDeckDescription("");
        setDeckName("");
        setLoading(false)
        closeWindow();
      })
      .catch(alert);
    }
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
        {
          loading &&
            <div className={popupStyles.loader}>
              <SpinnerComponentCircle/>
            </div>        
        }
        <h1 className={popupStyles.title}>Crear mazo</h1>
        <form className={popupStyles.form} id="form">
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
          <span id="ErrorMsg" className={popupStyles.ErrorMsg}></span>
          <button
            type="submit"
            onClick={(e) => crearMazo(e)}
          />
        </form>
        <div className={popupStyles.buttons}>
          <button onClick={closeForm}><BackIcon/>Cancelar</button>
          <button
            type="submit"
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
