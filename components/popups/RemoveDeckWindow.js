import React, { useState } from "react";
import { clearDeckReference, removeDeck, removeDecksV2 } from "firebase/client";
import { useRouter } from "next/router";

//styles
import popupStyles from "styles/Popup.module.scss";

//icons
import TrashIcon from "icons/TrashIcon";
import BackIcon from "icons/BackIcon";

//components
import ScreenLoadingComponent from "components/ScreenLoadingComponent";

function RemoveDeckWindow({ isOpen, closeWindow, deckId, name, stay = false }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const remove = () => {
    closeWindow();
    removeDecksV2(deckId)
      .then(() => {
        stay ? null : router.back();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {loading && <ScreenLoadingComponent />}
      <div className={popupStyles.window}>
        <h1 className={popupStyles.title}>¡Cuidado!</h1>
        <p className={popupStyles.description}>
          Si eliminas el mazo <strong>"{name}"</strong>, todo su contenido
          tambien se eliminará. Asegurate de que eso es lo que quieres
        </p>
        <div className={popupStyles.buttons}>
          <button className={popupStyles.removeBtn} onClick={remove}>
            <TrashIcon />
            Eliminar
          </button>
          <button onClick={closeWindow}>
            <BackIcon />
            Cancelar
          </button>
        </div>
      </div>

      <style jsx>{`
        .is-open {
          display: grid !important;
        }

        h1 {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default RemoveDeckWindow;
