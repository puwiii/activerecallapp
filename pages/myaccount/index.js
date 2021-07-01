import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from 'next/image'

//styles
import styles from "styles/Home.module.scss";
import accountPage from "styles/AccountSettings.module.scss"

//components
import ChevronRightIcon from 'components/icons/ChevronRightIcon';
import LockIcon from 'components/icons/LockIcon';
import UserIcon from 'components/icons/UserIcon';
import PhotoIcon from 'components/icons/PhotoIcon';
import SpinnerComponent from 'components/SpinnerComponent';
import ScreenLoadingComponent from 'components/ScreenLoadingComponent';

//popups
import UpdateAvatarWindow from 'components/popups/UpdateAvatarWindow';
import UpdateUsernameWindow from 'components/popups/UpdateUsernameWindow';

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, { USER_STATES } from "components/hooks/useUser";

function index() {

    let user = useUser()
    
    const router = useRouter()

    const [loading, setLoading] = useState(true)

    const [isOpenUpdateAvatar, openAvatarUpdate, closeAvatarUpdate] = useModal(false);
    const [isOpenUpdateUsername, openUpdateUsername, closeUpdateUsername] = useModal(false)

    useEffect(()=>{

        if(user === USER_STATES.NOT_LOGGED){
            router.replace("/signin")
        }

       if(user) setLoading(false)

    },[user])

    return (
        <div className={styles.main}>
            <Head>
                <title>Mi cuenta - Liza</title>
            </Head>
            {/* <h1 className={styles.title}>Mi cuenta</h1> */}
            <UpdateAvatarWindow
                isOpen={isOpenUpdateAvatar}
                closeWindow={closeAvatarUpdate}
            />

            <UpdateUsernameWindow
                isOpen={isOpenUpdateUsername}
                closeWindow={closeUpdateUsername}
            />

            {loading ? 
                <ScreenLoadingComponent/>
            :
                
                <div className={accountPage.form}>
                    
                    <div className={accountPage.field} onClick={openAvatarUpdate}>
                        <span><PhotoIcon/>Foto de perfil</span>
                        <div className={accountPage.avatar}>
                            <Image
                                src={user?.avatar}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <ChevronRightIcon/>
                    </div>
                    
                    <div className={accountPage.field} onClick={openUpdateUsername}>
                        <span><UserIcon/>nombre de usuario</span>
                        <h3>{user?.username}</h3>
                        <ChevronRightIcon/>
                    </div>

                    <div className={accountPage.field}>
                        <span><LockIcon/>contraseña</span>
                        <h3><strong>**********</strong></h3>
                        <ChevronRightIcon/>
                    </div>

                </div>
            }

        </div>
    )
}

export default index
