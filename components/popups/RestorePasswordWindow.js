import React, { useState } from "react";

//styles
import popupStyles from "styles/Popup.module.scss";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import BackIcon from "icons/BackIcon";
import CloseIcon from "icons/CloseIcon";
import CheckIcon from "icons/CheckIcon";

//firebase
import { auth } from "firebase/client";

//hooks
import useInput from "hooks/useInput";

function RestorePasswordWindow({ isOpen, closeWindow }) {
  const [email, emailInput] = useInput("Correo Electrónico", {
    type: "email",
    name: "email",
    id: "email",
  });

  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendEmailRestorePassword = (e) => {
    e.preventDefault();
    if (email === "" || !email) {
      restorePasswordErrorMsg.innerText =
        "Ingresa tu correo electronico para restablecer tu contraseña.";
      restorePasswordErrorMsg.style.display = "block";
    } else {
      setLoading(true);
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          restorePasswordForm.reset();
          restorePasswordErrorMsg.style.display = "none";
          setLoading(false);
          setStage(1);
        })
        .catch((error) => {
          console.error(error);
          const ERROR_MESSAGES = {
            "auth/invalid-email":
              "La dirección de correo electrónico no es valida.",
            "auth/user-not-found":
              "No existe ningun usuario registrado con este correo electrónico.",
          };
          const DEFAULT_ERROR_MESSAGE =
            "Ha ocurrido un error, por favor ponte en contacto con bla, bla, bla...";
          restorePasswordErrorMsg.innerText =
            ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE;
          restorePasswordErrorMsg.style.display = "block";
          setLoading(false);
        });
    }
  };

  const closeForm = () => {
    restorePasswordForm.reset();
    restorePasswordErrorMsg.style.display = "none";
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
        <h1 className={popupStyles.title}>🔓 Restaurar contraseña</h1>

        {stage === 1 && (
          <>
            <p className={popupStyles.description}>
              Se ha enviado un correo a <strong>"{email}"</strong> para
              restaurar tu contraseña
            </p>
            <div className={popupStyles.icon + " " + popupStyles.icon__green}>
              <CheckIcon />
            </div>
          </>
        )}
        {stage === 0 && (
          <>
            <p className={popupStyles.description}>
              Ingresa tu email para que podamos mandarte un email de
              restauración de contraseña
            </p>
            <form className={popupStyles.form} id="restorePasswordForm">
              {emailInput}
              <span
                id="restorePasswordErrorMsg"
                className={popupStyles.ErrorMsg}
              ></span>
            </form>
          </>
        )}

        <div className={popupStyles.buttons}>
          {stage === 0 && (
            <>
              <button
                className={popupStyles.primaryButton}
                onClick={(e) => sendEmailRestorePassword(e)}
              >
                Restaurar contraseña
                <RightArrowIcon />
              </button>
              <button onClick={closeForm} className={popupStyles.cancelBtn}>
                <BackIcon />
                Cancelar
              </button>
            </>
          )}

          {stage === 1 && (
            <button className={popupStyles.primaryButton} onClick={closeWindow}>
              Cerrar ventana
              <RightArrowIcon />
            </button>
          )}
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

export default RestorePasswordWindow;
