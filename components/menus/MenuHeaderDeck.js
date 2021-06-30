import React, {useEffect, useState} from 'react'

//styles
import styles from 'styles/Menu.module.scss'

//components
import WriteIcon from 'components/icons/WriteIcon'

//popups

//hooks
import { useModal } from 'components/hooks/useModal';

function MenuHeaderDeck({deckId, closeWindow, isOpen}) {

    return (

            <div className={styles.menu}>
                <ul className={styles.options}>
                    <li><WriteIcon/>Cambiar nombre</li>
                    <li><WriteIcon/>Cambiar descripción</li>
                </ul>
                {/* {
            isOpenRemoveDeck && 
            <RemoveDeckWindow
                isOpen={isOpenRemoveDeck}
                closeWindow={closeRemoveDeck}
                deckId={deckId}
                parentDeckId={parentDeckId}
                name={name}
                stay={true}
            />          
            } */}

            <style jsx>{`

                div{
                    top: calc(100% + 5px);
                    right: 0px;
                }

              `}</style>
            </div>

            

    )
}

export default MenuHeaderDeck
