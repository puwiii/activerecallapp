import React, { useState, useEffect } from "react";
import CloseIcon from "./icons/CloseIcon";
import Head from "next/head";
import RightArrowIcon from "./icons/RightArrowIcon";
import styles from "/styles/Global.module.scss";
import { createDeck, findUsersDecks } from "firebase/client";

function CreateDeckWindow({ isOpen, closeWindow }) {
  const [deckName, setDeckName] = useState();
  const [deckDescription, setDeckDescription] = useState();
  const closeForm = (e) => {
    e.preventDefault();
    closeWindow();
  };

  const crearMazo = (e) => {
    form.reset();
    e.preventDefault();
    createDeck(deckName, deckDescription)
      .then(() => {
        const form = document.getElementById("form");
        setDeckDescription("");
        setDeckName("");
        closeWindow();
      })
      .catch(alert);
  };

  useEffect(() => {
    // if(!deckName){
    //     submitButton.setAttribute('disabled', true)
    // }
    // else{
    //     submitButton.setAttribute('disabled', false)
    // }
  }, [deckName]);

  return (
    <div className={`modal ${isOpen && "is-open"}`}>
      {isOpen && (
        <Head>
          <title>Crear nuevo mazo</title>
        </Head>
      )}
      <div className="bg"></div>
      <form id="form">
        <button className="closeBtn" onClick={(e) => closeForm(e)}>
          <CloseIcon />
        </button>
        <h1>Creando mazo</h1>
        <input
          type="text"
          placeholder="Nombre del mazo"
          className={styles.inputRounded}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Puedes agregar una pequeña descripción"
          rows={5}
          className={styles.inputRounded}
          onChange={(e) => setDeckDescription(e.target.value)}
        />
        <div>
          <input type="checkbox" name="isPublic" id="isPublic" />
          <label htmlFor="isPublic">Mazo público</label>
        </div>

        <button
          className={styles.roundedButtonFilled}
          onClick={(e) => crearMazo(e)}
          disabled={!deckName}
        >
          Crear mazo
          <RightArrowIcon />
        </button>
      </form>

      <style jsx>{`
        .modal {
          z-index: 1000;
          background: rgba(0,0,0,.2);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          place-items: center;
          cursor: not-allowed;
        }

        .bg{
          content="";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .is-open {
          display: grid;
        }

        .closeBtn {
          position: absolute;
        }

        form {
          box-shadow: 0px 5px 10px rgba(0,0,0,.1);
          position: relative;
          cursor: default;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          display: flex;
          flex-direction: column;
          min-width: 290px;
          width: 90%;
          max-width: 490px;
        }

        h1 {
          margin-bottom: 20px;
          font-size: 18px;
        }

        input,
        textarea {
          padding: 10px;
          margin: 5px 0;
        }

        textarea {
          resize: none;
        }

        input[type="checkbox"] {
          margin: 0 10px;
          transform: scale(1.5);
        }

        label {
          font-size: 12px;
          font-weight: 500;
        }

        form > div {
          padding: 10px 0;
          display: flex;
          align-items: center;
        }

        button {
          align-self: flex-end;
        }

        svg {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}

export default CreateDeckWindow;
