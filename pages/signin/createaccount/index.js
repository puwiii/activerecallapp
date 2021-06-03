import React from 'react'
import styles from '/styles/Signin.module.css'
// import styles from '../../../styles/Createaccount.module.css'

function index() {
    return (
        <div className={styles.signin}>
            <div className={styles.container}>
                <h1 className={styles.title}>¡Vamos a crear tu cuenta!</h1>
                <form className={styles.form}>
                    <input type="text" placeholder="Nombre de usuario" className={styles.inputRounded}/>
                    <input type="text" placeholder="Email" className={styles.inputRounded}/>
                    <input type="password" placeholder="Contraseña" className={styles.inputRounded}/>
                    <input type="password" placeholder="Repetir contraseña" className={styles.inputRounded}/>
                    <button type="submit" className={styles.roundedButtonFilled}>Crear cuenta</button>
                </form>
            </div>
        </div>
    )
}

export default index
