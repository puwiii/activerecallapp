import React, {useEffect, useState} from 'react'
import { useRouter } from "next/router";

//styles
import styles from 'styles/Menu.module.scss'

//components
import TrashIcon from 'components/icons/TrashIcon'
import WriteIcon from 'components/icons/WriteIcon'
import RemoveDeckWindow from 'components/popups/RemoveDeckWindow';

//hooks
import { useModal } from 'components/hooks/useModal';

function MenuDeck({xCoord, yCoord, deckId, closeWindow, isOpen, name}) {

    const router = useRouter()

    const [toLeft, setToLeft] = useState(false)
    const [toUp, setToUp] = useState(false)
    const [newXCoord, setNewXCoord] = useState()
    const [newYCoord, setNewYCoord] = useState()
    const [parentDeckId, setParentDeckId] = useState()

    const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);

    useEffect(()=>{

        document.querySelector(".menuDeck").addEventListener('mouseup',(e)=>{
            //closeWindow()
        
            if(e.target.classList.contains("menuDeck")) closeWindow()
        })

        if(xCoord > window.innerWidth/2){
            setToLeft(true)
            setNewXCoord(window.innerWidth - xCoord)
        }

        if(yCoord > window.innerHeight/2){
            setToUp(true)
            setNewYCoord(window.innerHeight - yCoord)
        }

    },[])

    useEffect(()=>{
        if(router.query.id){
            setParentDeckId(router.query.id)
        }
        else{
            setParentDeckId("none")
        }
    },[router.query.id])

    return (
        <div className={`${styles.menuContainer} menuDeck`}>
            <div className={styles.menu} id="asd">
                <span className={styles.title}>{name}</span>
                <ul className={styles.options}>
                    <li><WriteIcon/>Cambiar nombre</li>
                    <li><WriteIcon/>Cambiar descripción</li>
                    <hr/>
                    <li className={styles.redOption} onClick={e=>openRemoveDeck(e)}><TrashIcon/>Eliminar mazo</li>
                </ul>
            </div>

            {
            isOpenRemoveDeck && 
            <RemoveDeckWindow
                isOpen={isOpenRemoveDeck}
                closeWindow={closeRemoveDeck}
                deckId={deckId}
                parentDeckId={parentDeckId}
                name={name}
                stay={true}
            />          
            }

            <style jsx>{`
                .menuDeck{
                    display: ${isOpen ? "block" : "none"}
                }

                #asd{
                    position: absolute;
                    ${toLeft ? `right: ${newXCoord}px;` : `left: ${xCoord}px;`}
                    ${toUp ? `bottom: ${newYCoord}px;` : `top: ${yCoord}px;`}
                    
                }
            `}</style>
        </div>
    )
}

export default MenuDeck
