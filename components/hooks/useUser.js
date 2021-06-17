import { onAuthStateChanged } from 'firebase/client'
import {useState, useEffect} from 'react'

export const USER_STATES = {
    NOT_LOGGED: null,
    NOT_KNOWN: undefined,
}

export default function useUser() {
    const [user, setUser] = useState(USER_STATES.NOT_KNOWN)

    useEffect(()=>{
        onAuthStateChanged(setUser)
    }, [])

    return user
}