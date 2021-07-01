import React, {useState} from 'react'
import { useRouter } from 'next/router'

//styles
import popupStyles from 'styles/Popup.module.scss'

//components
import SpinnerComponentCircle from 'components/SpinnerComponentCircle'
import RightArrowIcon from 'components/icons/RightArrowIcon'
import BackIcon from 'components/icons/BackIcon'

//firebase
import { isUsernameAvalaible, updateUsernameFromFirebase } from 'firebase/client'

function UpdateUsernameWindow({ isOpen, closeWindow }) {

    const router = useRouter()

    const [newUsername, setNewUsername] = useState('')
    const [loading, setLoading] = useState(false)

    const updateUsername = (e) =>{
        e.preventDefault()
        console.log(newUsername)
        
        if(!newUsername.trim()){
            updateUsernameErrorMsg.innerText= "Ups... no puedes no tener nombre de usuario"
            updateUsernameErrorMsg.style.display="block"
            updateUsernameInput.focus()
            return
        }

        setLoading(true)
        isUsernameAvalaible(newUsername).then((res)=>{
            if(res){
                updateUsernameFromFirebase(newUsername).then(()=>{
                    router.reload()
                    closeForm()
                })
            }
            else{
                updateUsernameErrorMsg.innerText= "Ups... este nombre de usuario ya esta en uso"
                updateUsernameErrorMsg.style.display="block"
                setLoading(false)
            }
        })

    }

    const closeForm = () =>{
        updateUsernameForm.reset()
        updateUsernameErrorMsg.style.display="none"
        closeWindow()
    }

    return (
        <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}> 
            <div className={popupStyles.window}>
            {
                loading &&
                    <div className={popupStyles.loader}>
                        <SpinnerComponentCircle/>
                    </div>        
            }
                <h1 className={popupStyles.title}>Cambiar nombre</h1>

                <form className={popupStyles.form} id="updateUsernameForm">
                    <label>Nuevo nombre de usuario <span className={popupStyles.required}>*</span></label>
                    <input
                        type="text"
                        placeholder="Ingresa un nombre de usuario"
                        aria-label="Ingresa un nombre de usuario" 
                        className={popupStyles.inputRounded}
                        onChange={(e) => setNewUsername(e.target.value.trim())}
                        id="updateUsernameInput"
                    />
                    <span id="updateUsernameErrorMsg" className={popupStyles.ErrorMsg}></span>
                    <button
                        tabIndex="-1"
                        type="submit"
                        onClick={(e) => updateUsername(e)}
                    />
                </form>

                <div className={popupStyles.buttons}>
                    <button className={popupStyles.primaryButton} onClick={e=>updateUsername(e)} disabled={!newUsername}>Actualizar<RightArrowIcon/></button>
                    <button onClick={closeForm}><BackIcon/>Cancelar</button>
                </div>
            </div>

            <style jsx>{`
                .is-open {
                    display: grid !important;
                }
            `}</style>
        </div>
    )
}

export default UpdateUsernameWindow
