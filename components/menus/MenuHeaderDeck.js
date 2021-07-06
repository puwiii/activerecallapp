import React, {useEffect, useState} from 'react'

//styles
import styles from 'styles/Menu.module.scss'

//components
import WriteIcon from 'components/icons/WriteIcon'
import UpdateDeckNameWindow from 'components/popups/UpdateDeckNameWindow';
import UpdateDeckDescriptionWindow from 'components/popups/UpdateDeckDescriptionWindow';

//hooks
import { useModal } from 'components/hooks/useModal';

function MenuHeaderDeck({xCoord, yCoord, deckId, closeWindow, isOpen, deckName, deckDescription}) {

    const [isOpenUpdateNameDeck, openUpdateNameDeck, closeUpdateNameDeck] = useModal(false);
    const [isOpenUpdateDescriptionDeck, openUpdateDescriptionDeck, closeUpdateDescriptionDeck] = useModal(false);

    return (

        <>
            <div className={styles.menu}>
                <ul className={styles.options}>
                    <li onClick={openUpdateNameDeck}><WriteIcon/>Cambiar nombre</li>
                    <li onClick={openUpdateDescriptionDeck}><WriteIcon/>Cambiar descripción</li>
                </ul>
                
            </div>
            {
                isOpenUpdateNameDeck &&
                <UpdateDeckNameWindow
                    isOpen={isOpenUpdateNameDeck}
                    closeWindow={closeUpdateNameDeck}
                    deckId={deckId}
                    deckName={deckName}
                />
            }
            
            {
                isOpenUpdateDescriptionDeck &&
                <UpdateDeckDescriptionWindow
                    isOpen={isOpenUpdateDescriptionDeck}
                    closeWindow={closeUpdateDescriptionDeck}
                    deckId={deckId}
                    description={deckDescription}
                />
            }

            <style jsx>{`

                div{
                    top: ${yCoord + 10}px;
                    right: ${window.innerWidth - xCoord}px;
                }

              `}</style>
        </>
            

    )
}

export default MenuHeaderDeck
