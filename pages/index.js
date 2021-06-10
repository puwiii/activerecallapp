import Header from 'components/Header'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import {useState, useEffect} from 'react'
import {auth, onAuthStateChanged} from 'firebase/client'
import Link from 'next/link'
import Explore from 'components/Explore'
import Decks from 'components/Decks'
import ExploreIcon from 'components/icons/ExploreIcon'
import DecksIcon from 'components/icons/DecksIcon'
import FriendsIcon from 'components/icons/FriendsIcon'
import PushLeftIcon from 'components/icons/PushLeftIcon'
import PushRightIcon from 'components/icons/PushRightIcon'

export default function Home() {

  const[section, setSection] = useState('explore')
  const[navExpanded, setNavExpanded] = useState(false)

  useEffect(()=>{
      if(navExpanded) document.getElementById('nav').classList.add(styles.expanded)
      else document.getElementById('nav').classList.remove(styles.expanded)
  },[navExpanded])

  return (
   <div className={styles.mainContainer}>
     <Head>
       <title>Inicio / Liza</title>
     </Head>
    {/* header */}
    <Header/>

    <main className={styles.main}>
    {/* nav */}
      <nav className={styles.nav} id="nav">
        <ul>
          <li onClick={e=>setSection('explore')} title="Explorar"><ExploreIcon/><span>Explorar</span></li>
          <li onClick={e=>setSection('decks')} title="Mis mazos"><DecksIcon/><span>Mis mazos</span></li>
          <li onClick={e=>setSection('friends')} title="Mis amigos"><FriendsIcon/><span>Amigos</span></li>
        </ul>
        {
          navExpanded===false ? <button onClick={e=>setNavExpanded(true)} title="Expandir"><PushRightIcon/></button> : <button onClick={e=>setNavExpanded(false)} title="Contraer"><PushLeftIcon/></button>
        }
      </nav>

    {/* main */}
    {
      section === 'explore' && <Explore/>
    }
    {
      section === 'decks' && <Decks/>
    }
    
    </main>
   </div>
  )
}
