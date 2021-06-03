import React from 'react'
import styles from '/styles/Signin.module.css'

function index() {
    return (
        <div className={styles.signin}>
            <div className={styles.container}>
                <h1 className={styles.title}>Hola, me llamo Liza y estoy aqui para ayudarte</h1>
                <p className={styles.subtitle}>
                Aplicando mis metodos de estudio vas a aprender mas rapido y de forma eficiente. Si no tienes cuenta no te preocupes, vamos a crear una para comenzar!
                </p>
                <div className={styles.buttons}>
                    <a href="/signin/login" className={styles.roundedButtonFilled}>Iniciar sesión</a>
                    <a href="/signin/createaccount" className={styles.roundedButtonBorder}>¡Soy nuevo!</a>
                </div>
            </div>
        </div>
    )
}

export default index
