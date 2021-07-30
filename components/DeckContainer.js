import Link from "next/link";
import React, { useEffect, useState } from "react";

//firebase
import { getCardsForStudyV2 } from "firebase/client";

//styles
import styles from "styles/Deck.module.scss";

//components
import MenuDeck from "components/menus/MenuDeck";
import FolderIcon from "icons/FolderIcon";
import VerticalMenuIcon from "icons/VerticalMenuIcon";

//hooks
import { useModal } from "hooks/useModal";

function DeckContainer({
  deckId,
  name,
  description,
  isPoster,
  paramCards,
  paramSetCards,
}) {
  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);

  const [cards, setCards] = useState(null);
  const [createdCards, setCreatedCards] = useState(0);
  const [studiedCards, setStudiedCards] = useState(0);
  const [learnedCards, setLearnedCards] = useState(0);

  const [isOpenMenuDeck, openMenuDeck, closeMenuDeck] = useModal(false);

  let mounted = false;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setXCoord(e.clientX);
    setYCoord(e.clientY);
    openMenuDeck();
  };

  const handleVerticalMenu = (e) => {
    e.stopPropagation();
    let newXCoord =
      e.target.parentElement.offsetLeft +
      e.target.parentElement.offsetWidth +
      5;
    let newYCoord = e.target.parentElement.offsetTop;
    setXCoord(newXCoord);
    setYCoord(newYCoord);
    if (isOpenMenuDeck) {
      closeMenuDeck();
    } else {
      openMenuDeck();
    }
  };

  useEffect(() => {
    mounted = true;

    if (mounted) {
      getCardsForStudyV2(deckId).then((cards) => {
        setCards(cards);
      });
    }

    return () => {
      setCards(null);
      mounted = false;
    };
  }, []);

  // getCardsForStudyV2(deckId).then((cards) => {
  //   setCards(cards);
  // });

  useEffect(() => {
    mounted = true;

    if (mounted) {
      if (cards) {
        let created = 0;
        let studied = 0;
        let learned = 0;

        cards.length > 0 &&
          cards.map((card) => {
            if (card.status === 0) created++;
            if (card.status === 1) studied++;
            if (card.status === 2) learned++;
          });

        setCreatedCards(created);
        setStudiedCards(studied);
        setLearnedCards(learned);
      }
    }

    return () => {
      setCreatedCards(0);
      setStudiedCards(0);
      setLearnedCards(0);
      mounted = false;
    };
  }, [cards]);

  const handleCardsOnDelete = () => {
    const idCards = cards.map((card) => {
      return card.id;
    });
    const filteredCards = paramCards.filter(
      (card) => !idCards.includes(card.id)
    );
    paramSetCards(filteredCards);
  };

  return (
    <div className={styles.deckContainer}>
      <Link href={`/decks/${deckId}`}>
        <a
          className={`${styles.deck} ${isPoster && styles.poster}`}
          onContextMenu={(e) => handleContextMenu(e)}
          title={`${name}: ${description}`}
        >
          <div className={styles.deck__icon}>
            <FolderIcon />
          </div>
          <span id={`${deckId}name`} title={name}>
            {name}
          </span>
          <p
            className={`${description === "" && "emptyDescription"}`}
            title={description}
          >
            {description === "" ? "Sin descripción" : description}
          </p>

          <div className={styles.cards}>
            <span title={createdCards}>{createdCards}</span>
            <span title={studiedCards}>{studiedCards}</span>
            <span title={learnedCards}>{learnedCards}</span>
          </div>

          <div
            className={styles.deckMenuButton}
            id={`${deckId}button`}
            onClick={(e) => handleVerticalMenu(e)}
            title="Mas opciones"
          >
            <VerticalMenuIcon />
          </div>
        </a>
      </Link>
      {isOpenMenuDeck && (
        <MenuDeck
          xCoord={xCoord}
          yCoord={yCoord}
          isOpen={isOpenMenuDeck}
          closeWindow={closeMenuDeck}
          deckId={deckId}
          name={name}
          description={description}
          handleCardsOnDelete={handleCardsOnDelete}
        />
      )}

      <style jsx>{`
        .emptyDescription {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

export default DeckContainer;
