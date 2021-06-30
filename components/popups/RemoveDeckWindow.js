import { clearDeckReference, removeDeck } from 'firebase/client'
import React from 'react'
import { useRouter } from "next/router";

//styles
import popupStyles from 'styles/Popup.module.scss'

//components
import TrashIcon from 'components/icons/TrashIcon'
import BackIcon from 'components/icons/BackIcon'

function RemoveDeckWindow({ isOpen, closeWindow, deckId, name, parentDeckId, stay=false }) {

    const router = useRouter()

    const remove = () => {
        removeDeck(deckId)
        clearDeckReference(deckId, parentDeckId)
        closeWindow()
        if(!stay){
            router.back()
        }
    }

    return (
        <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}> 
            <div className={popupStyles.window}>
                <h1 className={popupStyles.title}>¡Cuidado!</h1>
                <p className={popupStyles.description}>Si eliminas el mazo <strong>"{name}"</strong>, todo su contenido tambien se eliminará. Asegurate de que eso es lo que quieres</p>
                <div className={popupStyles.buttons}>
                    <button className={popupStyles.removeBtn} onClick={remove}><TrashIcon/>Eliminar</button>
                    <button onClick={closeWindow}><BackIcon/>Cancelar</button>
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

export default RemoveDeckWindow
