import React, {useEffect, useState} from 'react'
import { useRouter } from "next/router";

//styles
import styles from 'styles/Menu.module.scss'

//components
import TrashIcon from 'components/icons/TrashIcon'
import WriteIcon from 'components/icons/WriteIcon'
import RemoveDeckWindow from 'components/popups/RemoveDeckWindow';
import UpdateDeckNameWindow from 'components/popups/UpdateDeckNameWindow';
import UpdateDeckDescriptionWindow from 'components/popups/UpdateDeckDescriptionWindow';

//hooks
import { useModal } from 'components/hooks/useModal';

function MenuDeck({xCoord, yCoord, deckId, closeWindow, isOpen, name}) {

    const router = useRouter()

    const [toLeft, setToLeft] = useState(false)
    const [toUp, setToUp] = useState(false)
    const [newXCoord, setNewXCoord] = useState()
    const [newYCoord, setNewYCoord] = useState()
    const [parentDeckId, setParentDeckId] = useState()
    const [loading, setLoading] = useState()

    const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);
    const [isOpenUpdateNameDeck, openUpdateNameDeck, closeUpdateNameDeck] = useModal(false);
    const [isOpenUpdateDescriptionDeck, openUpdateDescriptionDeck, closeUpdateDescriptionDeck] = useModal(false);

    useEffect(()=>{
        setLoading(true)

        if(xCoord > window.innerWidth/2){
            setToLeft(true)
            setNewXCoord(window.innerWidth - xCoord)
        }

        if(yCoord > window.innerHeight/2){
            setToUp(true)
            setNewYCoord(window.innerHeight - yCoord)
        }

        setLoading(false)
    },[])

    useEffect(()=>{
        if(router.query.id){
            setParentDeckId(router.query.id)
        }
        else{
            setParentDeckId("none")
        }
    },[router.query.id])

    const handleClick = (e) => {
        if(e.target.classList.contains("menuDeck")) closeWindow()
    }

    return (
        
        <div className={`${styles.menuContainer} menuDeck`} onMouseUp={e=>handleClick(e)}>
            {
            !loading &&
            <div className={styles.menu} id="asd">
                <span className={styles.title}>{name}</span>
                <ul className={styles.options}>
                    <li onClick={openUpdateNameDeck}><WriteIcon/>Cambiar nombre</li>
                    <li onClick={openUpdateDescriptionDeck}><WriteIcon/>Cambiar descripción</li>
                    <hr/>
                    <li className={styles.redOption} onClick={e=>(openRemoveDeck(e))}><TrashIcon/>Eliminar mazo</li>
                </ul>
            </div>
            }

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

            {
                isOpenUpdateNameDeck &&
                <UpdateDeckNameWindow
                    isOpen={isOpenUpdateNameDeck}
                    closeWindow={closeUpdateNameDeck}
                    deckId={deckId}
                />
            }

            {
                isOpenUpdateDescriptionDeck &&
                <UpdateDeckDescriptionWindow
                    isOpen={isOpenUpdateDescriptionDeck}
                    closeWindow={closeUpdateDescriptionDeck}
                    deckId={deckId}
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
