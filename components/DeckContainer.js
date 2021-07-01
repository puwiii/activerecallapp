import Link from 'next/link'
import React, {useEffect, useState} from 'react'

//styles
import styles from 'styles/Deck.module.scss'

//components
import MenuDeck from 'components/menus/MenuDeck'
import FolderIcon from 'components/icons/FolderIcon'
import VerticalMenuIcon from './icons/VerticalMenuIcon'

//hooks
import { useModal } from './hooks/useModal'

function DeckContainer({deckId, name, description, icon, isPoster, parentDeckId = "none"}) {

    const [xCoord, setXCoord] = useState(0)
    const [yCoord, setYCoord] = useState(0)
    
    const [isOpenMenuDeck, openMenuDeck, closeMenuDeck] = useModal(false);

    const handleContextMenu = (e) => {
        e.preventDefault()
        setXCoord(e.clientX)
        setYCoord(e.clientY)
        openMenuDeck()
    }

    const handleVerticalMenu = (e) => {
        e.stopPropagation()
        let newXCoord = e.target.parentElement.offsetLeft + e.target.parentElement.offsetWidth + 5
        let newYCoord = e.target.parentElement.offsetTop
        setXCoord(newXCoord)
        setYCoord(newYCoord)
        if(isOpenMenuDeck){
            closeMenuDeck()
        }
        else{
            openMenuDeck()
        }
    }


    return (
        <div className={styles.deckContainer}>
            <Link href={`/decks/${deckId}?from=${parentDeckId}`}>
                <div className={`${styles.deck} ${isPoster && styles.poster}`} title={name} id={deckId} onContextMenu={e=>handleContextMenu(e)}>
                    <div className={styles.deck__icon}>
                        <FolderIcon/>
                    </div>
                    <span id={`${deckId}name`}>{name}</span>
                    {isPoster && <p>{description}</p>}

                    <div className={styles.deckMenuButton} id={`${deckId}button`} onClick={e=>handleVerticalMenu(e)} title="Mas opciones">
                        <VerticalMenuIcon/>
                    </div>
                </div>
            </Link>   
            {
                isOpenMenuDeck &&
                <MenuDeck 
                    xCoord={xCoord} 
                    yCoord={yCoord}
                    isOpen={isOpenMenuDeck}
                    closeWindow={closeMenuDeck}
                    deckId={deckId}
                    name={name}
                />
            }
        </div>
    )
}

export default DeckContainer
