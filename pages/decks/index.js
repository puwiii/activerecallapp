import React, {useEffect, useState} from 'react'
import Header from 'components/Header'
import Head from 'next/head'
import Nav from 'components/Nav'
import styles from 'styles/Home.module.scss'
import CreateDeckWindow from 'components/CreateDeckWindow'
import { auth, onAuthStateChanged, listenForUserDecks } from 'firebase/client'
import { useRouter } from 'next/router'
import { useModal } from 'components/hooks/useModal'
import { useStateValue } from 'components/contexts/StateProvider'
import useUser, {USER_STATES} from 'components/hooks/useUser'
import Decks from 'components/Decks'

function index() {

    const[isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false)
    const[decks, setDecks] = useState([])
    
    let user = useUser()

    const router = useRouter()

    useEffect(()=>{
        if(user === USER_STATES.NOT_LOGGED){
            router.replace('/signin')
        }
    },[user])

    return (
        <main className={styles.main}>
            <Head>
            <title>Mis mazos - Liza</title>
            </Head>

           
        
         
                {/* {user === USER_STATES.NOT_KNOWN && //debiera ir spinner
                
                
                } */}
                <section>
                    <CreateDeckWindow isOpen={isOpenCreateDeck} closeWindow={closeCreateDeck}/>
                    <button className={styles.roundedButtonSecondary} onClick={openCreateDeck}>Crear un nuevo mazo</button>
                </section>


            <style jsx>{`

            `}</style>
       </main>
    )
}


export default index
