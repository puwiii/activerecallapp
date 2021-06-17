import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from 'styles/Nav.module.scss'
import ExploreIcon from 'components/icons/ExploreIcon'
import DecksIcon from 'components/icons/DecksIcon'
import FriendsIcon from 'components/icons/FriendsIcon'
import PushLeftIcon from 'components/icons/PushLeftIcon'
import PushRightIcon from 'components/icons/PushRightIcon'
import { useRouter } from 'next/router'


function Nav() {

    const[navExpanded, setNavExpanded] = useState()

    const router = useRouter()

    useEffect(() => {

        if(localStorage.getItem('navContracted')) setNavExpanded(localStorage.getItem('navContracted'))

    }, [])

    useEffect(()=>{

        localStorage.setItem('navContracted', navExpanded)

        if(localStorage.getItem('navContracted') === "true"){

            document.getElementById('nav').classList.add(styles.expanded)
        } 
        else{

            document.getElementById('nav').classList.remove(styles.expanded)
        } 

    },[navExpanded])

    
    return (
        <nav className={styles.nav} id="nav">
            <ul>
                <li title="Explorar" id="ExploreLink">
                    <Link href={"/"}>
                        <div><ExploreIcon/><span>Explorar</span></div>
                    </Link>
                </li>
                <li title="Mis mazos" id="DecksLink">
                    <Link href={`/decks`} >
                        <div><DecksIcon/><span>Mis mazos</span></div>
                    </Link>
                </li>
                <li title="Mis amigos" id="FriendsLink">
                    <div><FriendsIcon/><span>Amigos</span></div>
                </li>
            </ul>
            {
            navExpanded===false ? <button onClick={e=>setNavExpanded(true)} title="Expandir"><PushRightIcon/></button> : <button onClick={e=>setNavExpanded(false)} title="Contraer"><PushLeftIcon/></button>
            }
      </nav>
    )
}

export default Nav
