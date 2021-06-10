import React from 'react'
import Head from 'next/head'
import styles from '/styles/Signin.module.css'
import Login from 'components/Login'

function index() {
    return (
        <div className={styles.signin}>
            <div className={styles.container}>
                <Head>
                    <title>Iniciar Sesión / Liza</title>
                </Head>
                {/* <h1 className={styles.title}>Hola, me llamo Liza y estoy aqui para ayudarte</h1>
                <p className={styles.subtitle}>
                Aplicando mis metodos de estudio vas a aprender mas rapido y de forma eficiente. Si no tienes cuenta no te preocupes, vamos a crear una para comenzar!
                </p> */}
                <Login/>
            </div>
        </div>
    )
}

export default index
