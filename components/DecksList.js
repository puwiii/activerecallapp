import React, { useState, useEffect } from "react";

//firebase
import { listenForDecksV2 } from "firebase/client";

//styles
import decksStyles from "styles/Decks.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

//icons
import SearchIcon from "icons/SearchIcon";
import NewFolderIcon from "icons/NewFolderIcon";

//components
import CustomSelect from "components/CustomSelect";
import DeckContainer from "components/DeckContainer";

//svgs
import NoResultsSvg from "svgs/NoResultsSvg";
import EmptySvg from "svgs/EmptySvg";
import SortAscAlphIcon from "icons/SortAscAlphIcon";
import SortDescAlphIcon from "icons/SortDescAlphIcon";
import SortAscCalIcon from "icons/SortAscCalIcon";
import SortDescCalIcon from "icons/SortDescCalIcon";
import SpinnerComponent from "./SpinnerComponent";

function DecksList({
  parentDeckId,
  openCreateDeck,
  parentCards,
  parentSetCards,
}) {
  const [decks, setDecks] = useState(null);
  const [decksForShow, setDecksForShow] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [sortState, setSortState] = useState(true);

  let mounted = false;

  useEffect(() => {
    mounted = true;
    let unsubscribeActualDeck;

    if (mounted) {
      listenForDecksV2(parentDeckId, setDecks);
    }

    return () => {
      mounted = false;
      unsubscribeActualDeck && unsubscribeActualDeck();
    };
  }, []);

  useEffect(() => {
    mounted = true;

    if (mounted) {
      if (decks) {
        setDecksForShow(decks);
      }
    }

    return () => {
      mounted = false;
      setDecksForShow(null);
    };
  }, [decks]);

  const handleSearch = (value) => {
    if (value.trim() === "") {
      setDecksForShow(decks);
    } else {
      setSearchValue(value.trim());
      const checkForInclude = (object) => {
        return object.name.toLowerCase().includes(value.trim().toLowerCase());
      };

      const newDecks = decks.filter(checkForInclude);

      setDecksForShow(newDecks);
    }
  };

  const sortDecksByNameAsc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      if (a.name === b.name) return 0;
    });
    setDecksForShow(newDecks);
  };

  const sortDecksByNameDesc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      if (a.name === b.name) return 0;
    });

    setDecksForShow(newDecks);
  };

  const sortDecksByCreatedAsc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.createdAt.seconds < b.createdAt.seconds) return -1;
      if (a.createdAt.seconds > b.createdAt.seconds) return 1;
      if (a.createdAt.seconds === b.createdAt.seconds) return 0;
    });

    setDecksForShow(newDecks);
  };

  const sortDecksByCreatedDesc = () => {
    const newDecks = decksForShow.sort((a, b) => {
      if (a.createdAt.seconds < b.createdAt.seconds) return 1;
      if (a.createdAt.seconds > b.createdAt.seconds) return -1;
      if (a.createdAt.seconds === b.createdAt.seconds) return 0;
    });

    setDecksForShow(newDecks);
  };

  const sortOptions = [
    {
      value: "nameAsc",
      action: sortDecksByNameAsc,
      component: (
        <>
          <SortAscAlphIcon />
          <span>Nombre ascendete</span>
        </>
      ),
    },
    {
      value: "nameDesc",
      action: sortDecksByNameDesc,
      component: (
        <>
          <SortDescAlphIcon />
          <span>Nombre descendiente</span>
        </>
      ),
    },
    {
      value: "createdAsc",
      action: sortDecksByCreatedAsc,
      component: (
        <>
          <SortAscCalIcon />
          <span>Fecha de creación (asc)</span>
        </>
      ),
    },
    {
      value: "createdDesc",
      action: sortDecksByCreatedDesc,
      component: (
        <>
          <SortDescCalIcon />
          <span>Fecha de creación (decs)</span>
        </>
      ),
    },
  ];

  return (
    <div className={`decks ${decksStyles.container}`}>
      <h3 className={decksStyles.decks__subtitle}>Sub mazos</h3>

      {decks?.length > 0 && (
        <div className={decksStyles.toolbar}>
          <div className={componentsStyles.searchInput}>
            <SearchIcon />
            <input
              type="text"
              name="searchInput"
              id="searchInput"
              autoComplete="off"
              placeholder="Buscar mazo 🛰️..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {decksForShow && (
            <CustomSelect
              options={sortOptions}
              setState={setSortState}
              defaultAction={sortDecksByNameAsc}
            />
          )}
        </div>
      )}

      {decksForShow ? (
        <>
          {decks.length === 0 ? (
            <div className={decksStyles.emptyData}>
              <EmptySvg />
              <div>
                <h2>Aun no tienes submazos creados.</h2>
                <p>
                  Comienza creando uno presionando en el boton "Crear un nuevo
                  mazo"
                </p>
                <button
                  className={`${decksStyles.roundedButtonTerciary}`}
                  onClick={openCreateDeck}
                >
                  <NewFolderIcon /> Crear un nuevo mazo
                </button>
              </div>
            </div>
          ) : (
            <>
              {decksForShow.length === 0 ? (
                <div className={decksStyles.noResults}>
                  <h2>
                    No hay resultados para esta busqueda... <br />
                    <strong>{searchValue}</strong>
                  </h2>
                  <NoResultsSvg />
                </div>
              ) : (
                <div className={decksStyles.decks}>
                  {decksForShow.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      deckId={deck.id}
                      name={deck.name}
                      description={deck.description}
                      isPublic={deck.isPublic}
                      parentDeckId={parentDeckId}
                      paramCards={parentCards}
                      paramSetCards={parentSetCards}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className={decksStyles.decks}>
          <DeckContainer loadingContainer={true} />
        </div>
      )}

      {/* {decks ? (
        <>
          {decks.length > 0 ? (
            <>
              {decksForShow?.length > 0 ? (
                <div className={decksStyles.decks}>
                  {decksForShow.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      deckId={deck.id}
                      name={deck.name}
                      description={deck.description}
                      isPublic={deck.isPublic}
                      parentDeckId={parentDeckId}
                      paramCards={parentCards}
                      paramSetCards={parentSetCards}
                    />
                  ))}
                </div>
              ) : (
                <div className={decksStyles.noResults}>
                  <h2>
                    No hay resultados para esta busqueda... <br />
                    <strong>{searchValue}</strong>
                  </h2>
                  <NoResultsSvg />
                </div>
              )}
            </>
          ) : (
            <div className={decksStyles.emptyData}>
              <EmptySvg />
              <div>
                <h2>Aun no tienes submazos creados.</h2>
                <p>
                  Comienza creando uno presionando en el boton "Crear un nuevo
                  mazo"
                </p>
                <button
                  className={`${decksStyles.roundedButtonTerciary}`}
                  onClick={openCreateDeck}
                >
                  <NewFolderIcon /> Crear un nuevo mazo
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={decksStyles.decks}>
          <DeckContainer loadingContainer={true} />
        </div>
      )} */}
    </div>
  );
}

export default DecksList;
