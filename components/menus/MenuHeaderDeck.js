import React, { useEffect, useState } from "react";

//styles
import styles from "styles/Menu.module.scss";

//icons
import WriteIcon from "icons/WriteIcon";

//components
import UpdateDeckNameWindow from "components/popups/UpdateDeckNameWindow";
import UpdateDeckDescriptionWindow from "components/popups/UpdateDeckDescriptionWindow";

//hooks
import { useModal } from "hooks/useModal";

function MenuHeaderDeck({
  xCoord,
  yCoord,
  deckId,
  closeWindow,
  isOpen,
  deckName,
  deckDescription,
}) {
  const [isOpenUpdateNameDeck, openUpdateNameDeck, closeUpdateNameDeck] =
    useModal(false);
  const [
    isOpenUpdateDescriptionDeck,
    openUpdateDescriptionDeck,
    closeUpdateDescriptionDeck,
  ] = useModal(false);

  const handleClick = (e) => {
    if (e.target.classList.contains("menuDeck")) closeWindow();
  };

  return (
    <div
      className={`${styles.menuContainer} menuDeck`}
      onMouseUp={(e) => handleClick(e)}
    >
      <div className={styles.menu}>
        <ul className={styles.options}>
          <li
            onClick={openUpdateNameDeck}
            className={styles.roundedButtonTerciary}
          >
            <WriteIcon />
            Cambiar nombre
          </li>
          <li
            onClick={openUpdateDescriptionDeck}
            className={styles.roundedButtonTerciary}
          >
            <WriteIcon />
            Cambiar descripción
          </li>
        </ul>
      </div>
      {isOpenUpdateNameDeck && (
        <UpdateDeckNameWindow
          isOpen={isOpenUpdateNameDeck}
          closeWindow={closeUpdateNameDeck}
          deckId={deckId}
          deckName={deckName}
        />
      )}

      {isOpenUpdateDescriptionDeck && (
        <UpdateDeckDescriptionWindow
          isOpen={isOpenUpdateDescriptionDeck}
          closeWindow={closeUpdateDescriptionDeck}
          deckId={deckId}
          description={deckDescription}
        />
      )}

      <style jsx>{`
        .${styles.menu} {
          transform-origin: top right;
          top: ${yCoord + 6}px;
          right: ${window.innerWidth - xCoord}px;
        }
      `}</style>
    </div>
  );
}

export default MenuHeaderDeck;
