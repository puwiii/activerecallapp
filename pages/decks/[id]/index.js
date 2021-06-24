import React, { useEffect, useState } from "react";
import Head from 'next/head'
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss";

//firebase
import { getDeck, listenForDecks, listenForDeck, auxiliar } from "firebase/client";

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, {USER_STATES} from "components/hooks/useUser";

//components
import DeckContainer from "components/DeckContainer";
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import SpinnerComponent from "components/SpinnerComponent";
import NewFolderIcon from "components/icons/NewFolderIcon";
import CreateIcon from "components/icons/CreateIcon";
import TrashIcon from "components/icons/TrashIcon";
import SettingsIcon from "components/icons/SettingsIcon";
import RemoveDeckWindow from "components/popups/RemoveDeckWindow";

function index() {

  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [isOpenRemoveDeck, openRemoveDeck, closeRemoveDeck] = useModal(false);

  const [loading, setLoading] = useState(true)
  const [idDeck, setIdDeck] = useState()
  const [actualDeck, setActualDeck] = useState()
  const [decks, setDecks] = useState();

  const[cards, setCards] = useState();

  let user = useUser();

  const router = useRouter();

  //check for user
  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }
  }, [user]);


  //get the router query id
  useEffect(()=>{
    setIdDeck(router.query.id)
  }, [router.query.id])


  useEffect(()=>{
    if(idDeck) {
      listenForDeck(idDeck, setActualDeck, setDecks)
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
        <title>{actualDeck ? actualDeck.name : "Mis Mazos/Liza"}</title>
      </Head>
      <h1 className={styles.title}>Mis Mazos</h1>
      {/* {user === USER_STATES.NOT_KNOWN && //debiera ir spinner
                
                
                } */}
      {actualDeck ? 
        <div className={decksStyles.header}>
          <h1 className={styles.subtitle}>{actualDeck.name}</h1> 
          <div>
            <button onClick={openRemoveDeck}><TrashIcon/><span>Eliminar mazo</span></button>
            <button><SettingsIcon/><span>Editar mazo</span></button>
          </div>
        </div>
          
        
        : 
        <SpinnerComponent/>
      }

      <hr/>
      
      <section>
        <CreateDeckWindow
          isOpen={isOpenCreateDeck}
          closeWindow={closeCreateDeck}
          id={idDeck}
        />

        <RemoveDeckWindow
          isOpen={isOpenRemoveDeck}
          closeWindow={closeRemoveDeck}
          id={idDeck}
          name={actualDeck?.name}
        />

        <div className="decks">
          <h2>Mazos</h2>
          {
            loading ? 
              <SpinnerComponent/>
            :
            <>
              {decks.length > 0 ? 
                
                <div className={decksStyles.decks}>
                  {decks.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      id={deck.id}
                      name={deck.name}
                      description={deck.description}
                    />
                  ))}
                </div>
                :
                <h2>No hay mazos que mostrar</h2>
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
          <h2>Tarjetas</h2>
          {/* {
            loading ? 
              <SpinnerComponent/>
            :
            <>
              {decks.length > 0 ? 
                
                <div className="decks__container">
                  {decks.map((deck) => (
                    <DeckContainer
                      key={deck.id}
                      id={deck.id}
                      name={deck.name}
                      description={deck.description}
                    />
                  ))}
                </div>
                :
                <h2>Aún no tienes tarjetas en este mazo</h2>
              }
            </> 
          } */}
          
          <button
            className={styles.roundedButtonTerciary}
            onClick={openCreateDeck}
          >
            Crear una nueva tarjeta <CreateIcon/>
          </button>

        </div>
        
      </section>

      <style jsx>{`

        h2 {
          padding: 20px;
          font-weight: 600;
          font-size: 12px;
          color: rgba(0,0,0,.5);
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }

        hr{
          margin-top: 4px;
          border: 1px solid rgba(0,0,0,.04);
        }

      `}</style>
    </main>
    );
}

export default index;
