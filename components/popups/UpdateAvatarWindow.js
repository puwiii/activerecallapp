import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  updateUserAvatar,
  uploadAvatarImage,
  uploadAvatarImageTemp,
} from "firebase/client";
import Image from "next/image";

//styles
import popupStyles from "styles/Popup.module.scss";

//icons
import UploadIcon from "icons/UploadIcon";
import BackIcon from "icons/BackIcon";
import PictureIcon from "icons/PictureIcon";

//components
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

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
};

function UpdateAvatarWindow({ isOpen, closeWindow }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE);
  const [task, setTask] = useState(null);
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);

  const closeForm = () => {
    setTask(null);
    setImgURL(null);
    setDrag(DRAG_IMAGE_STATES.NONE);
    updateAvatarForm.reset();
    closeWindow();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);

    if (e.dataTransfer.files.length > 0) {
      if (
        e.dataTransfer.files[0].type === "image/png" ||
        e.dataTransfer.files[0].type === "image/jpg" ||
        e.dataTransfer.files[0].type === "image/jpeg"
      ) {
        updateAvatarErrorMsg.style.display = "none";
        const file = e.dataTransfer.files[0];
        setFile(file);
        const task = uploadAvatarImageTemp(file);
        setTask(task);
      } else {
        updateAvatarErrorMsg.innerText =
          "Ups... Puede ser que no estes subiendo una imagen, asegúrate de que el arhivo sea PNG, JPEG o JPG";
        updateAvatarErrorMsg.style.display = "block";
      }
    } else {
      updateAvatarErrorMsg.innerText =
        "Mmm... Ni siquiera se que intentaste arrastrar.";
      updateAvatarErrorMsg.style.display = "block";
    }
  };

  const handleLoad = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);

    if (e.target.files.length > 0) {
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpg" ||
        e.target.files[0].type === "image/jpeg"
      ) {
        updateAvatarErrorMsg.style.display = "none";
        const file = e.target.files[0];
        setFile(file);
        const task = uploadAvatarImageTemp(file);
        setTask(task);
      } else {
        updateAvatarErrorMsg.innerText =
          "Ups... ¿Puede ser que no estes subiendo una imagen? asegúrate de que el arhivo sea PNG, JPEG o JPG";
        updateAvatarErrorMsg.style.display = "block";
      }
    }
  };

  const updateAvatar = () => {
    //setLoading(true);
    const task = uploadAvatarImage(file);

    console.log(task);
    //   let onComplete = () => {
    //     task.snapshot.ref.getDownloadURL().then((url) => {
    //       setLoadingImage(false);
    //       updateUserAvatar(imgURL)
    //         .then(() => {
    //           setLoading(false);
    //           //router.reload();
    //           closeForm();
    //         })
    //         .catch((error) => {
    //           setLoading(false);
    //           console.error(error);
    //         });
    //     });
    //   };
    //   setLoading(false);
    //   console.log(task);
    //   task.on("state_changed", onComplete);
    let onProgress = () => {};
    let onError = () => {};
    let onComplete = () => {
      task.snapshot.ref.getDownloadURL().then((url) => {
        updateUserAvatar(url)
          .then(() => {
            setLoading(false);
            router.reload();
            closeForm();
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      });
    };

    task.on("state_changed", onProgress, onError, onComplete);
  };

  useEffect(() => {
    if (task) {
      let onProgress = () => {
        setLoadingImage(true);
      };
      let onError = () => {
        setLoadingImage(false);
      };
      let onComplete = () => {
        task.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          setImgURL(url);
          setLoadingImage(false);
        });
      };

      task.on("state_changed", onProgress, onError, onComplete);
    }
  }, [task]);

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      <div className={popupStyles.window}>
        {loading && (
          <div className={popupStyles.loader}>
            <SpinnerComponentCircle />
          </div>
        )}
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
            {loadingImage ? (
              <SpinnerComponentCircle />
            ) : (
              <>
                {imgURL ? (
                  <Image
                    src={imgURL}
                    quality={100}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <>
                    <PictureIcon height={50} width={50} />
                    Arrastra una imagen o presiona para subir desde tu
                    dispositivo
                  </>
                )}
              </>
            )}
          </label>
          <input type="file" id="file-upload" onChange={handleLoad} />
          <span
            id="updateAvatarErrorMsg"
            className={popupStyles.ErrorMsg}
          ></span>
        </form>

        <div className={popupStyles.buttons}>
          <button
            className={popupStyles.primaryButton}
            onClick={updateAvatar}
            disabled={!imgURL}
          >
            <UploadIcon />
            Subir foto
          </button>
          <button onClick={closeForm}>
            <BackIcon />
            Cancelar
          </button>
        </div>
      </div>

      <style jsx>{`
        .is-open {
          display: grid !important;
        }

        input[type="file"] {
          display: none;
        }

        .dragAndDrop {
          overflow: hidden;
          opacity: ${drag === DRAG_IMAGE_STATES.DRAG_OVER ? ".8" : ".4"};
          background-color: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "rgba(0,0,0,.04)"
            : "transparent"};
          position: relative;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2em;
          transition: opacity 100ms ease-in-out,
            background-color 100ms ease-in-out;
          border-radius: ${imgURL ? "50%" : "21px"};
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "2px dashed rgba(0,0,0,.2)"
            : "2px solid rgba(0,0,0,.05)"};
          ${imgURL && "opacity: 1;"}
        }

        .dragAndDrop:hover {
          background-color: rgba(0, 0, 0, 0.04);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default UpdateAvatarWindow;
