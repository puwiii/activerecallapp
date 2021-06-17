import React, {useEffect, useState} from 'react'
import Header from 'components/Header'
import Head from 'next/head'
import Nav from 'components/Nav'
import styles from 'styles/Home.module.scss'
import CreateDeckWindow from 'components/CreateDeckWindow'
import { auth, onAuthStateChanged } from 'firebase/client'
import { useRouter } from 'next/router'
import { useModal } from 'components/hooks/useModal'

function index() {

    const[isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false)
    const[decks, setDecks] = useState([])

    const router = useRouter()

    return (
        <div className={styles.mainContainer}>
            <Head>
            <title>Mis mazos - Liza</title>
            </Head>

            <Header/>
        
            <main className={styles.main}>

                <Nav/>
            
                <section>
                    <CreateDeckWindow isOpen={isOpenCreateDeck} closeWindow={closeCreateDeck}/>
                    <button className={styles.roundedButtonSecondary} onClick={openCreateDeck}>Crear un nuevo mazo</button>
                </section>
                
                
            </main>

            <style jsx>{`

            `}</style>
       </div>
    )
}


export default index
