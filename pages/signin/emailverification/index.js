import React, {useState, useEffect} from 'react'
import Head from 'next/head'

//styles
import styles from '../../../styles/Signin.module.scss'

//firebase
import { auth, saveUserInFirestore } from '../../../firebase/client'
import {useRouter} from 'next/router'


//components
import SpinnerComponent from 'components/SpinnerComponent'
import AirplaneIcon from 'components/icons/AirplaneIcon'
import RightArrowIcon from 'components/icons/RightArrowIcon'

//hooks
import useUser, {USER_STATES} from 'components/hooks/useUser'

function index() {

    const [loading, setLoading] = useState(true)
    const router = useRouter()
    let user = useUser()

    useEffect(()=>{
        if(user){
            if(auth.currentUser.emailVerified===true){
                saveUserInFirestore(auth.currentUser)
                router.replace('/')
            }
            else{
                ErrorMsg.style.borderColor = "#c43d3d30"
                ErrorMsg.style.background = "#c43d3d0f"
                ErrorMsg.style.color = "#c43d3d"
                ErrorMsg.innerText="El email no se ha verificado aún 📪"
                ErrorMsg.style.display="block"
            }
            
        }
    
        if(user === USER_STATES.NOT_LOGGED) router.back()
        
    },[user])

    

    const resendEmailVerification = (e) => {
        e.preventDefault()
        auth.currentUser.sendEmailVerification().then(()=>{
            ErrorMsg.style.borderColor = "#21a04730"
            ErrorMsg.style.background = "#21a0470f"
            ErrorMsg.style.color = "#21a047"
            ErrorMsg.innerText="Revisa tu bandeja de entrada 📬"
            ErrorMsg.style.display="block"
        }).catch((e)=>{
            const ERROR_MESSAGES = {
                'auth/too-many-requests': "Ya se ha enviado el email, revisa en tu correo no deseado 👀.",
                'auth/wrong-password': "La contraseña y/o el email no son validos, verifique los datos ingresados."
            }
            ErrorMsg.style.borderColor = "#c43d3d30"
            ErrorMsg.style.background = "#c43d3d0f"
            ErrorMsg.style.color = "#c43d3d"
            ErrorMsg.innerText= ERROR_MESSAGES[e.code] || "Error, por favor intente de nuevo"
            ErrorMsg.style.display="block"
        })
    }

    const checkForVerification = (e) => {
        e.preventDefault()
        router.reload(window.location.pathname)
    }

    // auth.currentUser.sendEmailVerification().then(()=>{
    //     console.log("user verified.")
    // })
    // .catch((error)=>{
    //     ErrorMsg.innerText= error.code
    //     ErrorMsg.style.display="block"
    // })

    // useEffect(() => {
    //     const ErrorMsg = document.getElementById('ErrorMsg')

    //     if(userRepeatedPassword != userPassword){
    //         ErrorMsg.innerText="Las contraseñas no coinciden"
    //         ErrorMsg.style.display="block"
           
    //     }
    //     else{
    //         ErrorMsg.style.display="none"
    //     }
    // }, [userPassword, userRepeatedPassword])

    return (

        <div className={styles.signin}>
             <Head>
                <title>Verificacion de email / Liza</title>
            </Head>
            <div className={styles.formContainer}> 
            {
                // loading ? 
                // :
                <>
                    <div className={styles.text}>
                        <h1 className={styles.subtitle}>Hola {user?.username ? user.username : <SpinnerComponent/>}, primero tenemos que verificar tu email 🚀</h1>
                        <h2>Cuando estes listo presiona "Enviar email de verificación" para que enviemos un email a tu cuenta <strong>{user?.email ? user.email : <SpinnerComponent/>}</strong></h2>
                    </div>
                    
                    <form className={styles.form}>
                        <div className={styles.buttonsBox}>
                            <button className={styles.roundedButtonTerciary} onClick={(e)=>resendEmailVerification(e)}>Enviar email de verificación <AirplaneIcon/> </button>
                            <button className={styles.roundedButtonFilled} onClick={(e)=>checkForVerification(e)}>Ya he verificado mi email <RightArrowIcon/> </button>
                        </div>
                        <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                    </form>
                </>
            }  
            </div>
            <style jsx>{`
                #ErrorMsg{
                    align-self: center;
                    margin-top: 20px;
                }
            `}</style>
        </div>
 
    )
}

export default index