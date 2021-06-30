import React, {useState} from 'react'

//styles
import popupStyles from 'styles/Popup.module.scss'

//components
import SpinnerComponentCircle from 'components/SpinnerComponentCircle'
import RightArrowIcon from 'components/icons/RightArrowIcon'
import BackIcon from 'components/icons/BackIcon'

//firebase
import { isUsernameAvalaible, updateUsernameFromFirebase } from 'firebase/client'

function UpdateDeckNameWindow({ isOpen, closeWindow, deckId }) {

    const [newName, setNewName] = useState()
    const [loading, setLoading] = useState(false)

    const updateName = (e) =>{
        e.preventDefault()
        // console.log(newUsername)
        // setLoading(true)
        // isUsernameAvalaible(newUsername).then((res)=>{
        //     if(res){
        //         updateUsernameFromFirebase(newUsername).then(()=>{
        //             updateUsernameForm.reset()
        //             updateUsernameErrorMsg.style.display="none"
        //             closeWindow()
        //         })
        //     }
        //     else{
        //         updateUsernameErrorMsg.innerText= "Ups... este nombre de usuario ya esta en uso"
        //         updateUsernameErrorMsg.style.display="block"
        //         setLoading(false)
        //     }
        // })
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

                <form className={popupStyles.form} id="updateDeckNameForm">
                    <label contentEditable="true">Nuevo nombre del mazo <span className={popupStyles.required}>*</span></label>
                    <input
                        type="text"
                        placeholder="Ingresa un nombre"
                        aria-label="Ingresa un nombre" 
                        className={popupStyles.inputRounded}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <span id="updateUsernameErrorMsg" className={popupStyles.ErrorMsg}></span>
                    <button
                        tabIndex="-1"
                        type="submit"
                        onClick={(e) => updateUsername(e)}
                    />
                </form>

                <div className={popupStyles.buttons}>
                    <button className={popupStyles.primaryButton} onClick={e=>updateName(e)}>Cambiar nombre<RightArrowIcon/></button>
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

export default UpdateDeckNameWindow
