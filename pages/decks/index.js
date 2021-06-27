import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//firebase
import { listenForUserDecks } from "firebase/client";

//styles
import styles from "styles/Home.module.scss";
import decksStyles from "styles/Decks.module.scss"

//components
import CreateDeckWindow from "components/popups/CreateDeckWindow";
import DeckContainer from "components/DeckContainer";
import NewFolderIcon from "components/icons/NewFolderIcon";
import SpinnerComponent from "components/SpinnerComponent";

//hooks
import { useModal } from "components/hooks/useModal";
import useUser, { USER_STATES } from "components/hooks/useUser";


function index() {
  const [isOpenCreateDeck, openCreateDeck, closeCreateDeck] = useModal(false);
  const [loading, setLoading] = useState(true)
  const [decks, setDecks] = useState();

  let user = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user === USER_STATES.NOT_LOGGED) {
      router.replace("/signin");
    }

    if (user) {

      if(!user.emailVerified){
        router.replace("/signin/emailverification");
      }
      else{
        listenForUserDecks(setDecks);
      }
    }
  }, [user]);

  useEffect(()=>{
    if(decks){
      setLoading(false)
    }
  }, [decks])

  return (
    <main className={styles.main}>
      <Head>
        <title>Mis mazos - Liza</title>
      </Head>

      <h1 className={styles.title}>Mis Mazos</h1>

      <section>
        <CreateDeckWindow
          isOpen={isOpenCreateDeck}
          closeWindow={closeCreateDeck}
        />

        <div className={`decks`}>
          {/* <h2>Mazos</h2> */}
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
                      deckId={deck.id}
                      name={deck.name}
                      description={deck.description}
                      isPoster={true}
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

        
      `}</style>
    </main>
  );
}

export default index;
