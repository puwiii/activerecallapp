import React, { useState, useEffect } from "react";
import styles from "styles/Signin.module.scss";

import { auth } from "firebase/client";
import { useRouter } from "next/router";

import GmailButton from "components/GmailButton";

import useUser from "hooks/useUser";
import RightArrowIcon from "icons/RightArrowIcon";

import SpinnerComponentCircle from "components/SpinnerComponentCircle";

function index() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  let user = useUser();

  useEffect(() => {
    if (user) {
      if (auth.currentUser.emailVerified === false) {
        router.push("/signin/emailverification");
      } else {
        router.replace("/");
      }
    }
  }, [user]);

  useEffect(() => {
    loginInput.focus();
  }, []);

  const login = (e) => {
    e.preventDefault();

    if (!userEmail) {
      ErrorMsg.innerText = "El email no puede estar vacio";
      ErrorMsg.style.display = "block";
      return;
    }

    if (!userPassword) {
      ErrorMsg.innerText = "La contraseña no puede estar vacia";
      ErrorMsg.style.display = "block";
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
        const ERROR_MESSAGES = {
          "auth/user-not-found":
            "No se ha encontrado un usuario registrado con ese Email.",
          "auth/wrong-password":
            "La contraseña y/o el email no son validos, verifique los datos ingresados.",
        };

        const DEFAULT_ERROR_MESSAGE =
          "Aparentemente hay un error, ponte en contacto con bla bla bla...";

        ErrorMsg.innerText =
          ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE;
        ErrorMsg.style.display = "block";
      });
  };

  return (
    // <div className={styles.signin}>
    //     <div className={styles.container}>
    //
    <div className={styles.formContainer}>
      <div className={styles.text}>
        <h1 className={styles.subtitle}>¡Hola, otra vez tú!</h1>
        <h2 className={styles.subtitle}>
          Esperamos que Liza te este ayudando 😊
        </h2>
      </div>
      <form className={styles.form}>
        <input
          type="email"
          name="username"
          placeholder="Ingresa tu email"
          aria-label="Ingresa tu email"
          autoComplete="username"
          className={styles.inputRounded}
          onChange={(e) => setUserEmail(e.target.value)}
          id="loginInput"
        />
        <input
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          aria-label="Ingresa tu contraseña"
          autoComplete="current-password"
          //autoComplete="current-password"
          className={styles.inputRounded}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <span id="ErrorMsg" className={styles.ErrorMsg}></span>
        <div className={styles.buttonsBox}>
          {loading ? (
            <SpinnerComponentCircle />
          ) : (
            <button
              type="submit"
              className={styles.roundedButtonFilled}
              onClick={(e) => login(e)}
            >
              Iniciar sesión <RightArrowIcon />
            </button>
          )}
          {/* <a href="">¿Has olvidado tu contraseña?</a> */}
          {/* <GmailButton/> */}
        </div>
      </form>
    </div>
    //     </div>
    // </div>
  );
}

export default index;
