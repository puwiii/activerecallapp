import { removeDeck } from 'firebase/client'
import React from 'react'

//styles
import popupStyles from 'styles/Popup.module.scss'

//components
import UploadIcon from 'components/icons/UploadIcon'
import BackIcon from 'components/icons/BackIcon'

function UpdateAvatar({ isOpen, closeWindow, userId }) {


    const updateAvatar = (id = userId) =>{

        if(id){
            console.log(id)
        }
    }

    return (
        <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}> 
            <div className={popupStyles.window}>
                <h1 className={popupStyles.title}>Cambiar foto</h1>

                <form>
                    
                </form>

                <div className={popupStyles.buttons}>
                    <button onClick={closeWindow}><BackIcon/>Cancelar</button>
                    <button className={popupStyles.primaryButton} onClick={updateAvatar}><UploadIcon/>Subir foto</button>
                </div>
            </div>

            <style jsx>{`
                .is-open {
                    display: grid !important;
                }
            `}</style>
        </div>
    )
}

export default UpdateAvatar
