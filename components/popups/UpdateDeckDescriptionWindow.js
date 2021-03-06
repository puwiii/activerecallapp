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
import { updateDeckDescription } from "firebase/client";

//hooks
import useInput from "hooks/useInput";

function UpdateDeckDescriptionWindow({
  isOpen,
  closeWindow,
  deckId,
  description,
}) {
  const [loading, setLoading] = useState(false);

  const [newDescription, newDescriptionInput] = useInput(
    "Nueva descripción del mazo",
    {
      rows: 5,
      type: "text",
      name: "newDescriptionInput",
      id: "newDescriptionInput",
    },
    true
  );

  const updateDescription = (e) => {
    e.preventDefault();
    if (newDescription.trim() === description) {
      updateDeckNameErrorMsg.innerText = "Este mazo ya tiene esta descripción.";
      updateDeckNameErrorMsg.style.display = "block";
    } else {
      setLoading(true);

      updateDeckDescription(deckId, newDescription)
        .then(() => {
          closeForm();
        })
        .catch((error) => {
          setLoading(false);
          updateDeckDescriptionErrorMsg.innerText = error;
          updateDeckDescriptionErrorMsg.style.display = "block";
        });
    }
  };

  const closeForm = () => {
    updateDeckDescriptionForm.reset();
    updateDeckDescriptionErrorMsg.style.display = "none";
    closeWindow();
  };

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
        <h1 className={popupStyles.title}>Cambiar descripción</h1>

        <form className={popupStyles.form} id="updateDeckDescriptionForm">
          {newDescriptionInput}
          <span
            id="updateDeckDescriptionErrorMsg"
            className={popupStyles.ErrorMsg}
          ></span>
          <button
            tabIndex="-1"
            type="submit"
            onClick={(e) => updateDescription(e)}
          />
        </form>

        <div className={popupStyles.buttons}>
          <button
            className={popupStyles.primaryButton}
            onClick={(e) => updateDescription(e)}
          >
            Cambiar descripción
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

export default UpdateDeckDescriptionWindow;
