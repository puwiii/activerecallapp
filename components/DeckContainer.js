import Link from 'next/link'
import React, {useEffect, useState} from 'react'

//styles
import styles from 'styles/Deck.module.scss'

//components
import MenuDeck from 'components/menus/MenuDeck'
import FolderIcon from 'components/icons/FolderIcon'

//hooks
import { useModal } from './hooks/useModal'

function DeckContainer({deckId, name, description, icon, isPoster, parentDeckId = "none"}) {

    const [xCoord, setXCoord] = useState(0)
    const [yCoord, setYCoord] = useState(0)
    
    const [isOpenMenuDeck, openMenuDeck, closeMenuDeck] = useModal(false);

    useEffect(()=>{
        const deckContainer = document.getElementById(deckId)
        if(deckContainer)
            deckContainer.addEventListener('contextmenu',(e)=>{
            e.preventDefault()
            setXCoord(e.x)
            setYCoord(e.y)
            openMenuDeck()
        })
    })

    return (
        <div>
            <Link href={`/decks/${deckId}?from=${parentDeckId}`}>
                <div className={`${styles.deck} ${isPoster && styles.poster}`} title={name} id={deckId}>
                    <div className={styles.deck__icon}>
                        <FolderIcon/>
                    </div>
                    <span>{name}</span>
                    {isPoster && <p>{description}</p>}

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
