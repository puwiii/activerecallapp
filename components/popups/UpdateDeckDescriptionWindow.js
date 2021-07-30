import React, { useState, useEffect } from "react";

//styles
import popupStyles from "styles/Popup.module.scss";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";

//firebase
import { updateDeckDescription } from "firebase/client";

function UpdateDeckDescriptionWindow({
  isOpen,
  closeWindow,
  deckId,
  description,
}) {
  const [newDescription, setNewDescription] = useState(description);
  const [loading, setLoading] = useState(false);

  const updateDescription = (e) => {
    e.preventDefault();
    setLoading(true);
    updateDeckDescription(deckId, newDescription)
      .then(() => {
        closeForm();
      })
      .catch((error) => {
        updateDeckDescriptionErrorMsg.innerText = error;
        updateDeckDescriptionErrorMsg.style.display = "block";
      });
  };

  const closeForm = () => {
    updateDeckDescriptionForm.reset();
    updateDeckDescriptionErrorMsg.style.display = "none";
    closeWindow();
  };

  useEffect(() => {
    updateDeckDescriptionInput.select();
  }, []);

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}
        <h1 className={popupStyles.title}>Cambiar descripción</h1>

        <form className={popupStyles.form} id="updateDeckDescriptionForm">
          <label>
            Nueva descripción del mazo{" "}
            <span className={popupStyles.required}>*</span>
          </label>
          <textarea
            defaultValue={description}
            rows={4}
            type="text"
            placeholder="Ingresa una descripción"
            aria-label="Ingresa una descripción"
            className={popupStyles.inputRounded}
            onChange={(e) => setNewDescription(e.target.value.trim())}
            id="updateDeckDescriptionInput"
          />
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
