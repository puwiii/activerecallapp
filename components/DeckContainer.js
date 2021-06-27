import Link from 'next/link'
import React from 'react'
import styles from 'styles/Deck.module.scss'
import FolderIcon from './icons/FolderIcon'

function DeckContainer({deckId, name, description, icon, isPoster, parentDeckId = "none"}) {
    return (
        <Link href={`/decks/${deckId}?from=${parentDeckId}`}>
            <div className={`${styles.deck} ${isPoster && styles.poster}`} title={name}>
                <div className={styles.deck__icon}>
                    <FolderIcon/>
                </div>
                <span>{name}</span>
                {isPoster && <p>{description}</p>}
            </div>
        </Link>        
    )
}

export default DeckContainer
