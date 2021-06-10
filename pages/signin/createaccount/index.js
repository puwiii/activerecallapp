import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../../../styles/Signin.module.css'
import { auth } from '../../../firebase/client'
import RightArrowIcon from 'components/icons/RightArrowIcon'

function index() {

    const [username, setUsername] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userRepeatedPassword, setUserRepeatedPassword] = useState('')
 
    const register = e => {
        e.preventDefault();
        
        auth
            .createUserWithEmailAndPassword(userEmail, userPassword)
            .then((res)=>{
                console.log(res)
                let user = auth.currentUser
                user.updateProfile({
                    displayName: username
                }).then((res) =>{
                    console.log('username created with username')
                })
            })
            .catch(error=>{
                ErrorMsg.innerText= error
                ErrorMsg.style.display="block"
            })
    }

    useEffect(() => {
        const ErrorMsg = document.getElementById('ErrorMsg')
        const submitButton = document.getElementById('submitButton')

        if(userRepeatedPassword != userPassword){
            ErrorMsg.innerText="Las contraseñas no coinciden"
            ErrorMsg.style.display="block"
            if(!submitButton.classList.contains('disabledButton')) submitButton.classList.add(`${styles.disabledButton}`)
            submitButton.setAttribute('disabled', true)
        }
        else{
            ErrorMsg.style.display="none"
            if(submitButton.classList.contains(`${styles.disabledButton}`)) submitButton.classList.remove(`${styles.disabledButton}`)
            submitButton.removeAttribute('disabled', false)
        }
    }, [userPassword, userRepeatedPassword])

    return (

        <div className={styles.signin}>
             <Head>
                <title>Registrarte / Liza</title>
            </Head>
            <div className={styles.container}>   
                <form className={styles.form}>
                <h1 className={styles.title}>¡Vamos a crear tu cuenta!</h1>
                    <input type="text" placeholder="Ingresa un nombre de usuario" aria-label="Ingresa un nombre de usuario" className={styles.inputRounded} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" placeholder="Ingresa un Email" aria-label="Ingresa un Email"  className={styles.inputRounded} onChange={(e) => setUserEmail(e.target.value)} required/>
                    <input type="password" placeholder="Ingresa una contraseña" aria-label="Ingresa una contraseña" className={styles.inputRounded} onChange={(e) => setUserPassword(e.target.value)} required/>
                    <input type="password" placeholder="Repetir contraseña" aria-label="Repetir contraseña" className={styles.inputRounded} onChange={(e) => setUserRepeatedPassword(e.target.value)} required/>
                    <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                    <div className={styles.buttonsBox}>
                        <button type="submit" className={styles.roundedButtonFilled} id="submitButton" onClick={e=>register(e)}>Crear cuenta<RightArrowIcon/></button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                div div form div button{
                    align-self: flex-end;
                }
            `}</style>
        </div>
 
    )
}

export default index
