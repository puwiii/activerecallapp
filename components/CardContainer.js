import React from 'react'

//styles
import styles from 'styles/Card.module.scss'

function CardContainer({cardId, front, back, createdAt}) {
    return (
        <div className={styles.card}>
            {front}
            <br/>
            <br/>
            {back}
            
        </div>
    )
}

export default CardContainer
