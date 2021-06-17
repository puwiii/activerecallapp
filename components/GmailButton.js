import GmailLogo from 'components/logos/GmailLogo'
import styles from 'styles/Global.module.scss'
import { loginWithGmail } from 'firebase/client'
import {useRouter} from 'next/router'

function GmailButton(){

    const router = useRouter()

    const login = e => {
        e.preventDefault()
        loginWithGmail().then(credentials=>{
            router.push('/')
        })
    }

    return(
        <>
        <button className={styles.roundedButtonSecondary} onClick={e=>login(e)}>Continuar con<GmailLogo height={25}/></button>
        </>
    )
}

export default GmailButton