import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

//styles
import cardsStyles from "styles/Cards.module.scss";
import popupStyles from "styles/Popup.module.scss";

//components
import CardContainer from "components/CardContainer";

//icons
import BackIcon from "icons/BackIcon";
import CloseIcon from "icons/CloseIcon";
import SearchIcon from "icons/SearchIcon";
import SpinnerComponentCircle from "components/SpinnerComponentCircle";

//svgs
import NoResultsSvg from "svgs/NoResultsSvg";

function CardsWindow({ cards = null, isOpen, closeWindow }) {
  const [loading, setLoading] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(cards);
  const [searchValue, setSearchValue] = useState("");

  let timer;

  const handleSearch = (value) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setLoading(true);
      setSearchValue(value);
      if (value === "") {
        setCardsToShow(cards);
      } else {
        const checkForString = (block) => {
          return block.text.toLowerCase().includes(value.toLowerCase());
        };

        const checkForBlocks = (card) => {
          for (let i = 0; i < card.front.blocks.length; i++) {
            if (checkForString(card.front.blocks[i])) {
              return true;
            }
          }
        };

        const newCards = cards.filter(checkForBlocks);

        console.log(newCards);
        setCardsToShow(newCards);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={popupStyles.windowBg}>
      <div className={popupStyles.window}>
        <button onClick={closeWindow} className={popupStyles.closeBtn}>
          <CloseIcon />
        </button>
        <h1 className={popupStyles.title}>Tarjetas</h1>
        <div className={popupStyles.toolbar}>
          <div className={popupStyles.searchInput}>
            <SearchIcon />
            <input
              type="text"
              name="searchInput"
              id="searchInput"
              autoComplete="off"
              placeholder="Buscar tarjeta..."
              onKeyUp={(e) => handleSearch(e.target.value.trim())}
            />
            {loading && <SpinnerComponentCircle size={30} />}
          </div>
        </div>
        <div className={cardsStyles.cards}>
          {cardsToShow.length === 0 && (
            <div className={cardsStyles.noResults}>
              <h2>
                No hay resultados para esta busqueda... <br />
                <strong>{searchValue}</strong>
              </h2>
              <NoResultsSvg />
            </div>
          )}
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              1200: 2,
              1800: 3,
              2400: 4,
              3000: 5,
            }}
          >
            <Masonry gutter="20px">
              {cardsToShow.map((card) => (
                <CardContainer
                  key={card.id}
                  cardId={card.id}
                  data={card.front}
                  createdAt={card.createdAt}
                  type="Frente"
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>

        <div className={popupStyles.buttons}>
          <button onClick={closeWindow} className={popupStyles.cancelBtn}>
            <BackIcon />
            Cerrar
          </button>
        </div>
      </div>
      <style jsx>{`
        .${popupStyles.windowBg} {
          display: ${isOpen ? "grid" : "none"};
        }

        .${popupStyles.window} {
          max-width: none;
          height: 90%;
        }

        .${popupStyles.buttons} {
          flex-direction: row;
        }
      `}</style>
    </div>
  );
}

export default CardsWindow;
