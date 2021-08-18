import React from "react";
import Head from "next/head";
import Link from "next/link";

//styles
import styles from "/styles/Signin.module.scss";

//components
import Login from "components/Login";
import LogoSvg from "svgs/LogoSvg";

function index() {
  return (
    <div className={styles.signin}>
      <div className={styles.signin__backgroundDoodles}></div>
      <div className={styles.signin__background}></div>
      <div className={styles.container}>
        <Head>
          <title>Iniciar Sesión / Liza</title>
        </Head>
        {/* <h1 className={styles.title}>Hola, me llamo Liza y estoy aqui para ayudarte</h1>
                <p className={styles.subtitle}>
                Aplicando mis metodos de estudio vas a aprender mas rapido y de forma eficiente. Si no tienes cuenta no te preocupes, vamos a crear una para comenzar!
                </p> */}
        <Link href={"/"} passHref={true}>
          <a className={styles.logo} title="Página principal de Liza">
            <LogoSvg width={300} />
          </a>
        </Link>
        <Login />
      </div>
    </div>
  );
}

export default index;
