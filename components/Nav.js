import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

//styles
import styles from 'styles/Nav.module.scss'

//components
import ExploreIcon from 'components/icons/ExploreIcon'
import DecksIcon from 'components/icons/DecksIcon'
import FriendsIcon from 'components/icons/FriendsIcon'
import PushLeftIcon from 'components/icons/PushLeftIcon'
import PushRightIcon from 'components/icons/PushRightIcon'



function Nav() {

    const[navContracted, setNavContracted] = useState()
    
    const router = useRouter()

    useEffect(() => {
        
        console.log("primer useEffect: renderiza cuando Nav.js es llamado")
        console.log(`el estado de navContracted es >>> ${navContracted}`)

        if(localStorage.getItem('navContracted')) setNavContracted(JSON.parse(localStorage.getItem('navContracted')))
        else{
            setNavContracted(false)
            localStorage.setItem('navContracted', navContracted)
        } 

    }, [])

    useEffect(()=>{

        if(router.pathname.includes('decks')){
            DecksLink.classList.add(styles.selected)
            if(ExploreLink.classList.contains(styles.selected)) ExploreLink.classList.remove(styles.selected)
            return
        }
        else{
            ExploreLink.classList.add(styles.selected)
            if(DecksLink.classList.contains(styles.selected)) DecksLink.classList.remove(styles.selected)
        }

    
    },[router.pathname])

    useEffect(()=>{

        console.log("segundo useEffect: renderiza cuando navContracted cambia")
        console.log(`el estado de navContracted es >>> ${navContracted}`)
        console.log(navContracted)

        localStorage.setItem('navContracted', navContracted)

        if(navContracted === true){
            console.log("se remueve el estilo expandido")
            document.getElementById('nav').classList.remove(styles.expanded)
        } 
        else{
            console.log("se agrega el estilo expandido")
            document.getElementById('nav').classList.add(styles.expanded)   
        } 

    },[navContracted])


    
    return (
        <nav className={styles.nav} id="nav">
            <ul>
                <li title="Explorar" id="ExploreLink">
                    <Link href={"/"}>
                        <div><ExploreIcon/><span>Explorar</span></div>
                    </Link>
                </li>
                <li title="Mis mazos" id="DecksLink">
                    <Link href={`/decks`}>
                        <div><DecksIcon/><span>Mis mazos</span></div>
                    </Link>
                </li>
                <li title="Mis amigos" id="FriendsLink">
                    <div><FriendsIcon/><span>Amigos</span></div>
                </li>
            </ul>
            {
            navContracted===false ? 
                <button onClick={e=>setNavContracted(true)} title="Contraer"><PushLeftIcon/></button> 
            : 
                <button onClick={e=>setNavContracted(false)} title="Expandir"><PushRightIcon/></button>
            }
      </nav>
    )
}

export default Nav
