import React, { useEffect, useState } from "react";
import Head from 'next/head'
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//firebase
import { listenForDeck } from "firebase/client";

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, {USER_STATES} from "components/hooks/useUser";

//components
import CardContainer from "components/CardContainer";
import DeckContainer from "components/DeckContainer";
import SpinnerComponent from "components/SpinnerComponent";
import NewFolderIcon from "components/icons/NewFolderIcon";
import CreateIcon from "components/icons/CreateIcon";
import TrashIcon from "components/icons/TrashIcon";
import SettingsIcon from "components/icons/SettingsIcon";

//popups
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";
import CreateCardWindow from "components/popups/CreateCardWindow";
import MenuHeaderDeck from "components/menus/MenuHeaderDeck";

function index() {

  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);
  const [isOpenCreateCard, openCreateCard, closeCreateCard] = useModal(false);
  const [isOpenMenuHeaderDeck, openMenuHeaderDeck, closeMenuHeaderDeck] = useModal(false);
  

  const [loading, setLoading] = useState(true)
  const [idDeck, setIdDeck] = useState()
  const [idParentDeck, setIdParentDeck] = useState()
  const [actualDeck, setActualDeck] = useState()
  const [decks, setDecks] = useState();
  const [cards, setCards] = useState();

  const[xCoord, setXCoord] = useState()
  const[yCoord, setYCoord] = useState()

  let user = useUser();

  const router = useRouter();

  const handleMenuHeaderDeck = (e) => {
    e.preventDefault()

    let newXCoord = e.target.offsetLeft + e.target.offsetWidth
    let newYCoord = e.target.offsetTop + e.target.offsetHeight

    setXCoord(newXCoord)
    setYCoord(newYCoord)

    if(isOpenMenuHeaderDeck){
      closeMenuHeaderDeck()
    }
    else{
      openMenuHeaderDeck()
    }
  }

  //check for user
  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }
  }, [user]);

  useEffect(()=>{
    setIdDeck(router.query.id)
  }, [router.query.id])

  useEffect(()=>{
    setIdParentDeck(router.query.from)
  },[router.query.from])

  useEffect(()=>{
    if(idDeck) {
      listenForDeck(idDeck, setActualDeck, setDecks, setCards)
    }
  }, [idDeck])

  useEffect(()=>{
    if(decks){
      setLoading(false)
    }
  }, [decks])

  return (
    <main className={styles.main}>
      <Head>
        <title>{actualDeck ? `Mis Mazos - ${actualDeck.name}` : "Mis Mazos - Liza"}</title>
      </Head>
      {/* <h1 className={styles.title}>Mis Mazos</h1> */}
      
      {actualDeck ? 
        <div className={decksStyles.header}>
          <h1 className={styles.subtitle}>{actualDeck.name}</h1>
          <div>
            <button onClick={openRemoveDeck}><TrashIcon/><span>Eliminar mazo</span></button>
            <button onClick={e=>handleMenuHeaderDeck(e)}><SettingsIcon/><span>Editar mazo</span></button>
            {isOpenMenuHeaderDeck &&
              <MenuHeaderDeck 
                xCoord={xCoord}
                yCoord={yCoord}
                deckId={idDeck} 
                isOpen={isOpenMenuHeaderDeck} 
                closeWindow={closeMenuHeaderDeck}
              />
            }
          </div>
        </div>
        
        
        : 
        <SpinnerComponent/>
      }
     
      <hr/>
      
      <section>

        {/* popups */}

        {
          isOpenCreateDeck && 
          <CreateDeckWindow
            isOpen={isOpenCreateDeck}
            closeWindow={closeCreateDeck}
            deckId={idDeck}
          />
        }
        
        {
          isOpenCreateCard &&
          <CreateCardWindow
            isOpen={isOpenCreateCard}
            closeWindow={closeCreateCard}
            deckId={idDeck}
          />
        }

        {
          isOpenRemoveDeck && 
          <RemoveDeckWindow
            isOpen={isOpenRemoveDeck}
            closeWindow={closeRemoveDeck}
            deckId={idDeck}
            parentDeckId={idParentDeck}
            name={actualDeck?.name}
          />          
        }

        <div className="decks">
          <h3>Mazos</h3>
          {
            loading ? 
              <SpinnerComponent/>
            :
            <>
              {decks?.length > 0 ? 
                
                <div className={decksStyles.decks}>
                  {decks.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      deckId={deck.id}
                      name={deck.name}
                      description={deck.description}
                      parentDeckId={idDeck}
                    />
                  ))}
                </div>
                :
                <h3>No hay mazos que mostrar</h3>
              }
            </> 
          }
          
          <button
            className={styles.roundedButtonTerciary}
            onClick={openCreateDeck}
          >
            Crear un nuevo mazo <NewFolderIcon/>
          </button>
          
        </div>

        <div className="Cards">
          <h3>Tarjetas</h3>
          {
            loading ? 
              <SpinnerComponent/>
            :
            <>
              {cards?.length > 0 ? 
                
                <div className={decksStyles.decks}>
                  {cards.map((card) => (
                    <CardContainer
                      key={card.id}
                      cardId={card.id}
                      front={card.front}
                      back={card.back}
                      createdAt={card.createdAt}
                    />
                  ))}
                </div>
                :
                <h3>Aún no tienes tarjetas en este mazo</h3>
              }
            </> 
          }
          
          <button
            className={styles.roundedButtonTerciary}
            onClick={openCreateCard}
          >
            Crear una nueva tarjeta <CreateIcon/>
          </button>

        </div>
        
      </section>

      <style jsx>{`

        h3 {
          padding: 20px 10px;
          font-weight: 600;
          font-size: 12px;
          color: rgba(0,0,0,.5);
          user-select: none;
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }

        hr{
          margin-top: 4px;
          border: 1px solid rgba(0,0,0,.02);
        }

      `}</style>
    </main>
    );
}

export default index;
