import React from 'react'

//styles
import styles from 'styles/Card.module.scss'

function CardContainer({cardId, front, back, createdAt}) {
    return (
        <div className={styles.cardContainer} title={front}>
            <div className={styles.card}>
                <div className={styles.front}>
                        <p>{front}</p>
                </div>
            </div>
        </div>
    )
}

export default CardContainer
