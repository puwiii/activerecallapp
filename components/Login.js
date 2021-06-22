import React, {useState, useEffect} from 'react'
import styles from 'styles/Signin.module.scss'
import Link from 'next/link'
import { auth } from 'firebase/client'
import {useRouter} from 'next/router'
import GmailButton from 'components/GmailButton'
import RightArrowIcon from './icons/RightArrowIcon'
import PushLeftIcon from './icons/PushLeftIcon'
import useUser from './hooks/useUser'

function index() {

    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const router = useRouter()
    let user = useUser()

    useEffect(()=>{
        if(auth.currentUser?.emailVerified) router.replace('/')
    }, [user])

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
            .then((cred)=>{
                console.log(cred.user.emailVerified)
                if(cred.user.emailVerified===true){
                    router.replace('/')
                }
                else{
                   router.push('/signin/emailverification')
                }
                // router.back()
            })
            .catch(error=>{

                const ERROR_MESSAGES = {
                    'auth/user-not-found': "No se ha encontrado un usuario registrado con ese Email.",
                    'auth/wrong-password': "La contraseña y/o el email no son validos, verifique los datos ingresados."
                }

                const DEFAULT_ERROR_MESSAGE = 'Aparentemente hay un error, ponte en contacto con bla bla bla...'
        

                ErrorMsg.innerText= ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE
                ErrorMsg.style.display="block"
            })
    }
    
    return (
        // <div className={styles.signin}>
        //     <div className={styles.container}>
        //         
                <form className={styles.form}>
                    <h1 className={styles.title}>Inicio de sesión</h1>
                    <input 
                        type="email" 
                        placeholder="Ingresa tu email" 
                        aria-label="Ingresa tu email" 
                        //autoComplete="username"
                        className={styles.inputRounded} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Ingresa tu contraseña" 
                        aria-label="Ingresa tu contraseña" 
                        //autoComplete="current-password"
                        className={styles.inputRounded} 
                        onChange={(e) => setUserPassword(e.target.value)} 
                    />
                    <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                    <div className={styles.buttonsBox}>
                        {/* <a href="">¿Has olvidado tu contraseña?</a> */}
                        <button type="submit" className={styles.roundedButtonFilled} onClick={e=>login(e)}>Iniciar sesión <RightArrowIcon/></button>
                        {/* <GmailButton/> */}
                        <Link href={"/signin/createaccount"}>
                            <a className={styles.roundedButtonSecondary}>¡Soy nuevo!<PushLeftIcon/></a> 
                        </Link>
                    </div>
                </form>
        //     </div>
        // </div>
    )
}

export default index
