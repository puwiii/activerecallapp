import React from 'react'
import styles from '/styles/Signin.module.css'

function index() {
    return (
        <div className={styles.signin}>
            <div className={styles.container}>
                <h1 className={styles.title}>Inicio de sesión</h1>
                <form className={styles.form}>
                    <input type="text" placeholder="Nombre de usuario" className={styles.inputRounded}/>
                    <input type="password" placeholder="Contraseña" className={styles.inputRounded}/>
                    <div className={styles.buttonsBox}>
                        <button type="submit" className={styles.roundedButtonFilled}>Iniciar sesión</button>
                        <a href="">¿Has olvidado tu contraseña?</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default index
