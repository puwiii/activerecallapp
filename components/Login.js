import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//styles
import styles from "styles/Signin.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

//firebase
import { auth, getUserByEmail } from "firebase/client";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import GmailButton from "components/GmailButton";

//popups
import RestorePasswordWindow from "components/popups/RestorePasswordWindow";

//hooks
import useUser from "hooks/useUser";
import useInput from "hooks/useInput";
import { useModal } from "hooks/useModal";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import LogoIcon from "icons/Logo";

function index() {
  const [isOpenPopup, openPopup, closePopup] = useModal(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [firestoreUser, setFirestoreUser] = useState(undefined);
  const router = useRouter();
  let user = useUser();

  const [userEmail, Input, userEmailSetFocus] = useInput("Correo Electrónico", {
    type: "email",
    name: "username",
    autoComplete: "email",
    id: "username",
  });

  const [userPassword, PasswordInput, passwordInputSetFocus] = useInput(
    "Contraseña",
    {
      type: "password",
      name: "password",
      autoComplete: "password",
      id: "password",
    }
  );

  useEffect(() => {
    if (user) {
      if (auth.currentUser.emailVerified === false) {
        router.push("/signin/emailverification");
      } else {
        router.replace("/");
      }
    }
  }, [user]);

  const login = (e) => {
    e.preventDefault();

    if (!userEmail) {
      ErrorMsg.innerText = "El email no puede estar vacio";
      ErrorMsg.style.display = "block";
      userEmailSetFocus();
      return;
    }

    if (!userPassword) {
      ErrorMsg.innerText = "La contraseña no puede estar vacia";
      ErrorMsg.style.display = "block";
      passwordInputSetFocus();
      return;
    }

    setLoading(true);

    auth
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then((cred) => {
        if (cred.user.emailVerified === true) {
          router.replace("/");
        } else {
          router.push("/signin/emailverification");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        const ERROR_MESSAGES = {
          "auth/user-not-found":
            "No se ha encontrado un usuario registrado con ese Email.",
          "auth/wrong-password":
            "La contraseña y/o el email no son validos, verifique los datos ingresados.",
          "auth/invalid-email":
            "La caja de email tiene un problema, revisa si lo has escrito bien.",
        };

        const DEFAULT_ERROR_MESSAGE = `Aparentemente hay un error, ponte en contacto con "sebastian.mathieur@gmail.com"`;

        ErrorMsg.innerText =
          ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE;
        ErrorMsg.style.display = "block";
      });
  };

  const handleRestorePassword = (e) => {
    e.preventDefault();
    // setLoading(true);
    // try {
    //   console.log(userEmail);
    //   getUserByEmail(userEmail).then((user) => {

    //     if(user){
    //       setFirestoreUser(user);
    //     }

    //     setLoading(false);
    //   });
    // } catch (error) {
    //   ErrorMsg.innerText = error;
    //   ErrorMsg.style.display = "block";
    //   setLoading(false);
    // }
  };

  return (
    // <div className={styles.signin}>
    //     <div className={styles.container}>
    //
    <div className={styles.formContainer}>
      {loading ? (
        <SpinnerComponentCircle />
      ) : (
        <>
          {isOpenPopup && (
            <RestorePasswordWindow
              isOpen={isOpenPopup}
              closeWindow={closePopup}
            />
          )}
          <div className={styles.text}>
            <h1>👋 ¡Hola, que gusto verte!</h1>
            <h2>Esperamos que Liza te este ayudando 😊.</h2>
          </div>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* {stage === 0 && Input}
            {stage === 1 && (
              <>
                PasswordInput
                <button onClick={(e) => handleRestorePassword(e)}>
                  He olvidado mi contraseña
                </button>
              </>
            )} */}
            {Input}
            {PasswordInput}

            <span id="ErrorMsg" className={styles.ErrorMsg}></span>
            <div className={styles.buttonsBox}>
              <label htmlFor="recoverPassword" className="lblButton">
                He olvidado mi contraseña
                <input
                  type="button"
                  onClick={openPopup}
                  tabIndex={-1}
                  name="recoverPassword"
                  id="recoverPassword"
                />
              </label>

              {/* {stage === 0 && (
                <button
                  type="submit"
                  className={styles.roundedButtonFilled}
                  onClick={(e) => handleEmail(e)}
                >
                  Continuar <RightArrowIcon />
                </button>
              )} */}
              {stage === 0 && (
                <button
                  type="submit"
                  className={styles.roundedButtonFilled}
                  onClick={(e) => login(e)}
                >
                  Iniciar sesión <RightArrowIcon />
                </button>
              )}

              {/* <a href="">¿Has olvidado tu contraseña?</a> */}
              <GmailButton />
              <Link href="/signin/createaccount" replace={true}>
                <a>¿No tienes cuenta? Registrarme</a>
              </Link>
            </div>
          </form>
        </>
      )}
      <style jsx>{`
        input[type="button"] {
          display: none;
        }

        .lblButton {
          cursor: pointer;
        }
      `}</style>
    </div>
    //     </div>
    // </div>
  );
}

export default index;
