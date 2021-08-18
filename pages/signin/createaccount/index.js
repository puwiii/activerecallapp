import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

//styles
import styles from "styles/Signin.module.scss";

//firebase
import { auth, isUsernameAvalaible } from "firebase/client";

//icons
import RightArrowIcon from "icons/RightArrowIcon";

//svgs
import LogoSvg from "svgs/LogoSvg";

//hooks
import useUser from "hooks/useUser";
import useInput from "hooks/useInput";
import LogoIcon from "icons/Logo";
import DoorIcon from "icons/DoorIcon";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

function index() {
  // const [username, setUsername] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  // const [userPassword, setUserPassword] = useState("");
  // const [userRepeatedPassword, setUserRepeatedPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [username, usernameInput] = useInput("Nombre de Usuario", {
    type: "text",
    name: "username",
    required: true,
    autoComplete: "nati",
    id: "createAccountInput",
  });

  const [userEmail, emailInput] = useInput("Correo Electrónico", {
    type: "email",
    name: "email",
    autoComplete: "email",
    required: true,
    id: "email",
  });

  const [userPassword, passwordInput] = useInput("Contraseña", {
    type: "password",
    name: "password",
    autoComplete: "password",
    required: true,
    id: "password",
  });

  const [userRepeatedPassword, repeatedPasswordInput] = useInput(
    "Repetir Contrasñea",
    {
      type: "password",
      name: "repeatPassword",
      autoComplete: "repeatPassword",
      required: true,
      id: "repeatPassword",
    }
  );

  let user = useUser();
  const router = useRouter();

  const register = (e) => {
    setLoading(true);
    e.preventDefault();

    isUsernameAvalaible(username).then((res) => {
      if (res) {
        auth
          .createUserWithEmailAndPassword(userEmail, userPassword)
          .then(() => {
            let user = auth.currentUser;
            user
              .updateProfile({
                displayName: username,
                photoURL:
                  "https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png",
              })
              .then(() => {
                console.log("username created with username");
                router.replace("/signin/emailverification");
              })
              .catch((error) => {
                setLoading(false);
                ErrorMsg.innerText = error.message;
                ErrorMsg.style.display = "block";
              });
          })
          .catch((error) => {
            const ERROR_MESSAGES = {
              "auth/invalid-email":
                "Hmm... revisa el correo ingresado, algo parece estar mal con eso.",
              "auth/weak-password":
                "La contraseña es muy debil, haz que al menos tenga seis caracteres.",
              "auth/email-already-in-use":
                "Parece que este correo ya esta en uso, ¿olvidaste tu contraseña?",
            };
            setLoading(false);
            console.log(error);
            const DEFAULT_ERROR_MESSAGE =
              "Aparentemente hay un error, ponte en contacto con bla bla bla...";

            ErrorMsg.innerText =
              ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE;
            ErrorMsg.style.display = "block";
          });
      } else {
        setLoading(false);
        ErrorMsg.innerText =
          "Ups... este nombre de usuario ya esta en uso. Intenta con otro";
        ErrorMsg.style.display = "block";
      }
    });
  };

  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [user]);

  useEffect(() => {
    // const ErrorMsg = document.getElementById('ErrorMsg')
    if (userRepeatedPassword != userPassword) {
      ErrorMsg.innerText = "Las contraseñas no coinciden";
      ErrorMsg.style.display = "block";
    } else {
      ErrorMsg.style.display = "none";
    }
  }, [userPassword, userRepeatedPassword]);

  return (
    <div className={styles.signin}>
      <Head>
        <title>Registrarte / Liza</title>
      </Head>
      <div className={styles.signin__backgroundDoodles}></div>
      <div className={styles.signin__background}></div>
      <div className={styles.container}>
        <Link href={"/"} passHref={true}>
          <a className={styles.logo} title="Página principal de Liza">
            <LogoSvg width={300} />
          </a>
        </Link>
        <div className={styles.formContainer}>
          {loading ? (
            <SpinnerComponentCircle />
          ) : (
            <>
              <div className={styles.text}>
                <h1>¡Vamos a crear tu cuenta! 😁</h1>
                <h2>
                  Presentate con Liza, ella estará muy feliz de conocerte.
                </h2>
              </div>
              <form className={styles.form}>
                {usernameInput}
                {emailInput}
                {passwordInput}
                {repeatedPasswordInput}
                <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                <div className={styles.buttonsBox}>
                  <button
                    type="submit"
                    className={styles.roundedButtonFilled}
                    id="submitButton"
                    onClick={(e) => register(e)}
                    disabled={
                      userPassword !== userRepeatedPassword ||
                      username === "" ||
                      userEmail === "" ||
                      userPassword === "" ||
                      userRepeatedPassword === ""
                    }
                  >
                    Continuar y crear cuenta
                    <RightArrowIcon />
                  </button>

                  <Link href="/signin" replace={true}>
                    <a className={styles.roundedButtonTerciary}>
                      Ya tengo cuenta, iniciar sesión <DoorIcon />
                    </a>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default index;
