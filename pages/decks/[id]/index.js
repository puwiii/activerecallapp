import React, { useEffect, useState } from "react";
import Head from 'next/head'
import { useRouter } from "next/router";

//styles
import styles from "styles/Home.module.scss";

//firebase
import { getDeck, listenForDecks, listenForDeck } from "firebase/client";

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, {USER_STATES} from "components/hooks/useUser";

//components
import DeckContainer from "components/DeckContainer";
import CreateDeckWindow from "components/CreateDeckWindow";
import SpinnerComponent from "components/SpinnerComponent";
import NewFolderIcon from "components/icons/NewFolderIcon";
import CreateIcon from "components/icons/CreateIcon";

function index() {

  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [loading, setLoading] = useState(true)
  const [idDeck, setIdDeck] = useState()
  const [actualDeck, setActualDeck] = useState()
  const [decks, setDecks] = useState();

  const[cards, setCards] = useState();

  let user = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }
  }, user);

  useEffect(()=>{
    setIdDeck(router.query.id)
  },router.query.id)

  useEffect(()=>{
    if(idDeck) {
      //getDeck(idDeck, setActualDeck)
      listenForDeck(idDeck, setActualDeck)
    }
  },idDeck)

  useEffect(()=>{
    if(actualDeck){
      listenForDecks(actualDeck, setDecks)
    }
  }, actualDeck)

  useEffect(()=>{
    if(decks){
      listenForDecks(actualDeck, setDecks)
      setLoading(false)
    }
  }, [decks])

  return (
    <main className={styles.main}>
      <Head>
        <title>{actualDeck ? actualDeck.name : "Mis Mazos/Liza"}</title>
      </Head>

      {/* {user === USER_STATES.NOT_KNOWN && //debiera ir spinner
                
                
                } */}
      <section>
        <CreateDeckWindow
          isOpen={isOpenCreateDeck}
          closeWindow={closeCreateDeck}
          id={idDeck}
        />

        <div className="decks">
          <h2>Mazos</h2>
          {
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
          opacity: 0.5;
          font-weight: 600;
          font-size: 12px;
        }

        .decks,
        .cards {
          margin-bottom: 40px;
        }

        .decks__container{
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
      `}</style>
    </main>
    );
}

export default index;
