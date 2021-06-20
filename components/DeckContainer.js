import Link from 'next/link'
import React from 'react'
import styles from 'styles/Deck.module.scss'

function DeckContainer({id, name, description, icon}) {
    return (
        <Link href={`/decks/${id}`}>
            <div className={styles.deck}>
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
        </Link>        
    )
}

export default DeckContainer
