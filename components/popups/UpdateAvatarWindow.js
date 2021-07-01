import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { updateUserAvatar, uploadAvatarImage } from 'firebase/client'
import Image from 'next/image'

//styles
import popupStyles from 'styles/Popup.module.scss'

//components
import UploadIcon from 'components/icons/UploadIcon'
import BackIcon from 'components/icons/BackIcon'
import PictureIcon from 'components/icons/PictureIcon'

// const INPUT_STATES = {
//     ERROR: -1,
//     NONE: 0,
//     DRAG_OVER: 1,
//     UPLOADING: 2,
//     COMPLETE: 3,
// }

const DRAG_IMAGE_STATES = {
    ERROR: -1,
    NONE: 0,
    DRAG_OVER: 1,
    UPLOADING: 2,
    COMPLETE: 3,
}

function UpdateAvatarWindow({ isOpen, closeWindow }) {

    const router = useRouter()

    const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
    const [task, setTask] = useState(null)
    const [imgURL, setImgURL] = useState(null)

    const closeForm = () =>{
        setTask(null)
        setImgURL(null)
        setDrag(DRAG_IMAGE_STATES.NONE)
        updateAvatarForm.reset()
        closeWindow()
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDrag(DRAG_IMAGE_STATES.NONE)
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDrag(DRAG_IMAGE_STATES.NONE)
        if(e.dataTransfer.files[0].type==="image/png" || e.dataTransfer.files[0].type==="image/jpg" || e.dataTransfer.files[0].type==="image/jpeg"){
            updateAvatarErrorMsg.style.display="none"
            const file = e.dataTransfer.files[0]
            const task = uploadAvatarImage(file)
            setTask(task)
        }
        else{
            updateAvatarErrorMsg.innerText= "Ups... ¿Puede ser que no estes subiendo una imagen? asegúrate de que el arhivo sea PNG, JPEG o JPG"
            updateAvatarErrorMsg.style.display="block"
        }
    }

    const handleLoad = (e) => {
        console.log(e)
        e.preventDefault()
        setDrag(DRAG_IMAGE_STATES.NONE)
        if(e.target.files){
            if(e.target.files[0].type==="image/png" || e.target.files[0].type==="image/jpg" || e.target.files[0].type==="image/jpeg"){
                updateAvatarErrorMsg.style.display="none"
                const file = e.target.files[0]
                const task = uploadAvatarImage(file)
                setTask(task)
            }
            else{
                updateAvatarErrorMsg.innerText= "Ups... ¿Puede ser que no estes subiendo una imagen? asegúrate de que el arhivo sea PNG, JPEG o JPG"
                updateAvatarErrorMsg.style.display="block"
            }
        }
    }

    const updateAvatar = () =>{
        updateUserAvatar(imgURL)
        .then(()=>{
            router.reload()
            closeForm()
        })
        .catch((e)=>{
            console.log(e)
        })

    }

    useEffect(()=>{
        if(task){
            
            let onProgress = () => {}
            let onError = () => {}
            let onComplete = () => {
                task.snapshot.ref.getDownloadURL()
                .then(setImgURL)
            }

            task.on('state_changed',
            onProgress,
            onError,
            onComplete
            )

        }
    },[task])

    return (
        <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}> 
            <div className={popupStyles.window}>
                <h1 className={popupStyles.title}>Cambiar foto</h1>

                <form className={popupStyles.form} id="updateAvatarForm">
                    <label 
                        htmlFor="file-upload" 
                        className="dragAndDrop"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}  
                        onDragOver={handleDragOver}
                        onDrop={handleDrop} 
                    >
                        <PictureIcon height={50} width={50}/>
                        Arrastra una imagen o presiona para subir desde tu dispositivo
                        {imgURL &&
                            <Image
                                src={imgURL}
                                quality={100}
                                layout="fill"
                                objectFit="cover"
                            />
                        }
                    </label>
                    <input 
                        type="file" 
                        id="file-upload"
                        onChange={handleLoad}
                    />
                    <span id="updateAvatarErrorMsg" className={popupStyles.ErrorMsg}></span>
                </form>

                <div className={popupStyles.buttons}>
                    <button className={popupStyles.primaryButton} onClick={updateAvatar} disabled={!imgURL}><UploadIcon/>Subir foto</button>
                    <button onClick={closeForm}><BackIcon/>Cancelar</button>
                </div>
            </div>

            <style jsx>{`
                .is-open {
                    display: grid !important;
                }
                
                input[type="file"] {
                    display: none;
                }

                .dragAndDrop{
                    position: relative;
                    cursor: pointer;
                    aspect-ratio: 1 / 1;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2em;
                    border-radius: 7px;
                    border: ${ drag === DRAG_IMAGE_STATES.DRAG_OVER ? "2px dashed rgba(0,0,0,.5)" : "2px solid rgba(0,0,0,.05)"};
                }
            `}</style>
        </div>
    )
}

export default UpdateAvatarWindow
