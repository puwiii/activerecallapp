import React, { useState } from "react";
import { clearDeckReference, removeDeck, removeDecksV2 } from "firebase/client";
import { useRouter } from "next/router";

//styles
import popupStyles from "styles/Popup.module.scss";

//icons
import TrashIcon from "icons/TrashIcon";
import BackIcon from "icons/BackIcon";
import CloseIcon from "icons/CloseIcon";

//components
import ScreenLoadingComponent from "components/ScreenLoadingComponent";

function RemoveDeckWindow({
  isOpen,
  closeWindow,
  deckId,
  name,
  stay = false,
  handleCardsOnDelete = false,
  paramSetLoading = null,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const remove = () => {
    closeWindow();
    removeDecksV2(deckId)
      .then(() => {
        paramSetLoading && paramSetLoading(true);
        if (handleCardsOnDelete) {
          handleCardsOnDelete();
        }
        if (!stay) {
          router.back();
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={popupStyles.windowBg + " " + (isOpen && "is-open")}>
      {loading && <ScreenLoadingComponent />}
      <div className={popupStyles.window}>
        <button onClick={(e) => closeForm()} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
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
          <button onClick={closeWindow} className={popupStyles.cancelBtn}>
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
