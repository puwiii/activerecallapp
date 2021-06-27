import React, { useState, useEffect } from "react";
import Head from "next/head";

//firebase
import { createCard } from "firebase/client";

//styles
import popupStyles from 'styles/Popup.module.scss'
import styles from "/styles/Global.module.scss";

//components
import RightArrowIcon from "components/icons/RightArrowIcon";
import BackIcon from "components/icons/BackIcon";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

function CreateCardWindow({ isOpen, closeWindow, deckId }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false)

  const closeForm = () => {
    
    createCardForm.reset()
    createCardErrorMsg.style.display="none"
    setFront("");
    setBack("");
    closeWindow();
  };

const validateForm = () =>{
    console.log(front.length)
    console.log(back.length)
   if (front.length && back.length) return true
   else return false
}

const addCard = (e) => {  
    e.preventDefault();
    setLoading(true)
    if(validateForm()){
        createCard(deckId, front, back)
        .then(() => {
            createCardForm.reset();
            setFront("");
            setBack("");
            setLoading(false)
            closeWindow();
        })
        .catch(alert);
    }else{
        createCardErrorMsg.innerText= "(*) Completa todos los campos de la tarjeta"
        createCardErrorMsg.style.display="block"
        return
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
          <title>Crear nueva tarjeta</title>
        </Head>
      )}
      <div className={popupStyles.window}>
        {
          loading &&
            <div className={popupStyles.loader}>
              <SpinnerComponentCircle/>
            </div>        
        }
        <h1 className={popupStyles.title}>Crear tarjeta</h1>
        <form className={popupStyles.form} id="createCardForm">
          <label>Frente de la tarjeta <span className={popupStyles.required}>*</span></label>
          <textarea
            type="text"
            placeholder="Contenido del frente"
            aria-label="Ingrese un contenido para el frente de la tarjeta" 
            rows={5}
            className={styles.inputRounded}
            onChange={(e) => setFront((e.target.value).trim())}
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
            type="submit"
            onClick={(e) => addCard(e)}
          />
        </form>

        <div className={popupStyles.buttons}>
          <button onClick={closeForm}><BackIcon/>Cancelar</button>
          <button
            type="submit"
            className={popupStyles.primaryButton}
            onClick={(e) => addCard(e)}
            disabled={(!(front.trim().length && back.trim().length))}
          >
            Crear tarjeta<RightArrowIcon />
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

export default CreateCardWindow;
