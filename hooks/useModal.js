import {useState} from 'react'

export const useModal = (initalValue = false)=>{
    const [isOpen, setIsOpen] = useState(initalValue)

    const openModal = () => setIsOpen(true)

    const closeModal = () => setIsOpen(false)

    return [isOpen, openModal, closeModal]
}