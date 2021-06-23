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
import useUser from 'components/hooks/useUser'

function index() {

    const [loading, setLoading] = useState(true)
    const router = useRouter()
    let user = useUser()

    useEffect(()=>{
        if(user){
            setLoading(false)

            if(auth.currentUser.emailVerified===true){
                router.replace('/')
            }
        }
    },[user])

    

    const resendEmailVerification = (e) => {
        e.preventDefault()
        auth.currentUser.sendEmailVerification().then(()=>{
            ErrorMsg.style.background = "#21a0470f"
            ErrorMsg.style.color = "#21a047"
            ErrorMsg.innerText="Revisa tu bandeja de entrada 📬"
            ErrorMsg.style.display="block"
        })
    }

    const checkForVerification = (e) => {
        e.preventDefault()
        console.log(auth.currentUser)
        if(auth.currentUser.emailVerified === true){
            saveUserInFirestore(auth.currentUser)
            router.replace('/')
        }
        else{
            ErrorMsg.style.background = "#c43d3d0f"
            ErrorMsg.style.color = "#c43d3d"
            ErrorMsg.innerText="El email no se ha verificado aún 📪"
            ErrorMsg.style.display="block"
        }
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
            <div className={styles.container}> 
            {
                loading ? <SpinnerComponent/>
                :
                <form className={styles.form}>
                    <h1 className={styles.title}>Hola {user?.username}!</h1>
                    <h2 className={styles.subtitle}>Primero tenemos que verificar tu email 🚀</h2>
                    <p>Cuando estes listo presiona "Enviar email de verificación" para que enviemos un email a tu cuenta <strong>{user?.email}</strong></p>
                    <div className={styles.buttonsBox}>
                        <button className={styles.roundedButtonTerciary} onClick={(e)=>resendEmailVerification(e)}>Enviar email de verificación <AirplaneIcon/> </button>
                        <button className={styles.roundedButtonFilled} onClick={(e)=>checkForVerification(e)}>Ya he verificado mi email <RightArrowIcon/> </button>
                    </div>
                    <span id="ErrorMsg" className={styles.ErrorMsg}></span>
                </form>
            }  
            </div>
            <style jsx>{`
                #ErrorMsg{
                    display:block;
                    align-self: center;
                    margin-top: 20px;
                }
            `}</style>
        </div>
 
    )
}

export default index