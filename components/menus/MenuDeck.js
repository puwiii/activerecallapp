import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

//styles
import styles from "styles/Menu.module.scss";

//icons
import TrashIcon from "icons/TrashIcon";
import WriteIcon from "icons/WriteIcon";
import LightningIcon from "icons/LightningIcon";

//components
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";
import UpdateDeckNameWindow from "components/popups/UpdateDeckNameWindow";
import UpdateDeckDescriptionWindow from "components/popups/UpdateDeckDescriptionWindow";

//hooks
import { useModal } from "hooks/useModal";

function MenuDeck({
  xCoord,
  yCoord,
  deckId,
  closeWindow,
  name,
  description,
  handleCardsOnDelete = false,
}) {
  let mounted = false;

  const [toLeft, setToLeft] = useState(false);
  const [toUp, setToUp] = useState(false);
  const [newXCoord, setNewXCoord] = useState();
  const [newYCoord, setNewYCoord] = useState();

  const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);
  const [isOpenUpdateNameDeck, openUpdateNameDeck, closeUpdateNameDeck] =
    useModal(false);
  const [
    isOpenUpdateDescriptionDeck,
    openUpdateDescriptionDeck,
    closeUpdateDescriptionDeck,
  ] = useModal(false);

  useEffect(() => {
    mounted = true;
    if (mounted) {
      if (xCoord > window.innerWidth / 2) {
        setToLeft(true);
        setNewXCoord(window.innerWidth - xCoord);
      }

      if (yCoord > window.innerHeight / 2) {
        setToUp(true);
        setNewYCoord(window.innerHeight - yCoord);
      }
    }

    return () => (mounted = false);
  }, []);

  const handleClick = (e) => {
    if (e.target.classList.contains("menuDeck")) closeWindow();
  };

  return (
    <div
      className={`${styles.menuContainer} menuDeck`}
      onMouseUp={(e) => handleClick(e)}
    >
      <div className={styles.menu}>
        <span className={styles.title}>{name}</span>
        <ul className={styles.options}>
          <li
            className={styles.mainOption}
            //onClick={(e) => handleStudyButton(e)}
          >
            <LightningIcon />
            Estudiar mazo
          </li>
          <hr />
          <li onClick={openUpdateNameDeck}>
            <WriteIcon />
            Cambiar nombre
          </li>
          <li onClick={openUpdateDescriptionDeck}>
            <WriteIcon />
            Cambiar descripción
          </li>
          <hr />
          <li className={styles.redOption} onClick={(e) => openRemoveDeck(e)}>
            <TrashIcon />
            Eliminar mazo
          </li>
        </ul>
      </div>

      {isOpenRemoveDeck && (
        <RemoveDeckWindow
          isOpen={isOpenRemoveDeck}
          closeWindow={closeRemoveDeck}
          deckId={deckId}
          name={name}
          stay={true}
          handleCardsOnDelete={handleCardsOnDelete}
        />
      )}

      {isOpenUpdateNameDeck && (
        <UpdateDeckNameWindow
          isOpen={isOpenUpdateNameDeck}
          closeWindow={closeUpdateNameDeck}
          deckId={deckId}
          deckName={name}
        />
      )}

      {isOpenUpdateDescriptionDeck && (
        <UpdateDeckDescriptionWindow
          isOpen={isOpenUpdateDescriptionDeck}
          closeWindow={closeUpdateDescriptionDeck}
          deckId={deckId}
          description={description}
        />
      )}

      <style jsx>{`
        .${styles.menu} {
          transform-origin: ${toUp ? "bottom" : "top"}
            ${toLeft ? " right" : " left"};
          position: absolute;
          ${toLeft ? `right: ${newXCoord}px;` : `left: ${xCoord}px;`}
          ${toUp ? `bottom: ${newYCoord}px;` : `top: ${yCoord}px;`}
        }
      `}</style>
    </div>
  );
}

export default MenuDeck;
