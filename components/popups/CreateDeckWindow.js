import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

//firebase
import { createDeckV2 } from "firebase/client";

//styles
import popupStyles from "styles/Popup.module.scss";
import styles from "styles/Global.module.scss";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import ExploreIcon from "icons/ExploreIcon";
import CloseIcon from "icons/CloseIcon";
import FolderIcon from "icons/FolderIcon";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//hooks
import useInput from "hooks/useInput";

function CreateDeckWindow({ isOpen, closeWindow, deckId }) {
  const [publicDeck, setPublicDeck] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deckName, deckNameInput] = useInput("Nombre del Mazo", {
    type: "text",
    name: "deckName",
    required: true,
    id: "deckName",
  });

  const [deckDescription, deckDescriptionInput] = useInput(
    "Descripción del Mazo",
    {
      type: "text",
      name: "deckDesc",
      id: "deckDesc",
      rows: 5,
    },
    true
  );

  const router = useRouter();

  const closeForm = () => {
    createDeckForm.reset();
    createDeckErrorMsg.style.display = "none";
    closeWindow();
  };

  const crearMazo = (e) => {
    e.preventDefault();

    if (!deckName || deckName?.length === 0) {
      createDeckErrorMsg.innerText = "(*) El mazo debe tener un nombre";
      createDeckErrorMsg.style.display = "block";
      return;
    } else {
      setLoading(true);

      createDeckV2(
        router.query.id ? router.query.id : null,
        deckName,
        deckDescription,
        publicDeck
      )
        .then(() => {
          console.log("created succesfully");
          closeForm();
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {isOpen && (
        <Head>
          <title>Crear nuevo mazo</title>
        </Head>
      )}
      <div className={popupStyles.window}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}
        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>
          <FolderIcon width={32} height={32} /> Crear mazo
        </h1>
        <form className={popupStyles.form} id="createDeckForm">
          {deckNameInput}
          {deckDescriptionInput}
          {/* <label>
            Nombre del mazo <span className={popupStyles.required}>*</span>
          </label>
          <input
            id="createDeckInput"
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
          /> */}
          <div className={popupStyles.checkbox}>
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={publicDeck}
              onChange={(e) => {
                setPublicDeck(!publicDeck);
              }}
            />
            <label htmlFor="isPublic">
              Mazo público
              <ExploreIcon />
            </label>
          </div>
          <span id="createDeckErrorMsg" className={popupStyles.ErrorMsg}></span>
          <button tabIndex="-1" type="submit" onClick={(e) => crearMazo(e)} />
        </form>
        <div className={popupStyles.buttons}>
          <button
            type="submit"
            className={popupStyles.primaryButton}
            onClick={(e) => crearMazo(e)}
            disabled={!deckName.trim().length}
          >
            Crear mazo
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
      `}</style>
    </div>
  );
}

export default CreateDeckWindow;
