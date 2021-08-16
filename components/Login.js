import React, { useState, useEffect } from "react";
import Link from "next/link";

//styles
import styles from "styles/Signin.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

import { auth } from "firebase/client";
import { useRouter } from "next/router";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import GmailButton from "components/GmailButton";

//hooks
import useUser from "hooks/useUser";
import useInput from "hooks/useInput";

//icons
import RightArrowIcon from "icons/RightArrowIcon";
import LogoIcon from "icons/Logo";

function index() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  let user = useUser();

  const [userEmail, Input] = useInput("Correo Electrónico", {
    type: "email",
    name: "username",
    autoComplete: "email",
    id: "username",
  });

  const [userPassword, PasswordInput] = useInput("Contraseña", {
    type: "password",
    name: "password",
    autoComplete: "password",
    id: "password",
  });

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
      {loading ? (
        <SpinnerComponentCircle />
      ) : (
        <>
          <div className={styles.text}>
            <h1>¡Hola, que gusto verte! 👋</h1>
            <h2>Esperamos que Liza te este ayudando 😊.</h2>
          </div>
          <form className={styles.form}>
            {Input}
            {PasswordInput}

            <span id="ErrorMsg" className={styles.ErrorMsg}></span>
            <div className={styles.buttonsBox}>
              <button
                type="submit"
                className={styles.roundedButtonFilled}
                onClick={(e) => login(e)}
              >
                Iniciar sesión <RightArrowIcon />
              </button>

              {/* <a href="">¿Has olvidado tu contraseña?</a> */}
              <GmailButton />

              <Link href="signin/createaccount">
                <a className={styles.roundedButtonTerciary}>
                  Registrarme a Liza <LogoIcon height={21} />
                </a>
              </Link>
              <a href="">¿Has olvidado tu contraseña?</a>
            </div>
          </form>
        </>
      )}
    </div>
    //     </div>
    // </div>
  );
}

export default index;
