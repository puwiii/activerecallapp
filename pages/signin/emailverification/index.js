import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

//styles
import styles from "styles/Signin.module.scss";

//firebase
import { auth, saveUserInFirestore } from "firebase/client";
import { useRouter } from "next/router";

//icons
import SpinnerComponent from "components/SpinnerComponent";

//components
import AirplaneIcon from "icons/AirplaneIcon";
import RightArrowIcon from "icons/RightArrowIcon";

//hooks
import useUser, { USER_STATES } from "hooks/useUser";
import LogoSvg from "svgs/LogoSvg";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";
import LogoIcon from "icons/Logo";
import DoorIcon from "icons/DoorIcon";

function index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  let user = useUser();

  useEffect(() => {
    if (user) {
      if (auth.currentUser.emailVerified === true) {
        saveUserInFirestore(auth.currentUser);
        router.replace("/");
      } else {
        setLoading(false);
        setTimeout(() => {
          ErrorMsg.style.borderColor = "#c43d3d30";
          ErrorMsg.style.background = "#c43d3d0f";
          ErrorMsg.style.color = "#c43d3d";
          ErrorMsg.innerText = "El email no se ha verificado aรบn ๐ช";
          ErrorMsg.style.display = "block";
        }, [1000]);
      }
    }

    if (user === USER_STATES.NOT_LOGGED) router.back();
  }, [user]);

  const resendEmailVerification = (e) => {
    e.preventDefault();
    auth.currentUser
      .sendEmailVerification()
      .then(() => {
        ErrorMsg.style.borderColor = "#21a04730";
        ErrorMsg.style.background = "#21a0470f";
        ErrorMsg.style.color = "#21a047";
        ErrorMsg.innerText = "Revisa tu bandeja de entrada ๐ฌ";
        ErrorMsg.style.display = "block";
      })
      .catch((e) => {
        const ERROR_MESSAGES = {
          "auth/too-many-requests":
            "Ya se ha enviado el email, revisa en tu correo no deseado ๐.",
          "auth/wrong-password":
            "La contraseรฑa y/o el email no son validos, verifique los datos ingresados.",
        };
        ErrorMsg.style.borderColor = "#c43d3d30";
        ErrorMsg.style.background = "#c43d3d0f";
        ErrorMsg.style.color = "#c43d3d";
        ErrorMsg.innerText =
          ERROR_MESSAGES[e.code] || "Error, por favor intente de nuevo";
        ErrorMsg.style.display = "block";
      });
  };

  const logout = () => {
    auth.signOut();
  };

  const checkForVerification = (e) => {
    e.preventDefault();
    router.reload(window.location.pathname);
  };

  return (
    <div className={styles.signin}>
      <Head>
        <title>Verificacion de email / Liza</title>
      </Head>
      <div className={styles.signin__backgroundDoodles}></div>
      <div className={styles.signin__background}></div>
      <div className={styles.container}>
        <Link href={"/"} passHref={true}>
          <a className={styles.logo} title="Pรกgina principal de Liza">
            <LogoSvg width={300} />
          </a>
        </Link>
        <div className={styles.formContainer}>
          {loading ? (
            <SpinnerComponentCircle />
          ) : (
            <>
              <div className={styles.text}>
                <h1>
                  Hola {user?.username ? user.username : <SpinnerComponent />}
                </h1>
                <h2>
                  <strong>
                    Te damos la bienvenida a la comunidad de Liza ๐
                  </strong>
                </h2>
                <br />
                <h2>Primero tenemos que verificar tu email ๐</h2>
                <br />
                <h2>
                  Cuando estes listo presiona
                  <strong> "Enviar email de verificaciรณn"</strong> para que
                  enviemos un email a tu cuenta
                  <strong>
                    {" "}
                    {user?.email ? user.email : <SpinnerComponent />}
                  </strong>
                </h2>
              </div>

              <form className={styles.form}>
                <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                <div className={styles.buttonsBox}>
                  <button
                    className={styles.roundedButtonTerciary}
                    onClick={(e) => resendEmailVerification(e)}
                  >
                    Enviar email de verificaciรณn <AirplaneIcon />{" "}
                  </button>
                  <button
                    className={styles.roundedButtonFilled}
                    onClick={(e) => checkForVerification(e)}
                  >
                    Ya he verificado mi email <RightArrowIcon />{" "}
                  </button>
                  <Link href="/">
                    <a className={styles.roundedButtonTerciary}>
                      Ir al inicio de Liza <LogoIcon height={21} />
                    </a>
                  </Link>
                  <button
                    className={styles.roundedButtonTerciary}
                    onClick={logout}
                  >
                    Cerrar sesiรณn <DoorIcon />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        #ErrorMsg {
          align-self: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

export default index;
