import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

//styles
import styles from 'styles/Signin.module.scss'

//firebase
import { auth, isUsernameAvalaible } from 'firebase/client'

//components
import RightArrowIcon from 'components/icons/RightArrowIcon'

//hooks
import useUser from 'components/hooks/useUser'

function index() {

    const [username, setUsername] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userRepeatedPassword, setUserRepeatedPassword] = useState('')
 
    let user = useUser()
    const router = useRouter()

    const register = e => {
        e.preventDefault();
        
        isUsernameAvalaible(username).then((res)=>{
            if (res) {
                auth
                .createUserWithEmailAndPassword(userEmail, userPassword)
                .then(()=>{
                    let user = auth.currentUser
                    user.updateProfile({
                        displayName: username,
                        photoURL: 'https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png'
                    })
                    .then(() =>{
                        console.log('username created with username')
                        router.replace('/signin/emailverification')
                    })
                    .catch(error=>{
                        ErrorMsg.innerText= error.message
                        ErrorMsg.style.display="block"
                    })
                })
                .catch(error=>{
                    const ERROR_MESSAGES = {
                        'auth/invalid-email': "Hmm... revisa el correo ingresado, algo parece estar mal con eso.",
                        'auth/weak-password': "La contraseña es muy debil, haz que al menos tenga seis caracteres.",
                        'auth/email-already-in-use': "Parece que este correo ya esta en uso, ¿olvidaste tu contraseña?"
                    }
    
                    console.log(error)
                    const DEFAULT_ERROR_MESSAGE = 'Aparentemente hay un error, ponte en contacto con bla bla bla...'
            
    
                    ErrorMsg.innerText= ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE
                    ErrorMsg.style.display="block"
    
                })
            }
            else{
                ErrorMsg.innerText="Ups... este nombre de usuario ya esta en uso. Intenta con otro"
                ErrorMsg.style.display="block"
            }
        })
    }
       
    useEffect(()=>{
        createAccountInput.focus()
    },[])
    

    useEffect(()=>{
        if(user){
            router.back()
        }
    }, [user])

    useEffect(() => {
        // const ErrorMsg = document.getElementById('ErrorMsg')
        if(userRepeatedPassword != userPassword){
            ErrorMsg.innerText="Las contraseñas no coinciden"
            ErrorMsg.style.display="block"
        }
        else{
            ErrorMsg.style.display="none"
        }
    }, [userPassword, userRepeatedPassword])

    return (

        <div className={styles.signin}>
             <Head>
                <title>Registrarte / Liza</title>
            </Head>
            <div className={styles.formContainer}> 
                <div className={styles.text}>
                    <h1 className={styles.subtitle}>¡Vamos a crear tu cuenta!</h1>
                    <h2 className={styles.subtitle}>Presentate con Liza, ella estará muy feliz de conocerte 😁</h2>
                </div>  
                <form className={styles.form}>       
                    <input type="text" placeholder="Ingresa un nombre de usuario" aria-label="Ingresa un nombre de usuario" className={styles.inputRounded} onChange={(e) => setUsername(e.target.value)} required  id="createAccountInput"/>
                    <input type="email" placeholder="Ingresa un Email" aria-label="Ingresa un Email"  className={styles.inputRounded} onChange={(e) => setUserEmail(e.target.value)} required/>
                    <input type="password" placeholder="Ingresa una contraseña" aria-label="Ingresa una contraseña" className={styles.inputRounded} onChange={(e) => setUserPassword(e.target.value)} required/>
                    <input type="password" placeholder="Repetir contraseña" aria-label="Repetir contraseña" className={styles.inputRounded} onChange={(e) => setUserRepeatedPassword(e.target.value)} required/>
                    <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                    <div className={styles.buttonsBox}>
                        <button type="submit" className={styles.roundedButtonFilled} id="submitButton" onClick={e=>register(e)} disabled={(userPassword!==userRepeatedPassword) || (!username || !userEmail)}>Crear cuenta<RightArrowIcon/></button>
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
