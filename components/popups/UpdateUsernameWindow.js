import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//styles
import popupStyles from "styles/Popup.module.scss";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import CloseIcon from "icons/CloseIcon";

//firebase
import {
  isUsernameAvalaible,
  updateUsernameFromFirebase,
} from "firebase/client";

//hooks
import useInput from "hooks/useInput";

function UpdateUsernameWindow({ isOpen, closeWindow }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [newUsername, newUsernameInput] = useInput("Nuevo nombre de usuario", {
    type: "text",
    name: "newUsernameInput",
    id: "newUsernameInput",
  });

  const updateUsername = (e) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      updateUsernameErrorMsg.innerText =
        "Ups... no puedes no tener nombre de usuario";
      updateUsernameErrorMsg.style.display = "block";
      return;
    }

    setLoading(true);
    isUsernameAvalaible(newUsername).then((res) => {
      if (res) {
        updateUsernameFromFirebase(newUsername).then(() => {
          router.reload();
          closeForm();
        });
      } else {
        updateUsernameErrorMsg.innerText =
          "Ups... este nombre de usuario ya esta en uso";
        updateUsernameErrorMsg.style.display = "block";
        setLoading(false);
      }
    });
  };

  const closeForm = () => {
    updateUsernameForm.reset();
    updateUsernameErrorMsg.style.display = "none";
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
        <h1 className={popupStyles.title}>Cambiar nombre</h1>

        <form className={popupStyles.form} id="updateUsernameForm">
          {newUsernameInput}
          <span
            id="updateUsernameErrorMsg"
            className={popupStyles.ErrorMsg}
          ></span>
          <button
            tabIndex="-1"
            type="submit"
            onClick={(e) => updateUsername(e)}
          />
        </form>

        <div className={popupStyles.buttons}>
          <button
            className={popupStyles.primaryButton}
            onClick={(e) => updateUsername(e)}
            disabled={!newUsername}
          >
            Actualizar
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

export default UpdateUsernameWindow;
