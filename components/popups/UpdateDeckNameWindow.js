import React, { useState, useEffect } from "react";

//styles
import popupStyles from "styles/Popup.module.scss";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import CloseIcon from "icons/CloseIcon";

//firebase
import { updateDeckName } from "firebase/client";

//hooks
import useInput from "hooks/useInput";

function UpdateDeckNameWindow({ isOpen, closeWindow, deckId, deckName }) {
  const [newName, setNewName] = useState(deckName);

  // const [newName, newNameInput] = useInput()

  const [loading, setLoading] = useState(false);

  const updateName = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      updateDeckNameErrorMsg.innerText =
        "(*) Ups... no puedes dejar el nombre vacio";
      updateDeckNameErrorMsg.style.display = "block";
    } else {
      setLoading(true);
      updateDeckName(deckId, newName)
        .then(() => {
          closeForm();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const closeForm = () => {
    updateDeckNameForm.reset();
    updateDeckNameErrorMsg.style.display = "none";
    closeWindow();
  };

  useEffect(() => {
    updateDeckNameInput.focus();
    updateDeckNameInput.select();
  }, []);

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}
        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>Cambiar nombre</h1>

        <form className={popupStyles.form} id="updateDeckNameForm">
          <label>
            Nuevo nombre del mazo{" "}
            <span className={popupStyles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="Ingresa un nombre"
            defaultValue={deckName}
            aria-label="Ingresa un nombre"
            className={popupStyles.inputRounded}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            id="updateDeckNameInput"
          />
          <span
            id="updateDeckNameErrorMsg"
            className={popupStyles.ErrorMsg}
          ></span>
          <button tabIndex="-1" type="submit" onClick={(e) => updateName(e)} />
        </form>

        <div className={popupStyles.buttons}>
          <button
            disabled={!newName.trim()}
            className={popupStyles.primaryButton}
            onClick={(e) => updateName(e)}
          >
            Cambiar nombre
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

export default UpdateDeckNameWindow;
