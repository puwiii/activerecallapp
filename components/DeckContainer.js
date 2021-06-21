import Link from 'next/link'
import React from 'react'
import styles from 'styles/Deck.module.scss'
import FolderIcon from './icons/FolderIcon'

function DeckContainer({id, name, description, icon, isPoster}) {
    return (
        <Link href={`/decks/${id}`}>
            <div className={`${styles.deck} ${isPoster && styles.poster}`}>
                <div className={styles.deck__icon}>
                    <FolderIcon/>
                </div>
                <span>{name}</span>
            </div>
        </Link>        
    )
}

export default DeckContainer