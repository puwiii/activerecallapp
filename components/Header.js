import React from 'react'
import Link from 'next/link'
import Logo from 'components/logos/Logo'
import {useState, useEffect} from 'react'
import {auth, onAuthStateChanged} from 'firebase/client'
import Avatar from 'components/Avatar'
import styles from 'styles/Header.module.css'
import RightArrowIcon from './icons/RightArrowIcon'

function Header() {

    const [user, setUser] = useState(undefined)

    useEffect(()=>{
        onAuthStateChanged(setUser)
        console.log(user)
    },[])

    // const jeje = ()=>{
    //     auth.currentUser.updateProfile({
    //         photoURL: 'https://i.pinimg.com/474x/74/35/c1/7435c11a830d3599e3791cbae1eba0d8.jpg'
    //     })
    // }

    return (
        <header className={styles.header}>
            <div className={styles.container}><a href="/" title="Página principal de Liza"><Logo/></a>
            {
                user===null && 
                <Link  href={"/signin"}>
                    <a className={styles.roundedButtonFilled}>
                        Iniciar sesión <RightArrowIcon/>
                    </a> 
                </Link>
            }    
            {
                user && <Avatar username={user.username} avatar={user.avatar}/>
            }
            </div>
            <style jsx>{`
                svg{
                    margin-left: 25px
                }    
            `}
            </style>
        </header>
    )
}

export default Header
