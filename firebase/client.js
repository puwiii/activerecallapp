import firebase from "firebase";

import decks from "pages/api/decks";

// import 'firebase/firestore'
// import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDeKcyHA_5L3MB_rCJ1I-8gSV9hFBHgXV0",
  authDomain: "activerecallapp.firebaseapp.com",
  projectId: "activerecallapp",
  storageBucket: "activerecallapp.appspot.com",
  messagingSenderId: "276942806108",
  appId: "1:276942806108:web:6ffd9fa1b52340c48b9a99",
  measurementId: "G-K95VWWN3GB",
};

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

const database = firebase.firestore();

// const storage = firebase.storage();

const mapUserFromFirebaseAuth = (user) => {
  const { displayName, email, photoURL, uid, emailVerified } = user;

  return {
    uid: uid,
    username: displayName,
    email: email,
    avatar: photoURL,
    emailVerified: emailVerified,
  };
};

export const onAuthStateChanged = (onChange) => {
  return firebase.auth().onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null;

    onChange(normalizedUser);
  });
};

export const loginWithGmail = () => {
  const gmailProvider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(gmailProvider);
};

export const saveUserInFirestore = (user) => {
  const { uid, displayName, photoURL, email } = user;

  return database.collection("users").doc(uid).set({
    uid: uid,
    username: displayName,
    photoURL: photoURL,
    email: email,
  });
};

export const createCard = (deckId, front, back) => {
    
  let user = database.collection("users").doc(auth.currentUser.uid);

  console.log(deckId)

  return database
  .collection("cards")
  .add({
    front: front,
    back: back,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    author: user,
  })
  .then((cardRef)=>{
    console.log(cardRef)
    //setting the deckToAdd to their parent deck
    database
    .collection("decks")
    .doc(deckId)
    .update({
      cards:  firebase.firestore.FieldValue.arrayUnion(cardRef)
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch(()=>{
      console.log("An error ocurred while updating deck")
    })
  })
  .catch((e) => {
    console.log(e.message);
  });

}

export const createDeck = (id, name, description = "") => {
  let user = database.collection("users").doc(auth.currentUser.uid);

  if(id){
    let deckToAdd
    
    return database
    .collection("decks")
    .add({
      name: name,
      description: description,
      cards: [],
      decks: [],
      author: user,
    })
    .then((deckObject)=>{
      deckToAdd = deckObject

      //setting the deckToAdd to their parent deck
      database
      .collection("decks")
      .doc(id)
      .update({
        decks:  firebase.firestore.FieldValue.arrayUnion(deckToAdd)
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(()=>{
        console.log("An error ocurred while updating deck")
      })
    })
    .catch((e) => {
      console.log(e.message);
    });
  }

  else{
    return database
    .collection("decks")
    .add({
      name: name,
      description: description,
      cards: [],
      decks: [],
      user: user,
      author: user,
    })
    .then(console.log("deck created"))
    .catch((e) => {
      console.log(e.message);
    });
  }
  
};

export const listenForUserDecks = (callback) => {
  let userReference = database.collection("users").doc(auth.currentUser.uid);
  return database
    .collection("decks")
    .where("user", "==", userReference)
    .onSnapshot(({ docs }) => {
      const decks = docs.map((doc) => {
        const id = doc.id;
        return { ...doc.data(), id };
      });
      callback(decks);
    });
};


export const listenForDeck = (id, setActualDecks, setDecks, setCards) => {
     database
    .collection("decks")
    .doc(id)
    .onSnapshot((data)=>{
      const deck = data.data()
      setActualDecks(deck)

      if(deck){
        listenForDecks(deck, setDecks)
        listenForCards(deck, setCards)
      } 
    });
};

export const listenForCards = (deck, setCards) => {
  let promise = deck.cards.map(cardItem=>{
    return database.collection("cards")
    .doc(cardItem.id)
    .get()
    .then((doc)=>{
      const id = doc.id;
      return {...doc.data(), id}
    })
  })
  
  Promise.all(promise).then(array=>{
    setCards(array)
  })
}

export const listenForDecks = (deck, callback) =>{
  let promise = deck.decks.map(deckItem=>{
    return database.collection("decks")
    .doc(deckItem.id)
    .get()
    .then((doc)=>{
      const id = doc.id;
      return {...doc.data(), id}
    })
  })
  
  Promise.all(promise).then(array=>{
    callback(array)
  })
}

export const clearDeckReference = (deckId, parentDeckId) => {
    console.log(`clearDeckReference >> ${parentDeckId}`)

    console.log(parentDeckId)
    if(parentDeckId === "none"){
    //  console.log("return true")
      return true
    }


    const parentDeckRef = database.collection("decks")
    .doc(parentDeckId)
  
    parentDeckRef.get()
    .then((doc)=>{
      const parentDeck = doc.data()
  
      const newDecks = parentDeck.decks.filter( deckItem => {
    //    console.log(`deck del parent >> ${deckItem.id}`)
   //     console.log(`deck a sacar >> ${deckId}`)
        return deckItem.id !== deckId
      })
  
      parentDeckRef.update({
        decks: newDecks
      })

    })  
  
}

export const removeDeck = (deckId) => {

  database.collection("decks")
  .doc(deckId)
  .get()
  .then((doc)=>{
    const deck = doc.data()
//    console.log(`removeDeck >> ${doc.id}`)
    
    if(deck?.decks.length > 0){
      deck.decks.forEach((deckItem)=>{
        database.collection("decks")
        .doc(deckItem.id)
        .get()
        .then((doc)=>{
          removeDeck(doc.id)
        })
      })
    }
    removeDeckFromFirestore(doc.id)


  })
}

const removeDeckFromFirestore = (deckId) => {
//  console.log(`removeDeckFromFirestore >> ${deckId} `)
  database.collection("decks")
  .doc(deckId)
  .delete()
  .then(()=>{
    console.log("borrado")
  })
  .catch(()=>{
    console.log("problema")
  })

}

export const uploadAvatarImage = (file, userId) => {
  const ref = storage.ref(`/avatars/${userId}`)
  const task = ref.put(file)

  return task
}


export { auth, database };
