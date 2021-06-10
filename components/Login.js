import React, {useState, useEffect} from 'react'
import styles from 'styles/Signin.module.css'
import Link from 'next/link'
import { auth } from 'firebase/client'
import {useRouter} from 'next/router'
import GmailButton from 'components/GmailButton'
import RightArrowIcon from './icons/RightArrowIcon'

function index() {

    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const router = useRouter()

    const login = e => {
        e.preventDefault();

        if(!userEmail){
            ErrorMsg.innerText="El email no puede estar vacio"
            ErrorMsg.style.display="block"
            return
        }

        if(!userPassword){
            ErrorMsg.innerText="La contraseña no puede estar vacia"
            ErrorMsg.style.display="block"
            return
        }
        
        auth
            .signInWithEmailAndPassword(userEmail, userPassword)
            .then((user)=>{
                console.log(user)
                router.push('/')
            })
            .catch(error=>{
                ErrorMsg.innerText= error
                ErrorMsg.style.display="block"
            })
    }
    
    return (
        // <div className={styles.signin}>
        //     <div className={styles.container}>
        //         
                <form className={styles.form}>
                    <h1 className={styles.title}>Inicio de sesión</h1>
                    <input type="email" placeholder="Ingresa tu email" aria-label="Ingresa tu email" className={styles.inputRounded} onChange={(e) => setUserEmail(e.target.value)} />
                    <input type="password" placeholder="Ingresa tu contraseña" aria-label="Ingresa tu contraseña" className={styles.inputRounded} onChange={(e) => setUserPassword(e.target.value)} />
                    <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                    <div className={styles.buttonsBox}>
                        <a href="">¿Has olvidado tu contraseña?</a>
                        <button type="submit" className={styles.roundedButtonFilled} onClick={e=>login(e)}>Iniciar sesión <RightArrowIcon/></button>
                        <GmailButton/>
                        <Link href={"/signin/createaccount"}>
                            <a className={styles.roundedButtonTerciary}>¡Soy nuevo!</a> 
                        </Link>
                    </div>
                </form>
        //     </div>
        // </div>
    )
}

export default index
