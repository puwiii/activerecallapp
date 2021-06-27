import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router';

//styles
import styles from "styles/Home.module.scss";
import accountPage from "styles/AccountSettings.module.scss"

//components
import ChevronRightIcon from 'components/icons/ChevronRightIcon';
import LockIcon from 'components/icons/LockIcon';
import UserIcon from 'components/icons/UserIcon';
import PhotoIcon from 'components/icons/PhotoIcon';
import UpdateAvatar from 'components/popups/UpdateAvatarWindow';
import SpinnerComponent from 'components/SpinnerComponent';

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, { USER_STATES } from "components/hooks/useUser";



const COMPOSE_STATES = {
    ERROR: -1,
    NONE: 0,
    DRAG_OVER: 1,
    UPLOADING: 2,
    COMPLETE: 3,
}


function index() {

    let user = useUser()
    
    let router = useRouter()

    const [loading, setLoading] = useState(false)

    const [isOpenUpdateAvatar, openAvatarUpdate, closeAvatarUpdate] = useModal(false);

    useEffect(()=>{

        setLoading(false)

        if(USER_STATES.NOT_LOGGED){
            router.replace("/signin")
        }

       if(USER_STATES.NOT_KNOWN){
           setLoading(true)
       }

    },[user])

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Mi cuenta</h1>
            <UpdateAvatar
                isOpen={isOpenUpdateAvatar}
                closeWindow={closeAvatarUpdate}
                userId={user?.id}
            />
            {loading ? 
                <SpinnerComponent/>
            :
                
                <div className={accountPage.form}>
                    
                    <div className={accountPage.field} onClick={openAvatarUpdate}>
                        <span><PhotoIcon/>Foto de perfil</span>
                        <img src={user?.avatar}/>
                        <ChevronRightIcon/>
                    </div>
                    
                    <div className={accountPage.field}>
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
